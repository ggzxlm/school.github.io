#!/bin/bash

# 高校纪检审计监管一体化平台 - GitHub 发布脚本

echo "🚀 开始发布到 GitHub..."
echo ""

# 检查是否已初始化 Git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库初始化完成"
    echo ""
fi

# 添加所有文件
echo "📝 添加文件到暂存区..."
git add .
echo "✅ 文件添加完成"
echo ""

# 提交更改
echo "💾 提交更改..."
read -p "请输入提交信息 (默认: Update): " commit_message
commit_message=${commit_message:-"Update"}
git commit -m "$commit_message"
echo "✅ 提交完成"
echo ""

# 检查是否已添加远程仓库
if ! git remote | grep -q "origin"; then
    echo "🔗 添加远程仓库..."
    read -p "请输入 GitHub 仓库地址 (例如: https://github.com/username/repo.git): " repo_url
    git remote add origin "$repo_url"
    echo "✅ 远程仓库添加完成"
    echo ""
fi

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 发布成功！"
    echo ""
    echo "📍 下一步："
    echo "1. 访问你的 GitHub 仓库"
    echo "2. 进入 Settings > Pages"
    echo "3. 选择 Source: main branch"
    echo "4. 等待几分钟后访问你的网站"
    echo ""
else
    echo ""
    echo "❌ 发布失败，请检查错误信息"
    echo ""
fi
