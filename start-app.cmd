@echo off
setlocal
cd /d "%~dp0"

set "NODE_DIR=C:\Users\novar\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=C:\Users\novar\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd"
set "PATH=%NODE_DIR%;%PATH%"

echo Paragraf Soru Asistani baslatiliyor...
echo Tarayicida acilacak adres: http://127.0.0.1:5173
echo Bu pencere acik kaldigi surece uygulama calisir.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://127.0.0.1:5173'"
"%PNPM_CMD%" run dev
pause
