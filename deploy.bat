@echo off
chcp 65001 >nul
echo 🚀 开始发布到 GitHub...
echo.

REM 检查是否已初始化 Git
if not exist ".git" (
    echo 📦 初始化 Git 仓库...
    git init
    echo ✅ Git 仓库初始化完成
    echo.
)

REM 添加所有文件
echo 📝 添加文件到暂存区...
git add .
echo ✅ 文件添加完成
echo.

REM 提交更改
echo 💾 提交更改...
set /p commit_message="请输入提交信息 (默认: Update): "
if "%commit_message%"=="" set commit_message=Update
git commit -m "%commit_message%"
echo ✅ 提交完成
echo.

REM 检查是否已添加远程仓库
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo 🔗 添加远程仓库...
    set /p repo_url="请输入 GitHub 仓库地址 (例如: https://github.com/username/repo.git): "
    git remote add origin %repo_url%
    echo ✅ 远程仓库添加完成
    echo.
)

REM 推送到 GitHub
echo ⬆️  推送到 GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 发布成功！
    echo.
    echo 📍 下一步：
    echo 1. 访问你的 GitHub 仓库
    echo 2. 进入 Settings ^> Pages
    echo 3. 选择 Source: main branch
    echo 4. 等待几分钟后访问你的网站
    echo.
) else (
    echo.
    echo ❌ 发布失败，请检查错误信息
    echo.
)

pause
