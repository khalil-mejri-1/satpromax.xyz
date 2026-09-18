@echo off
echo ====================================================
echo  Starting SatProMax (Express Backend + Vite Frontend)
echo ====================================================

start "SatProMax Server (Port 7000)" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 2 /nobreak >nul
start "SatProMax Client (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo Done! Both backend and frontend are starting in separate windows.
