@echo off
title IMovies Backend Server (Port 5000)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0\server"

echo ===================================================
echo        Starting IMovies Backend API Server
echo ===================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not recognized!
    pause
    exit /b 1
)

echo [INFO] Checking MongoDB service...
net start MongoDB >nul 2>nul

if not exist node_modules (
    echo [INFO] Installing backend dependencies (Express, Mongoose, JWT)...
    call npm install
)

echo [INFO] Seeding initial movie catalog and shows into MongoDB...
call npm run seed

echo [INFO] Starting Node.js server on http://localhost:5000 ...
call npm start
pause
