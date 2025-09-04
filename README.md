# SentimentSense — Node.js Sentiment Analysis API

**Short summary:**  
A small, resume-ready Node.js (Express) API that accepts text and returns sentiment predictions with confidence. The server can forward text to a local ML microservice (FastAPI + Transformers) or call the Hugging Face Inference API directly.

## Features
- POST `/analyze` — accepts `{ "text": "..." }` and returns sentiment prediction + normalized output.
- Supports two backends:
  - Local FastAPI ML microservice (`ML_SERVICE_URL`).
  - Hugging Face Inference API (`HF_API_TOKEN`).
- CORS enabled for demo clients.
- Docker-friendly.

## Quick start (local, without Docker)
1. Clone repo and open terminal:
   ```bash
   git clone <your-repo-url>
   cd <repo>/server
