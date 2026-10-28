@echo off
title Launch IMovies Cinema System
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo ===================================================
echo     Launching IMovies Cinema Full-Stack System
echo ===================================================
echo.
echo 1. Starting Backend API Server (Port 5000)...
start "IMovies Backend Server" cmd /k "start-backend.bat"

echo 2. Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak >nul

echo 3. Starting Frontend React Client (Port 5173)...
start "IMovies Frontend Client" cmd /k "start-frontend.bat"

echo.
echo ===================================================
echo   Done! Both servers are running in new windows.
echo   - Backend API: http://localhost:5000/api/health
echo   - Website UI:  http://localhost:5173
echo ===================================================
echo.
pause
