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

// ─── COLOR HISTOGRAM ─────────────────────────────────────────
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

// ─── AI EMBEDDING ────────────────────────────────────────────
async function getAIEmbedding(buffer) {
  if (!process.env.HUGGINGFACE_TOKEN ||
      process.env.HUGGINGFACE_TOKEN === 'hf_your_token_here') return null;
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
    if (!resp.ok) return null;
    const data = await resp.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch { return null; }
}

// ─── VISUAL SEARCH ───────────────────────────────────────────
router.post('/visual', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a photo' });

    // Get embedding for uploaded photo
    let queryEmbedding = await getAIEmbedding(req.file.buffer);
    let searchMethod = 'ai';
    if (!queryEmbedding) {
      queryEmbedding = colorHistogram(req.file.buffer);
      searchMethod = 'color';
    }

    // Get all products
    const allProducts = await Product.find({ shopId: req.user.userId });
    if (allProducts.length === 0) {
      return res.json({ results: [], searchMethod,
        message: 'No products found. Add products with photos first.' });
    }

    const results = [];
    for (const product of allProducts) {
      let similarity = 0;

      if (product.embedding && product.embedding.length > 0 &&
          product.embedding.length === queryEmbedding.length) {
        similarity = cosineSimilarity(queryEmbedding, product.embedding);
      } else if (product.images && product.images.length > 0) {
        try {
          const imgResp = await fetch(product.images[0].url,
            { signal: AbortSignal.timeout(8000) });
          const imgBuf = Buffer.from(await imgResp.arrayBuffer());
          const productColor = colorHistogram(imgBuf);
          const queryColor = colorHistogram(req.file.buffer);
          similarity = cosineSimilarity(queryColor, productColor);
          // Save for future
          setImmediate(async () => {
            try {
              await Product.findByIdAndUpdate(product._id,
                { embedding: productColor, embeddingType: 'color' });
            } catch(e) {}
          });
        } catch(e) { similarity = 0; }
      }

      results.push({
        ...product.toObject(),
        similarity,
        matchPercent: Math.round(similarity * 100)
      });
    }

    // Sort by similarity
    results.sort((a, b) => b.similarity - a.similarity);

    // ─── SMART FILTERING ─────────────────────────────────────
    // Only show genuinely matching products
    let filtered = [];
    
    if (results.length > 0) {
      const topScore = results[0].similarity;
      
      // If best match is very high (>80%) — show only high matches
      if (topScore > 0.80) {
        filtered = results.filter(r => r.similarity > 0.70);
      }
      // If best match is good (60-80%) — show matches within 20% of top
      else if (topScore > 0.60) {
        filtered = results.filter(r => r.similarity > 0.50);
      }
      // If best match is low — show top 3 only with warning
      else {
        filtered = results.slice(0, 3);
      }
    }

    // Maximum 8 results
    const topResults = filtered.slice(0, 8);

    res.json({
      results: topResults,
      count: topResults.length,
      searchMethod,
      topMatchPercent: topResults[0]?.matchPercent || 0,
      message: topResults.length > 0
        ? `Found ${topResults.length} matching cases`
        : 'No close matches found. Try a clearer photo.'
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

    let done = 0;
    for (const product of products) {
      try {
        const imgResp = await fetch(product.images[0].url,
          { signal: AbortSignal.timeout(10000) });
        const buf = Buffer.from(await imgResp.arrayBuffer());
        let embedding = await getAIEmbedding(buf);
        let embeddingType = 'ai';
        if (!embedding) {
          embedding = colorHistogram(buf);
          embeddingType = 'color';
        }
        await Product.findByIdAndUpdate(product._id, { embedding, embeddingType });
        done++;
        await new Promise(r => setTimeout(r, 500));
      } catch(e) {}
    }

    res.json({
      message: `Done! ${done} of ${products.length} products updated`,
      done, total: products.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed: ' + err.message });
  }
});

module.exports = router;