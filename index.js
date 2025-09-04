// server/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ML_SERVICE = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const HF_TOKEN = process.env.HF_API_TOKEN || null;
const HF_MODEL_URL = process.env.HF_MODEL_URL || 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';

async function analyzeWithHF(text) {
  const resp = await axios.post(
    HF_MODEL_URL,
    { inputs: text },
    { headers: { Authorization: `Bearer ${HF_TOKEN}` }, timeout: 60000 }
  );
  // HF returns either array or object depending on model; normalize to array
  return resp.data;
}

async function analyzeWithMLService(text) {
  const resp = await axios.post(`${ML_SERVICE}/sentiment`, { text }, { timeout: 60000 });
  return resp.data && resp.data.predictions ? resp.data.predictions : resp.data;
}

app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text must be provided' });
    }

    let mlOutput;
    if (HF_TOKEN) {
      mlOutput = await analyzeWithHF(text.slice(0, 1000));
    } else {
      mlOutput = await analyzeWithMLService(text.slice(0, 1000));
    }

    // normalize first prediction if shape is [{ label, score }, ...]
    const top = Array.isArray(mlOutput) && mlOutput.length > 0 ? mlOutput[0] : null;
    const normalized = top ? { label: (top.label || '').toLowerCase(), score: top.score || top.confidence || null } : null;

    res.json({ ml: { predictions: mlOutput }, normalized });
  } catch (err) {
    console.error('Analyze error:', err?.response?.data || err.message || err);
    // if it's a HF rate limit or upstream error give that message where available
    const status = err?.response?.status || 500;
    const msg = err?.response?.data || err?.message || 'Failed to analyze sentiment';
    res.status(status).json({ error: msg });
  }
});

app.get('/', (req, res) => res.send('Sentiment API (Node) is running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
