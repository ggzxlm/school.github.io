@echo off
chcp 65001 >nul
echo 🔄 开始更新到 GitHub...
echo.

REM 查看修改的文件
echo 📋 检查修改的文件...
git status --short
echo.

REM 询问是否继续
set /p confirm="是否继续提交这些更改？(y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ 已取消更新
    exit /b 0
)

REM 添加所有修改的文件
echo 📝 添加修改的文件...
git add .
echo ✅ 文件添加完成
echo.

REM 输入提交信息
set /p commit_message="请输入更新说明 (默认: 更新项目): "
if "%commit_message%"=="" set commit_message=更新项目

REM 提交更改
echo 💾 提交更改...
git commit -m "%commit_message%"
echo ✅ 提交完成
echo.

REM 推送到 GitHub
echo ⬆️  推送到 GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo 🎉 更新成功！
    echo.
    echo 📍 你的网站将在 1-2 分钟后自动更新
    echo 🌐 网站地址: https://ggzxlm.github.io/
    echo.
) else (
    echo.
    echo ❌ 更新失败，请检查错误信息
    echo.
)

pause
