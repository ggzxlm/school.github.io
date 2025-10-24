#!/bin/bash

# 批量修复页面导航结构的脚本
# 将旧的导航结构替换为统一的组件结构

echo "开始修复页面导航结构..."

# 需要修复的页面列表
pages=(
    "collection-task-management.html"
    "custom-model-builder.html"
    "data-classification.html"
    "data-quality-management.html"
    "data-security-management.html"
    "metadata-management.html"
    "model-evaluation.html"
    "report-center.html"
    "supervision-model-library.html"
)

# 备份目录
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "处理: $page"
        
        # 备份原文件
        cp "$page" "$backup_dir/"
        
        echo "  - 已备份到 $backup_dir/$page"
        echo "  - 需要手动修复此文件"
    else
        echo "跳过: $page (文件不存在)"
    fi
done

echo ""
echo "备份完成！所有文件已保存到: $backup_dir"
echo ""
echo "请手动修复以下内容："
echo "1. 在 <head> 中添加 Font Awesome CSS:"
echo "   <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">"
echo ""
echo "2. 替换 <body> 结构为:"
echo "   <div class=\"app-container\">"
echo "       <header id=\"top-navbar\"></header>"
echo "       <div class=\"main-wrapper\">"
echo "           <aside id=\"side-navbar\"></aside>"
echo "           <main class=\"content-area\">"
echo "               <!-- 页面内容 -->"
echo "           </main>"
echo "       </div>"
echo "       <footer id=\"footer\"></footer>"
echo "   </div>"
echo ""
echo "3. 在 </body> 前添加:"
echo "   <script src=\"js/components.js\"></script>"
echo ""
echo "修复完成后，请测试页面是否正常显示。"
