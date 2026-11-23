@echo off
cd /d "%~dp0"
echo Pushing to GitHub...
echo.
git -c http.sslBackend=openssl push origin main
echo.
echo ==== Done ====
echo If no red error above, push succeeded.
echo If there is an error, take a screenshot and send it.
echo.
pause
