@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "CODEX_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
set "PYTHON_CMD="

if exist "%CODEX_PYTHON%" set "PYTHON_CMD=%CODEX_PYTHON%"
if not defined PYTHON_CMD where python.exe >nul 2>nul && set "PYTHON_CMD=python.exe"
if not defined PYTHON_CMD where py.exe >nul 2>nul && set "PYTHON_CMD=py.exe"

if not defined PYTHON_CMD (
  echo.
  echo 未找到 Python，无法启动本地预览。
  echo 请安装 Python 3，或联系维护人员配置本地运行环境。
  echo.
  pause
  exit /b 1
)

echo.
echo 东嘎水库智慧建管平台本地预览已启动
echo 访问地址：http://127.0.0.1:8080/
echo.
echo 请保持此窗口开启。修改文件后，在浏览器中按 Ctrl+F5 刷新。
echo 需要停止预览时，在此窗口按 Ctrl+C。
echo.

start "" "http://127.0.0.1:8080/"
"%PYTHON_CMD%" -m http.server 8080 --bind 127.0.0.1 --directory "%~dp0site"

if errorlevel 1 (
  echo.
  echo 启动失败，可能是 8080 端口已被其他程序占用。
  pause
)
