@echo off
cd /d "%~dp0"
echo Pushing main and dev to GitHub...
echo.
echo [1/2] Push main (stable version)
git -c http.sslBackend=openssl push origin main
echo.
echo [2/2] Push dev (working branch)
git -c http.sslBackend=openssl push origin dev
echo.
echo ==== Done ====
echo If no red error above, both branches are on GitHub.
echo If there is an error, take a screenshot and send it.
echo.
pause
