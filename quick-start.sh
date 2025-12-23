#!/bin/bash

echo "🚀 GrowMore Quick Start Script"
echo "================================"
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "    mongod"
    exit 1
fi
echo "✅ MongoDB is running"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your settings"
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
echo "✅ Backend ready"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
echo "✅ Frontend ready"
echo ""

# AI Service setup
echo "🤖 Setting up AI Service..."
cd ../ai-service
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "📦 Installing AI service dependencies..."
source venv/bin/activate
pip install -r requirements.txt
deactivate
echo "✅ AI Service ready"
echo ""

cd ..

echo "================================"
echo "✅ Setup complete!"
echo ""
echo "To start the application, run in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 (AI Service):"
echo "  ./start-ai-service.sh"
echo ""
echo "Terminal 3 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo "================================"
