@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. It is not available in PATH.
  pause
  exit /b 1
)
echo Starting Little Smiles. Keep this window open while you use the demo.
node server.mjs
if errorlevel 1 pause
