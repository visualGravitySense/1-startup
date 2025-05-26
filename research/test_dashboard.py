#!/usr/bin/env python3
"""
Тестирование дашборда - проверка загрузки данных и работоспособности
"""

import sys
from pathlib import Path
import pandas as pd

def test_data_availability():
    """Проверяем доступность данных для дашборда"""
    print("🔍 Тестирование доступности данных для дашборда")
    print("=" * 50)
    
    DATA_DIR = Path("data/raw")
    
    if not DATA_DIR.exists():
        print("❌ Папка data/raw не найдена!")
        print("💡 Запустите сначала: python kaggle_downloader_venv.py")
        return False
    
    # Проверяем образовательные данные
    education_files = [
        ("Student Exams", DATA_DIR / "education" / "whenamancodes_students-performance-in-exams" / "exams.csv"),
        ("Student Performance", DATA_DIR / "education" / "larsen0966_student-performance-data-set" / "student-por.csv"),
        ("xAPI Education", DATA_DIR / "education" / "aljarah_xAPI-Edu-Data" / "xAPI-Edu-Data.csv")
    ]
    
    # Проверяем рыночные данные
    market_files = [
        ("Salary Data", DATA_DIR / "job_market" / "rkiattisak_salaly-prediction-for-beginer" / "Salary Data.csv"),
        ("Data Science Jobs", DATA_DIR / "job_market" / "andrewmvd_data-scientist-jobs" / "DataScientist.csv")
    ]
    
    print("\n📚 Образовательные данные:")
    education_available = 0
    for name, path in education_files:
        if path.exists():
            try:
                if name == "Student Performance":
                    df = pd.read_csv(path, sep=';')
                else:
                    df = pd.read_csv(path)
                print(f"  ✅ {name}: {len(df):,} записей")
                education_available += 1
            except Exception as e:
                print(f"  ⚠️  {name}: ошибка чтения - {e}")
        else:
            print(f"  ❌ {name}: файл не найден")
    
    print("\n💼 Рыночные данные:")
    market_available = 0
    for name, path in market_files:
        if path.exists():
            try:
                df = pd.read_csv(path)
                print(f"  ✅ {name}: {len(df):,} записей")
                market_available += 1
            except Exception as e:
                print(f"  ⚠️  {name}: ошибка чтения - {e}")
        else:
            print(f"  ❌ {name}: файл не найден")
    
    total_available = education_available + market_available
    total_expected = len(education_files) + len(market_files)
    
    print(f"\n📊 Итого: {total_available}/{total_expected} датасетов доступно")
    
    if total_available == 0:
        print("❌ Нет доступных данных для дашборда!")
        return False
    elif total_available < total_expected:
        print("⚠️  Некоторые данные недоступны, но дашборд может работать")
        return True
    else:
        print("✅ Все данные доступны!")
        return True

def test_dependencies():
    """Проверяем зависимости"""
    print("\n🔧 Проверка зависимостей:")
    
    required_packages = [
        ('pandas', 'pd'),
        ('plotly.express', 'px'),
        ('plotly.graph_objects', 'go'),
        ('dash', None)
    ]
    
    missing_packages = []
    
    for package, alias in required_packages:
        try:
            if alias:
                exec(f"import {package} as {alias}")
            else:
                exec(f"import {package}")
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package}")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Отсутствуют пакеты: {', '.join(missing_packages)}")
        print("💡 Установите их: pip install plotly dash pandas")
        return False
    else:
        print("✅ Все зависимости установлены!")
        return True

def test_dashboard_import():
    """Проверяем возможность импорта дашборда"""
    print("\n📦 Проверка импорта дашборда:")
    
    try:
        from education_dashboard import EducationDashboard
        print("  ✅ Импорт EducationDashboard успешен")
        
        # Пробуем создать экземпляр
        dashboard = EducationDashboard()
        print("  ✅ Создание экземпляра успешно")
        
        # Проверяем загрузку данных
        data_count = len(dashboard.data)
        print(f"  ✅ Загружено {data_count} датасетов")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Ошибка: {e}")
        return False

def main():
    """Основная функция тестирования"""
    print("🧪 ТЕСТИРОВАНИЕ ДАШБОРДА ОБРАЗОВАТЕЛЬНОЙ ПЛАТФОРМЫ")
    print("=" * 60)
    
    # Тестируем зависимости
    deps_ok = test_dependencies()
    
    # Тестируем данные
    data_ok = test_data_availability()
    
    # Тестируем импорт дашборда
    if deps_ok:
        import_ok = test_dashboard_import()
    else:
        import_ok = False
    
    # Итоговый результат
    print("\n" + "=" * 60)
    print("📋 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:")
    
    if deps_ok and data_ok and import_ok:
        print("🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Дашборд готов к запуску!")
        print("\n🚀 Для запуска выполните:")
        print("   python education_dashboard.py")
        print("   или")
        print("   run_dashboard.bat")
        print("\n🌐 Затем откройте: http://localhost:8050")
        return True
    else:
        print("❌ ЕСТЬ ПРОБЛЕМЫ:")
        if not deps_ok:
            print("  • Не установлены необходимые пакеты")
        if not data_ok:
            print("  • Нет данных для анализа")
        if not import_ok:
            print("  • Проблемы с кодом дашборда")
        
        print("\n💡 Рекомендации:")
        if not deps_ok:
            print("  1. Установите зависимости: pip install plotly dash pandas")
        if not data_ok:
            print("  2. Загрузите данные: python kaggle_downloader_venv.py")
        
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 