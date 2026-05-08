#!/bin/bash

# 部署脚本 - Vercel 部署

echo "🚀 开始部署到 Vercel..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在"
    echo "📝 请先创建 .env 文件并填写 Supabase 凭证"
    exit 1
fi

# 构建测试
echo "🔨 测试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
    
    # 部署到 Vercel
    echo "🌐 部署到 Vercel..."
    vercel --prod
    
    echo "🎉 部署完成！"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
