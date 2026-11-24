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
echo Step 3: push to GitHub (dev branch)
git -c http.sslBackend=openssl push origin dev
echo.
echo ==== Done ====
echo If there is a "dev to dev" line above, it worked.
pause
