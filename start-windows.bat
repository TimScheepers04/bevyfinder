@echo off
echo Starting BevyFinder Application...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart this script.
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Installing dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.

echo Starting the server...
echo The server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start

pause
