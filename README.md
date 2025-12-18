# 🚀 GrowMore - AI-Powered Startup Funding Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

A comprehensive platform connecting startups with investors using intelligent AI-powered matching algorithms. Built with modern technologies and featuring a beautiful gradient UI design.

## ✨ Features

### For Startups
- 📝 Create and manage startup profiles
- 🤖 AI-powered investor matching
- 💼 Track funding proposals
- 📊 View analytics and metrics
- 💬 Direct messaging with investors
- 📄 Upload pitch decks and documents

### For Investors
- 🔍 Browse startup opportunities
- 🎯 AI-recommended matches based on preferences
- ⭐ Watchlist functionality
- 📈 Portfolio tracking
- 🎨 Customizable industry and stage filters
- 💰 Budget-aligned recommendations

### AI Matching Engine
- **Industry Matching** (50% weight) - Aligns startup industries with investor interests
- **Budget Alignment** (20% weight) - Matches funding requirements with investment capacity
- **Stage Preference** (15% weight) - Connects based on startup growth stage
- **Keyword Similarity** (15% weight) - Uses Jaccard similarity for keyword matching
- **Real-time Scoring** - Instant match score calculation via FastAPI

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React/Vite    │────▶ │  Node.js/Express│────▶ │    MongoDB      │
│   Frontend      │      │     Backend     │      │    Database     │
│   Port: 5173    │      │   Port: 5000    │      │   Port: 27017   │
└─────────────────┘      └────────┬────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  FastAPI/Python │
                         │   AI Service    │
                         │   Port: 8000    │
                         └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling with gradient design system
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **Mongoose 8** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File uploads

### AI Service
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Jaccard similarity** - Keyword matching algorithm

### Database
- **MongoDB** - NoSQL database for flexible data storage

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/growmore.git
cd growmore
```

### 2. Setup Backend
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Setup AI Service
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## ▶️ Running the Application

### Start all services (requires 4 terminals):

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - AI Service:**
```bash
# Windows
start-ai-service.bat

# Linux/Mac
./start-ai-service.sh
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **AI Service:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📁 Project Structure

```
GrowMore/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API client configuration
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                 # Node.js backend server
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── uploads/            # File upload directory
│   └── server.js           # Entry point
│
├── ai-service/             # FastAPI AI matching service
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # AI service documentation
│
└── README.md              # This file
```

## 🔑 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/growmore
JWT_SECRET=your_super_secret_jwt_key_here
TOKEN_EXPIRY=7d
PORT=5000
AI_SERVICE_URL=http://localhost:8000
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Startups
- `GET /startups` - List all startups
- `POST /startups` - Create startup
- `GET /startups/discover` - Browse startups

### AI Matching
- `GET /ai/match/:startupId` - Get AI matches for startup

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with cutting-edge web technologies
- AI algorithms based on research in matching systems
- Design inspired by contemporary gradient aesthetics

---

**Made with ❤️ by the GrowMore Team**

## Key Backend Routes
- `POST /auth/register` – Register (startup or investor)
- `POST /auth/login` – Login
- `POST /startups` – Create startup (startup/admin) with optional logo/pitch deck
- `GET /investors` – List investors (authenticated)
- `GET /ai/match/:startupId` – Get AI matches for a startup (startup/admin)

## Models
User fields include industriesInterestedIn, interests, keywords, investmentBudget, stagePreferences.
Startup fields include industry[], stage, fundingRequirementMin/Max, keywords[], aiMatches cache.

## Setup Backend
1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:
```powershell
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

## Setup Frontend
```powershell
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`.

## Basic Flow
1. Register a startup user and login.
2. Create a startup with industries + keywords.
3. Register an investor user in a separate browser/tab or via API; update investor with industriesInterestedIn, keywords, investmentBudget.
4. On startup dashboard choose "View AI Matches" to fetch top matches.

## AI Matching Engine
Located at `backend/ai/matchingEngine.js`.
- Normalizes text
- Computes industry overlap proportion
- Evaluates budget range compatibility
- Checks stage preference
- Computes keyword Jaccard similarity across startup keywords and investor keywords/interests
- Generates reason strings
- Caches top matches on the startup document for up to 2 hours.

## Future Enhancements
- Add TF-IDF / cosine similarity for descriptions
- Add investor activity weighting
- Pagination & filtering on frontend
- Admin approval workflow

## Disclaimer
Prototype quality for demonstration; not production hardened.
#   G r o w M o r e  
 