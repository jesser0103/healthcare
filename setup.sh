#!/bin/bash

echo "===================================="
echo "Healthcare System - Setup Script"
echo "===================================="
echo ""

echo "[1/4] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed!"
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""

echo "[2/4] Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend installation failed!"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

echo "[3/4] Starting MongoDB..."
cd ../backend
docker-compose up -d
if [ $? -ne 0 ]; then
    echo "ERROR: MongoDB failed to start!"
    echo "Make sure Docker Desktop is running!"
    exit 1
fi
echo "✓ MongoDB started"
echo ""

echo "[4/4] Waiting for MongoDB to initialize..."
sleep 5
echo "✓ MongoDB ready"
echo ""

echo "===================================="
echo "Setup Complete! ✓"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Open TWO terminal windows"
echo ""
echo "Terminal 1 - Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "Then open: http://localhost:3001"
echo "===================================="
