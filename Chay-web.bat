@echo off
setlocal
title Chi phi binh quan
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Khong tim thay Node.js. Vui long cai Node.js 22 tro len.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Dang cai dat cac goi phu thuoc lan dau...
  call npm install
  if errorlevel 1 (
    echo Cai dat that bai.
    pause
    exit /b 1
  )
)

echo Dang khoi dong web tai http://localhost:3000
start "" http://localhost:3000
call npm run dev
pause
