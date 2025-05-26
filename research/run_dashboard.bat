@echo off
chcp 65001 >nul
echo 🚀 Запуск дашборда образовательной платформы
echo ============================================

echo.
echo 📊 Активируем виртуальное окружение...
call ..\venv\Scripts\activate.bat

echo.
echo 🌐 Запускаем веб-дашборд...
echo 📍 Дашборд будет доступен по адресу: http://localhost:8050
echo.
echo 💡 Для остановки нажмите Ctrl+C
echo.

python education_dashboard.py

pause 