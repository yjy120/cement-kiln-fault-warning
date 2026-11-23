@echo off
chcp 65001 >nul
title 水泥窑线预警平台 - 一键安装依赖
cd /d "%~dp0"

echo ============================================
echo   水泥窑线异常检测与故障预警系统
echo   一键安装依赖脚本
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 没检测到 Node.js。
    echo 请先去 https://nodejs.org/ 下载 LTS 版安装，装完重新双击本脚本。
    echo.
    pause
    exit /b 1
)

echo [1/2] 检测到 Node.js：
node -v
echo.

echo [2/2] 正在安装依赖（使用国内镜像，请稍候）...
echo.
call npm install --registry=https://registry.npmmirror.com

if errorlevel 1 (
    echo.
    echo [失败] 依赖安装出错，请把上面的红色报错截图发群里。
) else (
    echo.
    echo ============================================
    echo [完成] 依赖装好了！
    echo 接下来双击「一键启动.bat」即可打开系统。
    echo ============================================
)
echo.
pause
