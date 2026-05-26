const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ─── COSINE SIMILARITY ───────────────────────────────────────
function cosineSimilarity(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  if (a.length !== b.length) return 0;
  let dot = 0, ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    ma += a[i] * a[i];
    mb += b[i] * b[i];
  }
  if (ma === 0 || mb === 0) return 0;
  return dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

// ─── COLOR HISTOGRAM (always works, no API needed) ───────────
function colorHistogram(buffer) {
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
  } catch { return new Array(64).fill(0.015625); }
}

// ─── AI EMBEDDING (HuggingFace CLIP) ─────────────────────────
async function getAIEmbedding(buffer) {
  if (!process.env.HUGGINGFACE_TOKEN ||
      process.env.HUGGINGFACE_TOKEN === 'hf_your_token_here' ||
      process.env.HUGGINGFACE_TOKEN.length < 10) {
    return null;
  }

  try {
    const resp = await fetch(
      'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/octet-stream'
        },
        body: buffer,
        signal: AbortSignal.timeout(25000)
      }
    );

    if (resp.status === 503) {
      console.log('HuggingFace model loading...');
      return null;
    }

    if (!resp.ok) {
      console.log('HuggingFace returned:', resp.status);
      return null;
    }

    const data = await resp.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.log('AI embedding error:', err.message);
    return null;
  }
}

// ─── VISUAL SEARCH ───────────────────────────────────────────
router.post('/visual', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a photo' });
    }

    console.log('Visual search started, size:', req.file.size, 'bytes');

    // Step 1: Get embedding for uploaded customer photo
    let queryEmbedding = null;
    let searchMethod = 'color';

    // Try AI first
    queryEmbedding = await getAIEmbedding(req.file.buffer);
    if (queryEmbedding) {
      searchMethod = 'ai';
      console.log('Using AI search, embedding length:', queryEmbedding.length);
    } else {
      // Use color histogram as reliable fallback
      queryEmbedding = colorHistogram(req.file.buffer);
      searchMethod = 'color';
      console.log('Using color search, embedding length:', queryEmbedding.length);
    }

    // Step 2: Get all products for this shop
    const allProducts = await Product.find({ shopId: req.user.userId });
    console.log('Total products to compare:', allProducts.length);

    if (allProducts.length === 0) {
      return res.json({
        results: [],
        searchMethod,
        message: 'No products found. Please add products with photos first.'
      });
    }

    const results = [];

    for (const product of allProducts) {
      let similarity = 0;

      // If product has stored embedding of same type — use it
      if (product.embedding && product.embedding.length > 0 &&
          product.embedding.length === queryEmbedding.length) {
        similarity = cosineSimilarity(queryEmbedding, product.embedding);
      }
      // If no stored embedding OR different length — generate color comparison now
      else if (product.images && product.images.length > 0) {
        try {
          const imgResp = await fetch(product.images[0].url,
            { signal: AbortSignal.timeout(8000) });
          const imgBuf = Buffer.from(await imgResp.arrayBuffer());
          const productColor = colorHistogram(imgBuf);
          const queryColor = colorHistogram(req.file.buffer);
          similarity = cosineSimilarity(queryColor, productColor);

          // Save this embedding for future use
          setImmediate(async () => {
            try {
              await Product.findByIdAndUpdate(product._id, {
                embedding: productColor,
                embeddingType: 'color'
              });
            } catch (e) {}
          });
        } catch (e) {
          console.log('Could not fetch product image:', e.message);
        }
      }

      results.push({
        ...product.toObject(),
        similarity,
        matchPercent: Math.round(similarity * 100)
      });
    }

    // Sort by similarity, best first
    results.sort((a, b) => b.similarity - a.similarity);

    // Return top 10
    const topResults = results.slice(0, 10);

    console.log('Visual search complete. Top match:', topResults[0]?.matchPercent + '%');

    res.json({
      results: topResults,
      count: topResults.length,
      searchMethod,
      message: topResults.length > 0
        ? `Found ${topResults.length} matches using ${searchMethod === 'ai' ? 'AI' : 'color'} search`
        : 'No matches found'
    });

  } catch (err) {
    console.error('Visual search error:', err);
    res.status(500).json({ message: 'Visual search failed: ' + err.message });
  }
});

// ─── REGENERATE ALL EMBEDDINGS ────────────────────────────────
router.post('/regenerate-all', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.user.userId,
      'images.0': { $exists: true }
    });

    console.log('Regenerating', products.length, 'products');
    let done = 0;

    for (const product of products) {
      try {
        const imgResp = await fetch(product.images[0].url,
          { signal: AbortSignal.timeout(10000) });
        const buf = Buffer.from(await imgResp.arrayBuffer());

        // Try AI first, fallback to color
        let embedding = await getAIEmbedding(buf);
        let embeddingType = 'ai';
        if (!embedding) {
          embedding = colorHistogram(buf);
          embeddingType = 'color';
        }

        await Product.findByIdAndUpdate(product._id, { embedding, embeddingType });
        done++;
        console.log(`✅ ${product.name} (${embeddingType})`);
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.log(`❌ ${product.name}:`, e.message);
      }
    }

    res.json({
      message: `✅ Done! ${done} of ${products.length} products updated`,
      done,
      total: products.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed: ' + err.message });
  }
});

module.exports = router;
