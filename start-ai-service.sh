#!/bin/bash
echo "Starting GrowMore AI Service..."
cd ai-service

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server on port 8000..."
python main.py
