# 🔄 项目更新指南

## 快速更新（推荐）⭐

### 使用更新脚本

**macOS/Linux:**
```bash
./update.sh
```

**Windows:**
双击运行 `update.bat` 或在命令行执行：
```bash
update.bat
```

脚本会自动：
1. 显示修改的文件
2. 询问是否继续
3. 添加所有修改
4. 提交更改
5. 推送到 GitHub

---

## 手动更新（3步）

### 步骤 1: 查看修改
```bash
git status
```

这会显示所有修改、新增、删除的文件。

### 步骤 2: 添加并提交
```bash
# 添加所有修改的文件
git add .

# 提交更改（替换为你的更新说明）
git commit -m "更新说明"
```

### 步骤 3: 推送到 GitHub
```bash
git push
```

---

## 📝 提交信息建议

好的提交信息示例：
- ✅ `添加采购项目全流程预警功能`
- ✅ `修复搜索功能的显示问题`
- ✅ `优化导航菜单结构`
- ✅ `更新项目文档`

不好的提交信息示例：
- ❌ `更新`
- ❌ `修改`
- ❌ `fix`

---

## 🔍 常用 Git 命令

### 查看状态
```bash
# 查看修改的文件
git status

# 查看详细的修改内容
git diff

# 查看提交历史
git log --oneline
```

### 撤销操作
```bash
# 撤销工作区的修改（未 add）
git checkout -- 文件名

# 撤销暂存区的修改（已 add，未 commit）
git reset HEAD 文件名

# 撤销最后一次提交（已 commit，未 push）
git reset --soft HEAD^
```

### 分支操作
```bash
# 查看所有分支
git branch -a

# 创建新分支
git checkout -b 新分支名

# 切换分支
git checkout 分支名

# 合并分支
git merge 分支名
```

---

## ⏰ 更新频率建议

### 小改动（每天）
```bash
git add .
git commit -m "日常更新：修复小问题"
git push
```

### 新功能（完成后）
```bash
git add .
git commit -m "新增功能：采购项目监督"
git push
```

### 重大更新（测试后）
```bash
git add .
git commit -m "重大更新：v2.0 版本发布"
git push
```

---

## 🌐 GitHub Pages 自动部署

推送到 GitHub 后：
1. GitHub 会自动检测到更新
2. 触发 GitHub Pages 构建
3. 1-2 分钟后网站自动更新

你可以在这里查看部署状态：
https://github.com/ggzxlm/school.github.io/actions

---

## 📊 查看更新历史

### 在 GitHub 网站上
访问：https://github.com/ggzxlm/school.github.io/commits/main

### 在命令行
```bash
# 查看最近 10 次提交
git log --oneline -10

# 查看某个文件的修改历史
git log --oneline -- 文件名

# 查看详细的提交信息
git log -p
```

---

## 🔄 更新流程图

```
修改代码
    ↓
git add .
    ↓
git commit -m "说明"
    ↓
git push
    ↓
GitHub 接收更新
    ↓
GitHub Pages 自动构建
    ↓
网站自动更新（1-2分钟）
```

---

## ⚠️ 注意事项

### 1. 推送前检查
- 确保代码没有错误
- 测试功能是否正常
- 检查是否有敏感信息

### 2. 提交信息清晰
- 简洁明了
- 说明做了什么
- 便于以后查找

### 3. 定期推送
- 不要积累太多修改
- 每完成一个功能就推送
- 避免冲突

### 4. 备份重要数据
- Git 是版本控制，不是备份
- 重要数据要另外备份
- 可以创建多个分支

---

## 🆘 遇到问题？

### 推送失败
```bash
# 先拉取最新代码
git pull

# 解决冲突后再推送
git push
```

### 忘记提交信息
```bash
# 修改最后一次提交信息
git commit --amend -m "新的提交信息"

# 强制推送（如果已经推送过）
git push --force
```

### 推送到错误的分支
```bash
# 切换到正确的分支
git checkout main

# 重新推送
git push
```

---

## 💡 最佳实践

1. **频繁提交**：每完成一个小功能就提交
2. **清晰的提交信息**：让别人（和未来的自己）能看懂
3. **推送前测试**：确保代码能正常运行
4. **使用分支**：开发新功能时创建新分支
5. **定期备份**：重要数据要有备份

---

## 🎯 快速参考

| 操作 | 命令 |
|------|------|
| 查看状态 | `git status` |
| 添加文件 | `git add .` |
| 提交更改 | `git commit -m "说明"` |
| 推送更新 | `git push` |
| 拉取更新 | `git pull` |
| 查看历史 | `git log` |
| 撤销修改 | `git checkout -- 文件名` |

---

## 🚀 开始更新

现在就运行更新脚本：

**macOS/Linux:**
```bash
./update.sh
```

**Windows:**
```bash
update.bat
```

或者手动执行：
```bash
git add .
git commit -m "你的更新说明"
git push
```

---

**记住：每次修改代码后，都要推送到 GitHub，网站才会更新！**
