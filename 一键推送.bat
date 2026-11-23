@echo off
chcp 65001 >nul
title 推送代码到 GitHub
cd /d "%~dp0"

echo ============================================
echo   推送代码到 GitHub
echo ============================================
echo.
echo 正在推送，请稍候...
echo.

git -c http.sslBackend=openssl push origin main

echo.
echo ============================================
echo   如果上面没有红色报错、显示推送成功字样，
echo   就说明推送成功了。
echo   如有报错，请截图发给我。
echo ============================================
echo.
pause
