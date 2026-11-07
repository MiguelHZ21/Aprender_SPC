@echo off
title Mision SPC - Servidor de Calidad
color 0b
echo ========================================================
echo        MISIÓN SPC - CALIDAD E INTERPRETACIÓN
echo ========================================================
echo.
echo Iniciando servidor y conectando con Neon PostgreSQL...
echo.

cd /d "%~dp0"

REM Abrir navegador en 2 segundos
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3001"

REM Iniciar servidor Node.js
node server.js

if %errorlevel% neq 0 (
  echo.
  echo [ERROR] No se pudo arrancar el servidor. Verifica que tengas Node.js instalado.
  pause
)

