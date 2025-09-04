# SentimentSense — Node.js Sentiment Analysis API

**Short summary:**  
A Node.js (Express) API that accepts text and returns sentiment predictions with confidence. The server can forward text to a local ML microservice (FastAPI + Transformers) or call the Hugging Face Inference API directly.

## Features
- POST `/analyze` — accepts `{ "text": "..." }` and returns sentiment prediction + normalized output.
- Supports two backends:
  - Local FastAPI ML microservice (`ML_SERVICE_URL`).
  - Hugging Face Inference API (`HF_API_TOKEN`).
- CORS enabled for demo clients.
- Docker-friendly.

