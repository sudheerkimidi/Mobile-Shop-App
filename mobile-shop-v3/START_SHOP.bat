@echo off
title ShopManager Launcher
color 0A
echo.
echo  ================================================
echo   MOBILE SHOP MANAGER - STARTING
echo  ================================================
echo.
echo  Killing old processes on ports 5000 and 3000...
FOR /F "tokens=5" %%P IN ('netstat -ano 2^>nul ^| findstr ":5000 " ^| findstr "LISTENING"') DO (
    taskkill /PID %%P /F >nul 2>&1
)
FOR /F "tokens=5" %%P IN ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') DO (
    taskkill /PID %%P /F >nul 2>&1
)
echo  Ports cleared.
echo.
echo  Starting Backend...
start "BACKEND - Keep Open" cmd /k "cd /d "%~dp0backend" && node server.js"
echo  Waiting for MongoDB to connect...
timeout /t 7 /nobreak >nul
echo  Starting Frontend...
start "FRONTEND - Keep Open" cmd /k "cd /d "%~dp0frontend" && npm start"
echo.
echo  ================================================
echo   Both servers starting!
echo   Open browser to: http://localhost:3000
echo   Keep BOTH black windows OPEN
echo  ================================================
echo.
pause
