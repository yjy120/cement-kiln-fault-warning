@echo off
cd /d "%~dp0"
echo === Submit your changes to GitHub ===
echo.
echo Step 1: save all your changes (git add)
git add -A
echo.
echo Step 2: commit (make a snapshot)
git commit -m "update from team %date% %time%"
echo.
echo Step 3: push to GitHub
git -c http.sslBackend=openssl push origin main
echo.
echo ==== Done ====
echo If there is a "main to main" line above, it worked.
pause
