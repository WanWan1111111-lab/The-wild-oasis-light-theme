#!/bin/bash

# 双项目一键部署脚本
# 用法: ./deploy-all.sh

echo "🚀 开始部署前后台项目到 Vercel..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo -e "${YELLOW}⚠️  Vercel CLI 未安装${NC}"
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 安装失败，请手动安装: npm install -g vercel${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Vercel CLI 已就绪${NC}"
echo ""

# 登录检查
echo "🔐 检查 Vercel 登录状态..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "请先登录 Vercel:"
    vercel login
fi

echo ""
echo "=========================================="
echo "  选择部署项目"
echo "=========================================="
echo "1. 仅部署后台管理端 (Vite)"
echo "2. 仅部署前台用户端 (Next.js)"
echo "3. 部署两个项目"
echo "4. 退出"
echo "=========================================="
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 部署后台管理端..."
        cd administrator-final-6-final
        
        # 检查环境变量
        if [ ! -f .env ]; then
            echo -e "${YELLOW}⚠️  .env 文件不存在${NC}"
            echo "请先创建 .env 文件并填写 Supabase 凭证"
            exit 1
        fi
        
        # 测试构建
        echo "🔨 测试构建..."
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 构建失败${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ 构建成功${NC}"
        echo "🌐 开始部署..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}🎉 后台管理端部署完成！${NC}"
        ;;
        
    2)
        echo ""
        echo "📦 部署前台用户端..."
        cd user-final-6-after-server-actions
        
        # 检查环境变量
        if [ ! -f .env.local ]; then
            echo -e "${YELLOW}⚠️  .env.local 文件不存在${NC}"
            echo "请先创建 .env.local 文件并填写配置"
            exit 1
        fi
        
        # 测试构建
        echo "🔨 测试构建..."
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 构建失败${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ 构建成功${NC}"
        echo "🌐 开始部署..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}🎉 前台用户端部署完成！${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  重要提醒：${NC}"
        echo "1. 复制 Vercel 提供的域名"
        echo "2. 在 Vercel 控制台更新 NEXTAUTH_URL 环境变量"
        echo "3. 重新部署项目"
        ;;
        
    3)
        echo ""
        echo "📦 部署两个项目..."
        
        # 部署后台
        echo ""
        echo "=========================================="
        echo "  1/2 部署后台管理端"
        echo "=========================================="
        cd administrator-final-6-final
        
        if [ ! -f .env ]; then
            echo -e "${YELLOW}⚠️  后台 .env 文件不存在${NC}"
            echo "请先创建 .env 文件"
            exit 1
        fi
        
        echo "🔨 测试构建..."
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 后台构建失败${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ 后台构建成功${NC}"
        echo "🌐 部署后台..."
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 后台部署成功${NC}"
        else
            echo -e "${RED}❌ 后台部署失败${NC}"
            exit 1
        fi
        
        # 部署前台
        echo ""
        echo "=========================================="
        echo "  2/2 部署前台用户端"
        echo "=========================================="
        cd ../user-final-6-after-server-actions
        
        if [ ! -f .env.local ]; then
            echo -e "${YELLOW}⚠️  前台 .env.local 文件不存在${NC}"
            echo "请先创建 .env.local 文件"
            exit 1
        fi
        
        echo "🔨 测试构建..."
        npm run build
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 前台构建失败${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✅ 前台构建成功${NC}"
        echo "🌐 部署前台..."
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 前台部署成功${NC}"
        else
            echo -e "${RED}❌ 前台部署失败${NC}"
            exit 1
        fi
        
        echo ""
        echo "=========================================="
        echo -e "${GREEN}🎉 两个项目都部署完成！${NC}"
        echo "=========================================="
        echo ""
        echo -e "${YELLOW}⚠️  重要提醒：${NC}"
        echo "1. 复制前台 Vercel 域名"
        echo "2. 更新前台的 NEXTAUTH_URL 环境变量"
        echo "3. 重新部署前台项目"
        echo ""
        echo "📊 访问 Vercel 控制台查看部署详情："
        echo "https://vercel.com/dashboard"
        ;;
        
    4)
        echo "👋 退出部署"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  部署信息"
echo "=========================================="
echo "📱 Vercel 控制台: https://vercel.com/dashboard"
echo "🗄️  Supabase 控制台: https://app.supabase.com"
echo "📚 部署文档: 查看 双项目部署指南.md"
echo "=========================================="
echo ""
echo -e "${GREEN}✨ 部署流程完成！${NC}"
