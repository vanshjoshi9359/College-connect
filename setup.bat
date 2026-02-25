@echo off
echo ========================================
echo College Connect - First Time Setup
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
if not exist ".env" (
    echo Creating backend .env file...
    copy .env.example .env
)
call npm install
cd ..
echo.

echo Step 2: Installing Frontend Dependencies...
cd frontend
if not exist ".env" (
    echo Creating frontend .env file...
    copy .env.example .env
)
call npm install
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Before running the app:
echo 1. Make sure MongoDB is installed and running
echo 2. Edit backend/.env and set your MONGO_URI and JWT_SECRET
echo 3. Edit frontend/.env if needed
echo.
echo To start the application:
echo 1. Double-click start-backend.bat
echo 2. Double-click start-frontend.bat
echo.
echo Press any key to exit...
pause >nul
