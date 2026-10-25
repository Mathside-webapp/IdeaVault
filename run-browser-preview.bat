@echo off
cd /d "%~dp0"
echo Starting offline IdeaVault preview at http://localhost:8000
start "" "http://localhost:8000"
python -m http.server 8000 --directory web-preview
pause
