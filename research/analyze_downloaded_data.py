#!/usr/bin/env python3
"""
Анализ загруженных датасетов для исследования образовательной платформы
Быстрый обзор данных и выявление ключевых инсайтов
"""

import pandas as pd
import numpy as np
from pathlib import Path
import os

# Путь к данным
DATA_DIR = Path("data/raw")

def analyze_dataset(file_path, dataset_name):
    """Анализируем отдельный датасет"""
    try:
        print(f"\n📊 Анализ: {dataset_name}")
        print("-" * 50)
        
        # Определяем тип файла и загружаем
        if file_path.suffix.lower() == '.csv':
            df = pd.read_csv(file_path)
        elif file_path.suffix.lower() in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path)
        else:
            print(f"⚠️  Неподдерживаемый формат: {file_path.suffix}")
            return None
        
        # Основная информация
        print(f"📏 Размер: {df.shape[0]:,} строк × {df.shape[1]} столбцов")
        print(f"💾 Размер файла: {file_path.stat().st_size / 1024:.1f} KB")
        
        # Столбцы
        print(f"\n📋 Столбцы ({len(df.columns)}):")
        for i, col in enumerate(df.columns[:10], 1):  # Показываем первые 10
            print(f"  {i}. {col}")
        if len(df.columns) > 10:
            print(f"  ... и еще {len(df.columns) - 10} столбцов")
        
        # Типы данных
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        text_cols = df.select_dtypes(include=['object']).columns
        
        print(f"\n🔢 Числовые столбцы: {len(numeric_cols)}")
        print(f"📝 Текстовые столбцы: {len(text_cols)}")
        
        # Пропущенные значения
        missing = df.isnull().sum()
        if missing.sum() > 0:
            print(f"\n❌ Пропущенные значения: {missing.sum():,} ({missing.sum()/len(df)*100:.1f}%)")
        else:
            print(f"\n✅ Пропущенных значений нет")
        
        # Первые несколько строк
        print(f"\n👀 Первые 3 строки:")
        print(df.head(3).to_string())
        
        return {
            'name': dataset_name,
            'shape': df.shape,
            'size_kb': file_path.stat().st_size / 1024,
            'numeric_cols': len(numeric_cols),
            'text_cols': len(text_cols),
            'missing_values': missing.sum(),
            'columns': list(df.columns)
        }
        
    except Exception as e:
        print(f"❌ Ошибка анализа {dataset_name}: {e}")
        return None

def find_datasets():
    """Находим все загруженные датасеты"""
    datasets = []
    
    if not DATA_DIR.exists():
        print("❌ Папка data/raw не найдена")
        return datasets
    
    for category_dir in DATA_DIR.iterdir():
        if category_dir.is_dir():
            category = category_dir.name
            print(f"\n📂 Категория: {category}")
            
            for dataset_dir in category_dir.iterdir():
                if dataset_dir.is_dir():
                    dataset_name = dataset_dir.name
                    
                    # Ищем CSV/Excel файлы
                    data_files = list(dataset_dir.glob("*.csv")) + \
                                list(dataset_dir.glob("*.xlsx")) + \
                                list(dataset_dir.glob("*.xls"))
                    
                    if data_files:
                        print(f"  ✅ {dataset_name} ({len(data_files)} файлов)")
                        for file_path in data_files:
                            datasets.append({
                                'category': category,
                                'dataset': dataset_name,
                                'file': file_path,
                                'filename': file_path.name
                            })
                    else:
                        print(f"  ⚠️  {dataset_name} (нет CSV/Excel файлов)")
    
    return datasets

def generate_insights(analysis_results):
    """Генерируем инсайты для образовательной платформы"""
    print("\n" + "="*60)
    print("🎯 ИНСАЙТЫ ДЛЯ ОБРАЗОВАТЕЛЬНОЙ ПЛАТФОРМЫ")
    print("="*60)
    
    if not analysis_results:
        print("❌ Нет данных для анализа")
        return
    
    # Общая статистика
    total_datasets = len(analysis_results)
    total_rows = sum(r['shape'][0] for r in analysis_results if r)
    total_size = sum(r['size_kb'] for r in analysis_results if r)
    
    print(f"\n📊 ОБЩАЯ СТАТИСТИКА:")
    print(f"  • Загружено датасетов: {total_datasets}")
    print(f"  • Общее количество записей: {total_rows:,}")
    print(f"  • Общий размер данных: {total_size:.1f} KB")
    
    # Анализ по категориям
    categories = {}
    for result in analysis_results:
        if result:
            cat = result['name'].split('_')[0] if '_' in result['name'] else 'other'
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(result)
    
    print(f"\n🎓 ВОЗМОЖНОСТИ ДЛЯ ПЛАТФОРМЫ:")
    
    # Образовательные инсайты
    education_keywords = ['student', 'exam', 'performance', 'grade', 'education']
    education_datasets = [r for r in analysis_results if r and 
                         any(keyword in r['name'].lower() for keyword in education_keywords)]
    
    if education_datasets:
        print(f"\n📚 Образовательная аналитика ({len(education_datasets)} датасетов):")
        print("  • Анализ факторов успеваемости студентов")
        print("  • Персонализация обучения на основе данных")
        print("  • Прогнозирование результатов обучения")
        print("  • Выявление проблемных областей в обучении")
    
    # Рыночные инсайты
    job_keywords = ['job', 'salary', 'skill', 'career', 'linkedin']
    job_datasets = [r for r in analysis_results if r and 
                   any(keyword in r['name'].lower() for keyword in job_keywords)]
    
    if job_datasets:
        print(f"\n💼 Рыночная аналитика ({len(job_datasets)} датасетов):")
        print("  • Анализ востребованных навыков на рынке")
        print("  • Зарплатные ожидания по специальностям")
        print("  • Тренды в требованиях работодателей")
        print("  • Построение карьерных траекторий")
    
    print(f"\n🚀 РЕКОМЕНДАЦИИ ДЛЯ MVP:")
    print("  1. Система рекомендаций курсов на основе рыночных трендов")
    print("  2. Персональные траектории обучения")
    print("  3. Прогнозирование успешности завершения курса")
    print("  4. Аналитика прогресса и мотивации студентов")
    print("  5. Интеграция с данными о вакансиях")

def main():
    """Основная функция"""
    print("🔍 АНАЛИЗ ЗАГРУЖЕННЫХ ДАТАСЕТОВ")
    print("="*60)
    
    # Находим все датасеты
    datasets = find_datasets()
    
    if not datasets:
        print("\n❌ Датасеты не найдены. Запустите сначала kaggle_downloader_venv.py")
        return
    
    print(f"\n📋 Найдено {len(datasets)} файлов данных")
    
    # Анализируем каждый датасет
    analysis_results = []
    
    for dataset_info in datasets[:10]:  # Анализируем первые 10 для быстроты
        result = analyze_dataset(
            dataset_info['file'], 
            f"{dataset_info['category']}_{dataset_info['dataset']}"
        )
        if result:
            analysis_results.append(result)
    
    # Генерируем инсайты
    generate_insights(analysis_results)
    
    print(f"\n📁 Все данные находятся в: {DATA_DIR.absolute()}")
    print("📖 Подробная информация в: data/README.md")

if __name__ == "__main__":
    main() 