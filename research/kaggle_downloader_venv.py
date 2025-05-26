#!/usr/bin/env python3
"""
Kaggle Dataset Downloader for Educational Platform Research (Virtual Environment Version)
Скрипт для загрузки датасетов с Kaggle через Python API
"""

import os
import sys
from pathlib import Path
import zipfile
import tempfile

# Создаем директории для данных
DATA_DIR = Path("data")
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Создаем необходимые директории
for dir_path in [DATA_DIR, RAW_DATA_DIR, PROCESSED_DATA_DIR]:
    dir_path.mkdir(exist_ok=True)

# Список датасетов для загрузки согласно research-plan.md
DATASETS = {
    # 1. Образовательные данные
    "education": [
        "deviakumbach/student-performance-data",  # Student Performance
        "whenamancodes/students-performance-in-exams",  # Exam Performance
        "spscientist/students-performance-in-exams",  # Academic Performance
        "larsen0966/student-performance-data-set",  # Learning Analytics
        "aljarah/xAPI-Edu-Data",  # Educational Process Mining
        "uciml/student-performance-data-set",  # UCI Student Performance
    ],
    
    # 2. Рыночные данные и навыки
    "job_market": [
        "promptcloud/jobs-on-naukricom",  # Job Market Analysis
        "rkiattisak/salaly-prediction-for-beginer",  # Salary Prediction
        "andrewmvd/data-scientist-jobs",  # Data Science Jobs
        "arshkon/linkedin-job-postings",  # LinkedIn Jobs
        "lukebarousse/data-analyst-job-postings-google-search",  # Job Postings
    ],
    
    # 3. Технологические тренды
    "tech_trends": [
        "stackoverflow/stack-overflow-2022-developers-survey",  # Developer Survey
        "kaggle/kaggle-survey-2022",  # ML & DS Survey
        "stackoverflow/stackoverflow-developer-survey-2023",  # Latest Developer Trends
        "kaggle/state-of-data-science-and-machine-learning-2023",  # Data Science Trends
    ],
    
    # 4. Демографические и поведенческие данные
    "demographics": [
        "kaggle/meta-kaggle",  # Kaggle User Behavior
        "datasnaek/youtube-new",  # Online Learning Behavior
        "Cornell-University/arxiv",  # Academic Research Trends
        "rounakbanik/the-movies-dataset",  # Content Preferences
    ]
}

def check_kaggle_api():
    """Проверяем доступность Kaggle API"""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        print("✅ Kaggle API настроен корректно")
        return api
    except ImportError:
        print("❌ Kaggle пакет не найден")
        return None
    except Exception as e:
        print(f"❌ Ошибка аутентификации Kaggle API: {e}")
        print("\n💡 Для настройки API:")
        print("1. Зайдите на https://www.kaggle.com/settings/account")
        print("2. Создайте новый API токен")
        print("3. Скачайте kaggle.json")
        print("4. Поместите файл в %USERPROFILE%\\.kaggle\\kaggle.json")
        return None

def download_dataset_api(api, dataset_name, category):
    """Загружаем датасет через Kaggle API"""
    category_dir = RAW_DATA_DIR / category
    category_dir.mkdir(exist_ok=True)
    
    dataset_dir = category_dir / dataset_name.replace("/", "_")
    
    if dataset_dir.exists() and any(dataset_dir.iterdir()):
        print(f"⏭️  Датасет {dataset_name} уже загружен")
        return True
    
    print(f"📥 Загружаем {dataset_name}...")
    
    try:
        # Создаем временную директорию для загрузки
        with tempfile.TemporaryDirectory() as temp_dir:
            # Загружаем датасет
            api.dataset_download_files(dataset_name, path=temp_dir, unzip=True)
            
            # Перемещаем файлы в целевую директорию
            dataset_dir.mkdir(exist_ok=True)
            temp_path = Path(temp_dir)
            
            for file_path in temp_path.iterdir():
                if file_path.is_file():
                    target_path = dataset_dir / file_path.name
                    file_path.rename(target_path)
                elif file_path.is_dir():
                    # Копируем содержимое поддиректорий
                    import shutil
                    shutil.copytree(file_path, dataset_dir / file_path.name, dirs_exist_ok=True)
        
        print(f"✅ {dataset_name} загружен успешно")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка загрузки {dataset_name}: {e}")
        return False

def create_dataset_info():
    """Создаем файл с информацией о датасетах"""
    info_content = """# Загруженные датасеты для исследования образовательной платформы

## Структура данных

### 1. Образовательные данные (education/)
- Анализ успеваемости студентов
- Факторы влияющие на обучение
- Поведенческие паттерны в обучении

### 2. Рыночные данные (job_market/)
- Анализ вакансий и требований
- Зарплатные ожидания по навыкам
- Тренды в найме

### 3. Технологические тренды (tech_trends/)
- Опросы разработчиков
- Популярные технологии
- Направления развития индустрии

### 4. Демографические данные (demographics/)
- Поведение пользователей онлайн-платформ
- Предпочтения в обучении
- Географическое распределение

## Использование

Все данные находятся в папке `data/raw/` и организованы по категориям.
Обработанные данные сохраняются в `data/processed/`.

## Следующие шаги

1. Анализ качества данных
2. Очистка и предобработка
3. Исследовательский анализ данных (EDA)
4. Выявление инсайтов для продукта

## Загруженные датасеты

"""
    
    # Добавляем информацию о загруженных датасетах
    for category, datasets in DATASETS.items():
        info_content += f"\n### {category.title()}\n"
        for dataset in datasets:
            dataset_dir = RAW_DATA_DIR / category / dataset.replace("/", "_")
            status = "✅" if dataset_dir.exists() and any(dataset_dir.iterdir()) else "❌"
            info_content += f"- {status} {dataset}\n"
    
    with open(DATA_DIR / "README.md", "w", encoding="utf-8") as f:
        f.write(info_content)

def main():
    """Основная функция"""
    print("🚀 Начинаем загрузку Kaggle датасетов для исследования")
    print("=" * 60)
    
    # Проверяем Kaggle API
    api = check_kaggle_api()
    if not api:
        print("\n❌ Не удалось настроить Kaggle API")
        return
    
    # Создаем информационный файл
    create_dataset_info()
    
    # Загружаем датасеты по категориям
    total_datasets = sum(len(datasets) for datasets in DATASETS.values())
    downloaded = 0
    failed = 0
    
    for category, datasets in DATASETS.items():
        print(f"\n📂 Категория: {category}")
        print("-" * 40)
        
        for dataset in datasets:
            if download_dataset_api(api, dataset, category):
                downloaded += 1
            else:
                failed += 1
    
    # Обновляем информационный файл с результатами
    create_dataset_info()
    
    # Итоговая статистика
    print("\n" + "=" * 60)
    print("📊 ИТОГИ ЗАГРУЗКИ:")
    print(f"✅ Успешно загружено: {downloaded}/{total_datasets}")
    print(f"❌ Ошибок: {failed}/{total_datasets}")
    
    if failed > 0:
        print("\n💡 Возможные причины ошибок:")
        print("- Датасет требует принятия условий на Kaggle")
        print("- Датасет был удален или переименован")
        print("- Проблемы с API ключом Kaggle")
        print("- Ограничения доступа к датасету")
    
    print(f"\n📁 Данные сохранены в: {DATA_DIR.absolute()}")
    print("📖 Подробная информация в: data/README.md")

if __name__ == "__main__":
    main() 