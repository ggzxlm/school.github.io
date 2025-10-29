@echo off
echo 正在启动服务器...
echo.

REM 尝试 python3
python3 -m http.server 8888 2>nul
if %errorlevel% neq 0 (
    REM 如果 python3 失败，尝试 python
    echo 尝试使用 python 命令...
    python -m http.server 8888
)

REM 如果都失败了
if %errorlevel% neq 0 (
    echo.
    echo 错误：无法启动服务器
    echo 请确保已安装 Python 3.x
    echo.
    pause
)
