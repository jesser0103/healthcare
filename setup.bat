@echo off
echo ====================================
echo Healthcare System - Setup Script
echo ====================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo [3/4] Starting MongoDB...
cd ..\backend
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: MongoDB failed to start!
    echo Make sure Docker Desktop is running!
    pause
    exit /b 1
)
echo ✓ MongoDB started
echo.

echo [4/4] Waiting for MongoDB to initialize...
timeout /t 5 /nobreak > nul
echo ✓ MongoDB ready
echo.

echo ====================================
echo Setup Complete! ✓
echo ====================================
echo.
echo Next steps:
echo 1. Open TWO terminal windows
echo.
echo Terminal 1 - Backend:
echo    cd backend
echo    npm run dev
echo.
echo Terminal 2 - Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo Then open: http://localhost:3001
echo ====================================
pause
