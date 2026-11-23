@echo off
cd /d "%~dp0"
echo === Pull latest code from GitHub ===
git pull origin main
echo.
echo ==== Done ====
echo "Already up to date" or a list of changed files means it worked.
pause
