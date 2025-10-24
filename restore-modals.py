#!/usr/bin/env python3
"""
恢复被错误删除的模态框和脚本引用
"""

import os
import re

# 需要检查的页面
PAGES = [
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

def restore_page(page):
    """恢复单个页面"""
    print(f"\n检查: {page}")
    
    backup_file = f"{page}.backup"
    if not os.path.exists(backup_file):
        print(f"  ⚠️  备份文件不存在")
        return False
    
    if not os.path.exists(page):
        print(f"  ⚠️  原文件不存在")
        return False
    
    try:
        # 读取当前文件
        with open(page, 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        # 读取备份文件
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_content = f.read()
        
        # 检查是否缺少 script 标签
        has_scripts = '</script>' in current_content
        
        if not has_scripts:
            print(f"  ⚠️  缺少 script 标签")
            
            # 从备份中提取 script 标签
            script_pattern = r'(<script[^>]*>.*?</script>)'
            scripts = re.findall(script_pattern, backup_content, re.DOTALL)
            
            if scripts:
                # 在 </body> 前添加 script 标签
                script_block = '\n    '.join(scripts)
                current_content = current_content.replace('</body>', f'\n    {script_block}\n</body>')
                print(f"  ✓ 添加了 {len(scripts)} 个 script 标签")
        
        # 检查是否缺少模态框
        has_modal = 'modal' in current_content.lower()
        backup_has_modal = 'modal' in backup_content.lower()
        
        if backup_has_modal and not has_modal:
            print(f"  ⚠️  可能缺少模态框HTML")
            
            # 提取备份中的模态框
            modal_pattern = r'(<!-- .*?模态框.*? -->.*?</div>\s*</div>)'
            modals = re.findall(modal_pattern, backup_content, re.DOTALL | re.IGNORECASE)
            
            if modals:
                # 在 </div> (app-container结束) 前添加模态框
                for modal in modals:
                    if modal not in current_content:
                        # 找到 footer 后面的位置
                        footer_pattern = r'(</footer>\s*</div>)'
                        if re.search(footer_pattern, current_content):
                            current_content = re.sub(
                                footer_pattern,
                                r'\1\n\n    ' + modal,
                                current_content,
                                count=1
                            )
                            print(f"  ✓ 添加了模态框HTML")
        
        # 保存修改
        with open(page, 'w', encoding='utf-8') as f:
            f.write(current_content)
        
        print(f"  ✅ 检查完成")
        return True
        
    except Exception as e:
        print(f"  ❌ 错误: {e}")
        return False

def main():
    print("=" * 60)
    print("恢复被错误删除的模态框和脚本引用")
    print("=" * 60)
    
    for page in PAGES:
        restore_page(page)
    
    print("\n" + "=" * 60)
    print("处理完成！")
    print("=" * 60)
    print("\n建议:")
    print("1. 检查每个页面是否正常显示")
    print("2. 测试模态框功能是否正常")
    print("3. 检查浏览器控制台是否有错误")

if __name__ == '__main__':
    main()
