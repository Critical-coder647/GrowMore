# GrowMore AI Matching Service

FastAPI-based AI service for intelligent startup-investor matching.

## Setup

1. Install Python 3.8+ if not already installed

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Run

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `GET /` - Service info
- `GET /health` - Health check
- `POST /match` - Match startup with investors

## Example Request

```json
POST /match
{
  "startup": {
    "id": "123",
    "name": "TechCorp",
    "industry": ["AI", "SaaS"],
    "stage": "Seed",
    "funding_min": 50000,
    "funding_max": 100000,
    "keywords": ["automation", "AI", "enterprise"],
    "description": "AI-powered automation platform"
  },
  "investors": [
    {
      "id": "inv1",
      "name": "John Investor",
      "email": "john@venture.com",
      "industries": ["AI", "FinTech"],
      "keywords": ["AI", "automation"],
      "budget_min": 10000,
      "budget_max": 150000,
      "preferred_stages": ["Seed", "Series A"]
    }
  ]
}
```

## Running on Different Port

```bash
uvicorn main:app --port 8001
```
