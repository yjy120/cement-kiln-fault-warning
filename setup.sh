#!/usr/bin/env bash
# 跨平台一键安装脚本（macOS / Linux / Git Bash）
# 用法：bash setup.sh
set -e
cd "$(dirname "$0")"

echo "============================================"
echo " 水泥窑线异常检测与故障预警系统 - 安装依赖"
echo "============================================"

if ! command -v node >/dev/null 2>&1; then
  echo "[错误] 没检测到 Node.js，请先安装 LTS 版：https://nodejs.org/"
  exit 1
fi

echo "Node 版本：$(node -v)"
echo "正在安装依赖（国内镜像）..."
npm install --registry=https://registry.npmmirror.com

echo "============================================"
echo "[完成] 依赖装好了！运行 npm run dev 启动。"
echo "============================================"
