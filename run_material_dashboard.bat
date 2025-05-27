@echo off
chcp 65001 >nul
echo 🎨 Запуск дашборда с Material UI дизайном
echo ============================================

echo.
echo 📦 Устанавливаем новые зависимости...
call ..\venv\Scripts\activate.bat
python -m pip install dash-mantine-components>=0.12.0 dash-bootstrap-components>=1.4.0

echo.
echo 🌐 Запускаем Material UI дашборд...
echo 📍 Дашборд будет доступен по адресу: http://localhost:8051
echo.
echo 💡 Для остановки нажмите Ctrl+C
echo.

python education_dashboard_material.py

pause 