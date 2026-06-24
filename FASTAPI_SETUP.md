# FastAPI backend setup

The frontend calls the Python API at `http://127.0.0.1:8000` by default.

## 1. Start the backend

```bash
cd /Users/dain/Desktop/workspace/mcp-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Add your OpenAI API key to `/Users/dain/Desktop/workspace/mcp-server/.env`:

```env
OPENAI_API_KEY=sk-...
```

Run FastAPI:

```bash
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

## 2. Start the frontend

```bash
cd /Users/dain/Desktop/workspace/apolo-components
npm run dev
```

Open `http://localhost:5173`.
