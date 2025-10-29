@echo off
echo ====================================
echo 调试模式 - 检测系统环境
echo ====================================
echo.

echo [1] 检测 Python3...
python3 --version
if %errorlevel% neq 0 (
    echo    结果: 未找到 python3 命令
) else (
    echo    结果: 找到 python3
)
echo.

echo [2] 检测 Python...
python --version
if %errorlevel% neq 0 (
    echo    结果: 未找到 python 命令
) else (
    echo    结果: 找到 python
)
echo.

echo [3] 检测端口 8888...
netstat -ano | findstr ":8888"
if %errorlevel% neq 0 (
    echo    结果: 端口 8888 可用
) else (
    echo    结果: 端口 8888 已被占用
)
echo.

echo [4] 检测当前目录...
echo    当前目录: %CD%
echo.

echo [5] 检测 index.html...
if exist "index.html" (
    echo    结果: 找到 index.html
) else (
    echo    结果: 未找到 index.html
)
echo.

echo ====================================
echo 调试信息收集完成
echo ====================================
echo.
echo 请将以上信息截图或复制
echo.
pause
