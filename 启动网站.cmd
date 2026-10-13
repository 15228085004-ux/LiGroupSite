@echo off
chcp 65001 >nul
title Li Group Website - local preview
cd /d "%~dp0"

echo ==========================================================
echo    Li Group Website  -  local preview
echo ==========================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [X] Node.js not found.
  echo     Install it first: https://nodejs.org  ^(LTS version^)
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/2] First run: installing dependencies ^(needs internet^)...
  call npm install --no-package-lock --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [X] Install failed. Check your network and run this file again.
    echo.
    pause
    exit /b 1
  )
) else (
  echo [1/2] Dependencies OK.
)

echo [2/2] Starting local preview...
echo.
echo     Address : http://127.0.0.1:5173/
echo.
echo     Keep this window OPEN while you look at the site.
echo     Close it ^(or press Ctrl+C^) to stop.
echo.

call npm run dev -- --port 5173 --open

echo.
echo Server stopped.
pause
