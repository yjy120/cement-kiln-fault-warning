@echo off
cd /d "%~dp0"
echo === Switch to dev branch (first time only) ===
echo.
git fetch origin
git checkout dev
if errorlevel 1 (
    echo dev branch not found on GitHub, creating it from current code...
    git checkout -b dev
)
echo.
echo === Sync dev with GitHub ===
git pull origin dev
echo.
echo ==== Done ====
echo You are now on the dev branch.
echo From now on use pull.bat and submit.bat as usual.
pause
