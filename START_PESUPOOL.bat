@echo off
title PESUPool Demo Launcher
echo ========================================================
echo Starting PESUPool DBMS Level 3 Platform
echo ========================================================

echo 1. Starting MySQL Server 8.4 on port 3307...
start "" /min "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="C:\Users\deeks\.gemini\antigravity\scratch\pesupool\mysql_data" --port=3307 --console

timeout /t 3 /nobreak >nul

echo 2. Starting Next.js Web Server on port 3000...
set "PATH=C:\Users\deeks\AppData\Local\Programs\nodejs;%PATH%"
cd /d "C:\Users\deeks\.gemini\antigravity\scratch\pesupool"

start "" /b cmd /c "npm run start"

timeout /t 2 /nobreak >nul

echo 3. Opening browser...
start http://localhost:3000

echo ========================================================
echo PESUPool is LIVE at http://localhost:3000
echo Leave this window open during your demonstration.
echo ========================================================
pause
