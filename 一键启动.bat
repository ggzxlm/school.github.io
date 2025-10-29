@echo off
chcp 65001 >nul
title 高校纪检审计监管一体化平台 - 本地服务器

echo.
echo ========================================
echo   高校纪检审计监管一体化平台
echo   University Supervision Platform
echo ========================================
echo.
echo [信息] 正在启动本地服务器...
echo [端口] 8888
echo [地址] http://localhost:8888
echo.

REM 检查Python是否安装
echo [检查] 正在检测 Python 环境...
python3 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 未检测到 python3 命令，尝试使用 python 命令...
    python --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 未安装 Python 或 Python 未添加到系统环境变量
        echo.
        echo 请按以下步骤操作：
        echo 1. 下载 Python 3.x: https://www.python.org/downloads/
        echo 2. 安装时务必勾选 "Add Python to PATH"
        echo 3. 安装完成后重新运行此文件
        echo.
        echo 按任意键退出...
        pause >nul
        exit /b 1
    )
    set PYTHON_CMD=python
    echo [成功] 检测到 python 命令
) else (
    set PYTHON_CMD=python3
    echo [成功] 检测到 python3 命令
)

REM 显示Python版本
for /f "tokens=2" %%i in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [版本] Python %PYTHON_VERSION%
echo.

REM 检查端口是否被占用
echo [检查] 正在检测端口 8888 是否可用...
netstat -ano | findstr ":8888" >nul 2>&1
if %errorlevel% equ 0 (
    echo [警告] 端口 8888 已被占用！
    echo.
    echo 请选择操作：
    echo 1. 继续尝试启动（可能失败）
    echo 2. 退出并使用其他端口
    echo.
    set /p choice=请输入选择 (1 或 2): 
    if "%choice%"=="2" (
        echo.
        echo 提示：可以使用 "启动服务器.bat" 选择其他端口
        echo.
        pause
        exit /b 1
    )
)

echo [成功] 端口 8888 可用
echo.

REM 等待2秒后自动打开浏览器
echo [提示] 2秒后将自动打开浏览器...
echo.
timeout /t 2 /nobreak >nul

REM 在后台打开浏览器
start http://localhost:8888/index.html
echo [成功] 浏览器已启动
echo.

echo ========================================
echo   服务器运行中...
echo   访问地址: http://localhost:8888
echo   按 Ctrl+C 可停止服务器
echo ========================================
echo.

REM 启动Python HTTP服务器
%PYTHON_CMD% -m http.server 8888

REM 如果服务器意外停止
echo.
echo [提示] 服务器已停止
echo.
pause
