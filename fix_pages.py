#!/usr/bin/env python3
"""
批量修复页面导航结构
将旧的导航结构替换为统一的组件结构
"""

import os
import re
from pathlib import Path

# 需要修复的页面列表
PAGES_TO_FIX = [
    "collection-task-management.html",
    "custom-model-builder.html",
    "data-classification.html",
    "data-quality-management.html",
    "data-security-management.html",
    "metadata-management.html",
    "model-evaluation.html",
    "report-center.html",
    "supervision-model-library.html",
]

# Font Awesome CDN
FONT_AWESOME_CDN = '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

# 新的 body 结构模板
NEW_BODY_STRUCTURE = '''<body>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <header id="top-navbar"></header>

        <div class="main-wrapper">
            <!-- 侧边导航栏 -->
            <aside id="side-navbar"></aside>

            <!-- 主内容区 -->
            <main class="content-area">
{content}
            </main>
        </div>

        <!-- 页脚 -->
        <footer id="footer"></footer>
    </div>'''


def fix_page(filepath):
    """修复单个页面"""
    print(f"处理: {filepath}")
    
    if not os.path.exists(filepath):
        print(f"  ⚠️  文件不存在，跳过")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. 添加 Font Awesome CSS（如果还没有）
        if 'font-awesome' not in content:
            content = content.replace('</head>', f'{FONT_AWESOME_CDN}\n</head>')
            print("  ✓ 添加 Font Awesome CSS")
        
        # 2. 添加 components.js（如果还没有）
        if 'components.js' not in content:
            content = content.replace(
                '<script src="js/common.js"></script>',
                '<script src="js/common.js"></script>\n    <script src="js/components.js"></script>'
            )
            print("  ✓ 添加 components.js 引用")
        
        # 3. 提取主内容区的内容
        # 查找 <main> 或 <div class="main-content"> 等主内容区
        main_content_patterns = [
            r'<main[^>]*>(.*?)</main>',
            r'<div class="main-content"[^>]*>(.*?)</div>\s*</body>',
            r'<div class="content"[^>]*>(.*?)</div>\s*</body>',
        ]
        
        main_content = None
        for pattern in main_content_patterns:
            match = re.search(pattern, content, re.DOTALL)
            if match:
                main_content = match.group(1).strip()
                break
        
        if not main_content:
            print("  ⚠️  无法提取主内容区，需要手动修复")
            return False
        
        # 4. 替换 body 结构
        # 查找 <body> 到 </body> 之间的内容
        body_pattern = r'<body>(.*?)</body>'
        body_match = re.search(body_pattern, content, re.DOTALL)
        
        if body_match:
            # 生成新的 body 内容
            new_body_content = NEW_BODY_STRUCTURE.format(content=main_content)
            
            # 替换整个 body
            content = content.replace(body_match.group(0), new_body_content + '\n</body>')
            print("  ✓ 替换 body 结构")
        else:
            print("  ⚠️  无法找到 body 标签，需要手动修复")
            return False
        
        # 5. 保存修改后的文件
        if content != original_content:
            # 备份原文件
            backup_path = f"{filepath}.backup"
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original_content)
            print(f"  ✓ 已备份到 {backup_path}")
            
            # 保存新文件
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ 修复完成")
            return True
        else:
            print("  ℹ️  无需修改")
            return False
            
    except Exception as e:
        print(f"  ❌ 错误: {e}")
        return False


def main():
    """主函数"""
    print("=" * 60)
    print("批量修复页面导航结构")
    print("=" * 60)
    print()
    
    fixed_count = 0
    failed_count = 0
    skipped_count = 0
    
    for page in PAGES_TO_FIX:
        result = fix_page(page)
        if result:
            fixed_count += 1
        elif result is False:
            failed_count += 1
        else:
            skipped_count += 1
        print()
    
    print("=" * 60)
    print("修复完成！")
    print(f"✅ 成功修复: {fixed_count} 个")
    print(f"❌ 修复失败: {failed_count} 个")
    print(f"⏭️  跳过: {skipped_count} 个")
    print("=" * 60)
    print()
    print("注意事项：")
    print("1. 原文件已备份为 .backup 后缀")
    print("2. 请测试修复后的页面是否正常显示")
    print("3. 如有问题，可以从备份文件恢复")
    print("4. 部分页面可能需要手动调整 CSS 样式")


if __name__ == '__main__':
    main()
