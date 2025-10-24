#!/bin/bash

# 高校纪检审计监管一体化平台 - 快速更新脚本

echo "🔄 开始更新到 GitHub..."
echo ""

# 查看修改的文件
echo "📋 检查修改的文件..."
git status --short
echo ""

# 询问是否继续
read -p "是否继续提交这些更改？(y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "❌ 已取消更新"
    exit 0
fi

# 添加所有修改的文件
echo "📝 添加修改的文件..."
git add .
echo "✅ 文件添加完成"
echo ""

# 输入提交信息
read -p "请输入更新说明 (默认: 更新项目): " commit_message
commit_message=${commit_message:-"更新项目"}

# 提交更改
echo "💾 提交更改..."
git commit -m "$commit_message"
echo "✅ 提交完成"
echo ""

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git push

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 更新成功！"
    echo ""
    echo "📍 你的网站将在 1-2 分钟后自动更新"
    echo "🌐 网站地址: https://ggzxlm.github.io/"
    echo ""
else
    echo ""
    echo "❌ 更新失败，请检查错误信息"
    echo ""
fi
