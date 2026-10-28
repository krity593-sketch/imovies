@echo off
title IMovies Frontend App (Port 5173)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0\client"

echo ===================================================
echo        Starting IMovies Frontend Client
echo ===================================================

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found!
    pause
    exit /b 1
)

if not exist node_modules (
    echo [INFO] Installing frontend dependencies (React, Vite, Tailwind, Lucide)...
    call npm install
)

echo [INFO] Launching Vite Dev Server on http://localhost:5173 ...
call npm run dev
pause
