#!/usr/bin/env python3
"""
Тест подключения к Kaggle API
Проверяет настройку API без загрузки больших датасетов
"""

def test_kaggle_connection():
    """Тестируем подключение к Kaggle API"""
    print("🔍 Тестируем подключение к Kaggle API...")
    print("=" * 50)
    
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        print("✅ Kaggle пакет найден")
        
        api = KaggleApi()
        print("✅ API объект создан")
        
        api.authenticate()
        print("✅ Аутентификация успешна")
        
        # Тестируем получение списка датасетов (без загрузки)
        print("\n🔍 Тестируем доступ к API...")
        datasets = api.dataset_list(search="student", page_size=3)
        print(f"✅ Найдено {len(datasets)} датасетов по запросу 'student'")
        
        print("\n📋 Примеры найденных датасетов:")
        for i, dataset in enumerate(datasets[:3], 1):
            print(f"{i}. {dataset.ref} - {dataset.title}")
        
        print("\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ!")
        print("🚀 Можете запускать: python kaggle_downloader_venv.py")
        
        return True
        
    except ImportError:
        print("❌ Kaggle пакет не установлен")
        print("Установите: pip install kaggle")
        return False
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        print("\n💡 Возможные решения:")
        print("1. Проверьте файл kaggle.json в C:\\Users\\Dmitri\\.kaggle\\")
        print("2. Убедитесь, что файл содержит правильные учетные данные")
        print("3. Создайте новый API токен на https://www.kaggle.com/settings/account")
        return False

if __name__ == "__main__":
    test_kaggle_connection() 