@echo off
chcp 65001 >nul
echo 🔧 Настройка папки для Kaggle API
echo ================================

echo.
echo 📁 Создаем папку .kaggle...
mkdir "%USERPROFILE%\.kaggle" 2>nul

echo ✅ Папка создана: %USERPROFILE%\.kaggle
echo.
echo 📋 СЛЕДУЮЩИЕ ШАГИ:
echo 1. Перейдите на https://www.kaggle.com/settings/account
echo 2. Нажмите "Create New Token" 
echo 3. Скачайте файл kaggle.json
echo 4. Скопируйте kaggle.json в папку: %USERPROFILE%\.kaggle\
echo.
echo 🚀 После этого запустите: python kaggle_downloader_venv.py
echo.
pause 