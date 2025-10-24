# 🚀 快速发布到 GitHub

## 三步发布

### 1️⃣ 在 GitHub 创建仓库

访问 [https://github.com/new](https://github.com/new)，创建新仓库：
- 仓库名：`university-supervision-platform`
- 描述：`高校纪检审计监管一体化平台`
- 选择 Public
- **不要**勾选任何初始化选项

### 2️⃣ 运行发布脚本

**macOS/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
双击运行 `deploy.bat`

或手动执行：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 3️⃣ 启用 GitHub Pages

1. 进入仓库的 Settings
2. 点击左侧的 Pages
3. Source 选择 `main` 分支
4. 点击 Save
5. 等待几分钟

## 🎉 完成！

访问你的网站：
```
https://你的用户名.github.io/仓库名/
```

## 📱 主要页面

- 首页: `/`
- 快速访问: `/quick-access.html`
- 采购项目: `/test-procurement-project.html`
- 搜索演示: `/search-demo.html`

## 🔄 后续更新

```bash
git add .
git commit -m "更新说明"
git push
```

## 📖 详细文档

- [完整发布指南](GITHUB-DEPLOYMENT-GUIDE.md)
- [发布检查清单](DEPLOYMENT-CHECKLIST.md)

---

**就这么简单！🎊**
