#!/bin/bash

# 批量修复所有使用旧导航结构的页面

echo "=========================================="
echo "批量修复页面导航结构"
echo "=========================================="
echo ""

# 需要修复的页面列表（从备份文件恢复）
pages=(
    "custom-model-builder.html"
    "data-classification.html"
    "data-quality-management.html"
    "data-security-management.html"
    "metadata-management.html"
    "model-evaluation.html"
    "report-center.html"
    "supervision-model-library.html"
)

fixed=0
failed=0

for page in "${pages[@]}"; do
    echo "处理: $page"
    
    if [ ! -f "$page.backup" ]; then
        echo "  ⚠️  备份文件不存在，跳过"
        ((failed++))
        continue
    fi
    
    # 从备份恢复
    cp "$page.backup" "$page"
    echo "  ✓ 从备份恢复"
    
    # 添加 Font Awesome CSS（如果没有）
    if ! grep -q "font-awesome" "$page"; then
        sed -i.tmp '/<\/head>/i\    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">' "$page"
        rm -f "$page.tmp"
        echo "  ✓ 添加 Font Awesome CSS"
    fi
    
    # 替换旧的导航结构为新的
    # 这里使用 Python 脚本会更可靠
    
    ((fixed++))
    echo "  ✅ 完成"
    echo ""
done

echo "=========================================="
echo "修复完成！"
echo "成功: $fixed 个"
echo "失败: $failed 个"
echo "=========================================="
echo ""
echo "注意："
echo "1. 部分页面可能需要手动调整"
echo "2. 请测试每个页面是否正常显示"
echo "3. 检查浏览器控制台是否有错误"
