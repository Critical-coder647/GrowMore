# GrowMore - Complete Setup Guide

## Architecture

- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5000)
- **AI Service**: FastAPI + Python (Port 8000)
- **Database**: MongoDB (Port 27017)

## Setup Steps

### 1. Install Dependencies

**MongoDB:**
- Download and install MongoDB Community Edition
- Start MongoDB service: `mongod`

**Node.js Backend:**
```bash
cd backend
npm install
```

**React Frontend:**
```bash
cd frontend
npm install
```

**Python AI Service:**
```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration

**Backend (.env):**
```
MONGO_URI=mongodb://localhost:27017/growmore
JWT_SECRET=supersecretjwt
PORT=5000
TOKEN_EXPIRY=7d
AI_SERVICE_URL=http://localhost:8000
```

**AI Service (.env):**
```
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0
```

### 3. Start Services

**Option A: Manual Start (separate terminals)**

Terminal 1 - MongoDB:
```bash
mongod
```

Terminal 2 - Backend:
```bash
cd backend
npm start
```

Terminal 3 - AI Service:
```bash
# Windows
start-ai-service.bat

# Linux/Mac
./start-ai-service.sh
```

Terminal 4 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Quick Start (Windows)**
- Double-click `start-ai-service.bat`
- Run backend: `cd backend && npm start`
- Run frontend: `cd frontend && npm run dev`

### 4. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- AI Docs: http://localhost:8000/docs

## API Flow

1. User creates startup via frontend form
2. Frontend → Backend (POST /startups)
3. Backend saves to MongoDB
4. User requests AI matches (GET /ai/match/:startupId)
5. Backend → FastAPI AI Service (POST /match)
6. AI Service computes matches and returns scores
7. Backend saves matches to MongoDB
8. Frontend displays top matches

## Tech Stack Summary

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Axios
- **Backend**: Node.js, Express 4, Mongoose 8, JWT, Multer
- **AI**: FastAPI, Pydantic, Uvicorn
- **Database**: MongoDB
