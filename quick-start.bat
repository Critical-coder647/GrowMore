@echo off
echo 🚀 GrowMore Quick Start Script
echo ================================
echo.

REM Backend setup
echo 🔧 Setting up Backend...
cd backend

if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env with your settings
)

if not exist node_modules (
    echo 📦 Installing backend dependencies...
    call npm install
)
echo ✅ Backend ready
echo.

REM Frontend setup
echo 🎨 Setting up Frontend...
cd ..\frontend
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    call npm install
)
echo ✅ Frontend ready
echo.

REM AI Service setup
echo 🤖 Setting up AI Service...
cd ..\ai-service
if not exist venv (
    echo 🐍 Creating Python virtual environment...
    python -m venv venv
)

echo 📦 Installing AI service dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
call deactivate
echo ✅ AI Service ready
echo.

cd ..

echo ================================
echo ✅ Setup complete!
echo.
echo To start the application, run in separate terminals:
echo.
echo Terminal 1 (Backend):
echo   cd backend ^&^& npm start
echo.
echo Terminal 2 (AI Service):
echo   start-ai-service.bat
echo.
echo Terminal 3 (Frontend):
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:5173
echo ================================
pause
