#!/bin/bash

# 批量修复缺失的 script 标签和模态框

echo "开始批量修复页面..."
echo ""

# 需要修复的页面列表
pages=(
    "custom-model-builder.html"
    "data-classification.html"
    "data-quality-management.html"
    "data-security-management.html"
    "metadata-management.html"
    "supervision-model-library.html"
)

for page in "${pages[@]}"; do
    echo "处理: $page"
    
    if [ ! -f "$page" ]; then
        echo "  ⚠️  文件不存在"
        continue
    fi
    
    if [ ! -f "$page.backup" ]; then
        echo "  ⚠️  备份文件不存在"
        continue
    fi
    
    # 检查是否缺少 script 标签
    script_count=$(grep -c "</script>" "$page" 2>/dev/null || echo "0")
    
    if [ "$script_count" -eq "0" ]; then
        echo "  ⚠️  缺少 script 标签，从备份恢复..."
        
        # 从备份文件提取 script 标签部分
        # 提取从第一个 <script 到 </body> 之间的内容
        awk '/<script/,/<\/body>/ {print}' "$page.backup" > /tmp/scripts_temp.txt
        
        # 从当前文件中删除 </body> 和 </html>
        sed -i.tmp '/<\/body>/d; /<\/html>/d' "$page"
        
        # 添加 script 标签和结束标签
        cat /tmp/scripts_temp.txt >> "$page"
        
        echo "  ✓ 已添加 script 标签"
    else
        echo "  ✓ script 标签完整"
    fi
    
    echo ""
done

echo "修复完成！"
echo ""
echo "建议："
echo "1. 检查每个页面是否正常显示"
echo "2. 测试页面功能是否正常"
echo "3. 查看浏览器控制台是否有错误"
