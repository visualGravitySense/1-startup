@echo off
chcp 65001 >nul
echo 🚀 Загрузка Kaggle датасетов для исследования образовательной платформы
echo ================================================================

echo.
echo 📦 Установка зависимостей...
pip install -r requirements.txt

echo.
echo 📥 Запуск загрузки датасетов...
python kaggle_data_downloader.py

echo.
echo ✅ Готово! Проверьте папку data/ для загруженных датасетов
pause 