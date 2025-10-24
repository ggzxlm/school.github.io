# GitHub 发布指南

## 📋 准备工作

### 1. 确保已安装 Git

检查 Git 是否已安装：
```bash
git --version
```

如果未安装，请访问 [https://git-scm.com/](https://git-scm.com/) 下载安装。

### 2. 配置 Git

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

## 🚀 发布步骤

### 步骤 1: 在 GitHub 上创建新仓库

1. 访问 [https://github.com/new](https://github.com/new)
2. 填写仓库信息：
   - **Repository name**: `university-supervision-platform` (或你喜欢的名字)
   - **Description**: `高校纪检审计监管一体化平台`
   - **Public/Private**: 选择 Public（公开）
   - **不要**勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

### 步骤 2: 初始化本地仓库

在项目根目录打开终端，执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: 高校纪检审计监管一体化平台"
```

### 步骤 3: 连接远程仓库

将 `你的用户名` 替换为你的 GitHub 用户名，`仓库名` 替换为你创建的仓库名：

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 4: 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"
2. 在左侧菜单找到 "Pages"
3. 在 "Source" 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
4. 点击 "Save"
5. 等待几分钟，页面会显示访问地址：
   ```
   Your site is published at https://你的用户名.github.io/仓库名/
   ```

## 📝 后续更新

### 更新代码到 GitHub

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到 GitHub
git push
```

### 常用 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature
```

## 🌐 访问你的项目

### GitHub 仓库地址
```
https://github.com/你的用户名/仓库名
```

### GitHub Pages 地址
```
https://你的用户名.github.io/仓库名/
```

### 主要页面

- 首页: `https://你的用户名.github.io/仓库名/`
- 快速访问: `https://你的用户名.github.io/仓库名/quick-access.html`
- 采购项目: `https://你的用户名.github.io/仓库名/test-procurement-project.html`
- 搜索演示: `https://你的用户名.github.io/仓库名/search-demo.html`

## 🔧 更新 README.md

发布后，记得更新 `README.md` 中的链接：

1. 将所有 `你的用户名` 替换为实际的 GitHub 用户名
2. 将所有 `仓库名` 替换为实际的仓库名

## 📊 项目统计

发布后，你可以在 GitHub 仓库页面看到：

- ⭐ Stars（收藏数）
- 👁️ Watchers（关注数）
- 🍴 Forks（分支数）
- 📈 Insights（统计信息）

## 🎯 推广你的项目

### 1. 添加项目标签

在仓库页面点击 "About" 旁边的齿轮图标，添加标签：
- `javascript`
- `html`
- `css`
- `supervision`
- `audit`
- `procurement`
- `university`

### 2. 编写详细的 README

确保 README.md 包含：
- ✅ 项目简介
- ✅ 功能特性
- ✅ 快速开始
- ✅ 使用文档
- ✅ 贡献指南
- ✅ 许可证信息

### 3. 添加截图

在 README.md 中添加项目截图：

```markdown
## 📸 项目截图

### 采购项目全流程预警
![采购项目](screenshots/procurement.png)

### 全局搜索功能
![搜索功能](screenshots/search.png)
```

## ❓ 常见问题

### Q: 推送时提示权限错误？

A: 需要配置 GitHub 认证：

**方式一：使用 Personal Access Token**
1. 访问 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择权限（至少需要 `repo`）
4. 生成后复制 token
5. 推送时使用 token 作为密码

**方式二：使用 SSH**
```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 添加到 GitHub
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub

# 在 GitHub Settings > SSH and GPG keys 中添加
```

### Q: GitHub Pages 没有生效？

A: 检查以下几点：
1. 确保已在 Settings > Pages 中启用
2. 等待几分钟让 GitHub 构建
3. 检查 Actions 标签页是否有构建错误
4. 确保 `index.html` 在根目录

### Q: 如何删除远程仓库？

A: 在 GitHub 仓库页面：
1. 点击 "Settings"
2. 滚动到底部
3. 点击 "Delete this repository"
4. 按提示操作

## 📞 获取帮助

- GitHub 文档: [https://docs.github.com](https://docs.github.com)
- Git 文档: [https://git-scm.com/doc](https://git-scm.com/doc)
- GitHub Pages 文档: [https://pages.github.com](https://pages.github.com)

## 🎉 完成！

恭喜！你的项目已经成功发布到 GitHub！

现在你可以：
- ✅ 分享项目链接
- ✅ 邀请其他人协作
- ✅ 接收 Issues 和 Pull Requests
- ✅ 持续更新和改进

---

**祝你的项目获得更多 Stars！⭐**
