const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// ─── GENERATE COLOR HISTOGRAM (backup embedding — always works) ──
function generateColorHistogram(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    const hist = new Array(64).fill(0);
    for (let i = 0; i < bytes.length - 2; i += 50) {
      const r = Math.floor(bytes[i] / 64);
      const g = Math.floor((bytes[i+1] || 0) / 64);
      const b = Math.floor((bytes[i+2] || 0) / 64);
      hist[(r * 16 + g * 4 + b) % 64]++;
    }
    const total = hist.reduce((a, b) => a + b, 0);
    return total > 0 ? hist.map(v => v / total) : hist;
  } catch { return new Array(64).fill(0); }
}

// ─── GET AI EMBEDDING (tries HuggingFace, falls back to color) ──
async function getEmbedding(imageUrl) {
  try {
    const imgResp = await fetch(imageUrl, { signal: AbortSignal.timeout(15000) });
    const imgBuffer = Buffer.from(await imgResp.arrayBuffer());

    // Try HuggingFace AI
    if (process.env.HUGGINGFACE_TOKEN && process.env.HUGGINGFACE_TOKEN !== 'hf_your_token_here') {
      try {
        const aiResp = await fetch(
          'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
              'Content-Type': 'application/octet-stream'
            },
            body: imgBuffer,
            signal: AbortSignal.timeout(20000)
          }
        );
        if (aiResp.ok) {
          const data = await aiResp.json();
          if (Array.isArray(data) && data.length > 0) {
            console.log('✅ AI embedding generated, length:', data.length);
            return { embedding: data, embeddingType: 'ai' };
          }
        }
      } catch (aiErr) {
        console.log('AI embedding failed, using color fallback:', aiErr.message);
      }
    }

    // Fall back to color histogram — always works
    const colorEmb = generateColorHistogram(imgBuffer);
    console.log('✅ Color histogram generated as embedding');
    return { embedding: colorEmb, embeddingType: 'color' };

  } catch (err) {
    console.error('Embedding generation failed:', err.message);
    return { embedding: [], embeddingType: 'none' };
  }
}

// ─── ADD PRODUCT ────────────────────────────────────────────
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    console.log('Add product called by:', req.user.userId);
    console.log('Body:', req.body);
    console.log('Files:', req.files?.length || 0, 'files');

    const { name, deviceModel, category, caseType,
            designStyle, brand, color, price,
            quantity, shelfLocation, tags } = req.body;

    if (!name || !deviceModel) {
      return res.status(400).json({ message: 'Product name and device model are required' });
    }

    const images = (req.files || []).map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    const product = new Product({
      shopId: req.user.userId,
      name: name.trim(),
      deviceModel: deviceModel.trim(),
      category: category || 'Phone Case',
      caseType: caseType || '',
      designStyle: designStyle || '',
      brand: brand || '',
      color: color || '',
      price: price ? Number(price) : 0,
      quantity: quantity ? Number(quantity) : 0,
      shelfLocation: shelfLocation || '',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images,
      isAvailable: quantity > 0
    });

    await product.save();
    console.log('✅ Product saved:', product._id);

    // Generate embedding in background — don't block response
    if (images.length > 0) {
      setImmediate(async () => {
        try {
          const { embedding, embeddingType } = await getEmbedding(images[0].url);
          if (embedding.length > 0) {
            await Product.findByIdAndUpdate(product._id, { embedding, embeddingType });
            console.log(`✅ Embedding saved for product ${product._id} (${embeddingType})`);
          }
        } catch (e) {
          console.log('Background embedding failed:', e.message);
        }
      });
    }

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Error adding product: ' + err.message });
  }
});

// ─── TEXT SEARCH ─────────────────────────────────────────────
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q, caseType, designStyle } = req.query;
    let products = [];

    if (q && q.trim()) {
      // First try text search
      try {
        const textResults = await Product.find(
          { shopId: req.user.userId, $text: { $search: q.trim() } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } }).limit(50);

        products = textResults;
      } catch (e) {
        console.log('Text search failed, using regex:', e.message);
      }

      // If text search returns nothing, use regex (partial match)
      if (products.length === 0) {
        const regex = new RegExp(q.trim(), 'i');
        products = await Product.find({
          shopId: req.user.userId,
          $or: [
            { deviceModel: regex },
            { name: regex },
            { brand: regex },
            { caseType: regex },
            { tags: { $in: [regex] } }
          ]
        }).limit(50);
      }
    } else {
      products = await Product.find({ shopId: req.user.userId })
        .sort({ createdAt: -1 }).limit(50);
    }

    // Apply filters
    if (caseType) products = products.filter(p => p.caseType === caseType);
    if (designStyle) products = products.filter(p => p.designStyle === designStyle);

    res.json({ results: products, count: products.length });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed: ' + err.message });
  }
});

// ─── GET STATS (dashboard) ───────────────────────────────────
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const shopId = req.user.userId;
    const [total, outOfStock, lowStock] = await Promise.all([
      Product.countDocuments({ shopId }),
      Product.countDocuments({ shopId, quantity: 0 }),
      Product.countDocuments({ shopId, quantity: { $gt: 0, $lte: 5 } })
    ]);

    // Simple category stats without problematic aggregate
    const allProducts = await Product.find({ shopId }).select('caseType');
    const catMap = {};
    allProducts.forEach(p => {
      if (p.caseType) catMap[p.caseType] = (catMap[p.caseType] || 0) + 1;
    });
    const categoryStats = Object.entries(catMap)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ total, outOfStock, lowStock, categoryStats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Stats failed: ' + err.message });
  }
});

// ─── GET ALL PRODUCTS ─────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find({ shopId: req.user.userId })
        .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments({ shopId: req.user.userId })
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ─── GET SINGLE PRODUCT ───────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// ─── UPDATE PRODUCT (EDIT) ────────────────────────────────────
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updates = {};
    const fields = ['name','deviceModel','category','caseType','designStyle','brand','color','shelfLocation','tags'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.quantity !== undefined) {
      updates.quantity = Number(req.body.quantity);
      updates.isAvailable = updates.quantity > 0;
    }
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      updates.images = [...product.images, ...newImages];

      // Generate embedding for new image
      setImmediate(async () => {
        try {
          const { embedding, embeddingType } = await getEmbedding(newImages[0].url);
          if (embedding.length > 0) {
            await Product.findByIdAndUpdate(product._id, { embedding, embeddingType });
          }
        } catch (e) { console.log('Update embedding failed:', e.message); }
      });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Update failed: ' + err.message });
  }
});

// ─── DELETE PRODUCT ───────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopId: req.user.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    for (const img of product.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId).catch(() => {});
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
