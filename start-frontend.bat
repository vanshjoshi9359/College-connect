@echo off
echo ========================================
echo Starting College Connect Frontend
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting frontend server...
echo Frontend will open in your browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start
