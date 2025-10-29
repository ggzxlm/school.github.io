@echo off
chcp 65001 >nul
color 0A
title 高校纪检审计监管一体化平台 - 本地服务器

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║        高校纪检审计监管一体化平台                      ║
echo ║    University Supervision Platform                     ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo  [1] 启动服务器 (端口 8888)
echo  [2] 启动服务器 (端口 8000)
echo  [3] 启动服务器 (自定义端口)
echo  [4] 仅打开浏览器
echo  [5] 查看帮助
echo  [0] 退出
echo.
set /p choice=请选择操作 (0-5): 

if "%choice%"=="1" goto START_8888
if "%choice%"=="2" goto START_8000
if "%choice%"=="3" goto START_CUSTOM
if "%choice%"=="4" goto OPEN_BROWSER
if "%choice%"=="5" goto HELP
if "%choice%"=="0" goto END
goto MENU

:START_8888
set PORT=8888
goto START_SERVER

:START_8000
set PORT=8000
goto START_SERVER

:START_CUSTOM
echo.
set /p PORT=请输入端口号 (1024-65535): 
if "%PORT%"=="" set PORT=8888
goto START_SERVER

:START_SERVER
cls
echo.
echo ════════════════════════════════════════════════════════
echo   正在启动服务器...
echo ════════════════════════════════════════════════════════
echo.

REM 检查Python
python3 --version >nul 2>&1
if %errorlevel% neq 0 (
    python --version >nul 2>&1
    if %errorlevel% neq 0 (
        color 0C
        echo [错误] 未安装 Python
        echo.
        echo 请先安装 Python 3.x
        echo 下载地址: https://www.python.org/downloads/
        echo.
        pause
        goto MENU
    )
    set PYTHON_CMD=python
) else (
    set PYTHON_CMD=python3
)

REM 显示Python版本
for /f "tokens=2" %%i in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [✓] Python 版本: %PYTHON_VERSION%
echo [✓] 端口号: %PORT%
echo [✓] 访问地址: http://localhost:%PORT%
echo.

REM 检查端口是否被占用
netstat -ano | findstr ":%PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    color 0E
    echo [警告] 端口 %PORT% 已被占用
    echo.
    set /p continue=是否继续尝试启动? (Y/N): 
    if /i not "%continue%"=="Y" goto MENU
)

echo ════════════════════════════════════════════════════════
echo   服务器启动中，请稍候...
echo ════════════════════════════════════════════════════════
echo.

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 打开浏览器
start http://localhost:%PORT%/index.html
echo [✓] 浏览器已启动
echo.

echo ════════════════════════════════════════════════════════
echo   服务器运行中...
echo   访问地址: http://localhost:%PORT%
echo   按 Ctrl+C 可停止服务器
echo ════════════════════════════════════════════════════════
echo.

REM 启动服务器
%PYTHON_CMD% -m http.server %PORT%

REM 服务器停止后
color 0E
echo.
echo [提示] 服务器已停止
pause
goto MENU

:OPEN_BROWSER
cls
echo.
echo 请选择要打开的页面:
echo.
echo  [1] 首页 (index.html)
echo  [2] 系统架构图 (system-architecture.html)
echo  [3] 快速访问 (quick-access.html)
echo  [4] 架构文档索引 (architecture-index.html)
echo  [0] 返回主菜单
echo.
set /p page_choice=请选择 (0-4): 

if "%page_choice%"=="1" start http://localhost:8888/index.html
if "%page_choice%"=="2" start http://localhost:8888/system-architecture.html
if "%page_choice%"=="3" start http://localhost:8888/quick-access.html
if "%page_choice%"=="4" start http://localhost:8888/architecture-index.html
if "%page_choice%"=="0" goto MENU

echo.
echo [✓] 浏览器已启动
timeout /t 2 >nul
goto MENU

:HELP
cls
echo.
echo ════════════════════════════════════════════════════════
echo   使用帮助
echo ════════════════════════════════════════════════════════
echo.
echo 【启动服务器】
echo   选择端口号启动本地HTTP服务器
echo   推荐使用端口 8888 或 8000
echo.
echo 【访问系统】
echo   服务器启动后会自动打开浏览器
echo   也可以手动访问: http://localhost:端口号
echo.
echo 【停止服务器】
echo   在服务器运行窗口按 Ctrl+C
echo   然后按 Y 确认停止
echo.
echo 【常见问题】
echo   1. 端口被占用: 更换其他端口
echo   2. Python未安装: 安装Python 3.x
echo   3. 页面404: 检查文件路径
echo.
echo 【快捷访问】
echo   首页: http://localhost:8888/index.html
echo   架构图: http://localhost:8888/system-architecture.html
echo   快速访问: http://localhost:8888/quick-access.html
echo.
echo ════════════════════════════════════════════════════════
echo.
pause
goto MENU

:END
cls
echo.
echo 感谢使用！
echo.
timeout /t 1 >nul
exit
