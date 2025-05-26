#!/usr/bin/env python3
"""
Kaggle Dataset Downloader for Educational Platform Research
Скрипт для загрузки датасетов с Kaggle для исследования образовательной платформы
"""

import os
import subprocess
import sys
from pathlib import Path

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
        "rashikrahmanpritom/heart-attack-analysis-prediction-dataset",  # Skills Analysis
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
        "rounakbanik/the-movies-dataset",  # Content Preferences (для анализа предпочтений)
    ]
}

def check_kaggle_setup():
    """Проверяем настройку Kaggle API"""
    try:
        result = subprocess.run(["kaggle", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Kaggle API настроен корректно")
            return True
        else:
            print("❌ Kaggle API не найден")
            return False
    except FileNotFoundError:
        print("❌ Kaggle CLI не установлен")
        return False

def install_kaggle():
    """Устанавливаем Kaggle API"""
    print("📦 Устанавливаем Kaggle API...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "kaggle"], check=True)
        print("✅ Kaggle API установлен")
        return True
    except subprocess.CalledProcessError:
        print("❌ Ошибка установки Kaggle API")
        return False

def download_dataset(dataset_name, category):
    """Загружаем датасет"""
    category_dir = RAW_DATA_DIR / category
    category_dir.mkdir(exist_ok=True)
    
    dataset_dir = category_dir / dataset_name.replace("/", "_")
    
    if dataset_dir.exists() and any(dataset_dir.iterdir()):
        print(f"⏭️  Датасет {dataset_name} уже загружен")
        return True
    
    print(f"📥 Загружаем {dataset_name}...")
    
    try:
        cmd = [
            "kaggle", "datasets", "download", 
            dataset_name, 
            "-p", str(dataset_dir),
            "--unzip"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {dataset_name} загружен успешно")
            return True
        else:
            print(f"❌ Ошибка загрузки {dataset_name}: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Исключение при загрузке {dataset_name}: {e}")
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
"""
    
    with open(DATA_DIR / "README.md", "w", encoding="utf-8") as f:
        f.write(info_content)

def main():
    """Основная функция"""
    print("🚀 Начинаем загрузку Kaggle датасетов для исследования")
    print("=" * 60)
    
    # Проверяем Kaggle API
    if not check_kaggle_setup():
        if not install_kaggle():
            print("\n❌ Не удалось настроить Kaggle API")
            print("Пожалуйста, установите вручную: pip install kaggle")
            print("И настройте API ключ: https://www.kaggle.com/docs/api")
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
            if download_dataset(dataset, category):
                downloaded += 1
            else:
                failed += 1
    
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

if __name__ == "__main__":
    main() 