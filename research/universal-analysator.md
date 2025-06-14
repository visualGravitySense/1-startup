Создам универсальный анализатор датасетов для Kaggle. Этот инструмент будет автоматически проводить комплексный анализ любого датасета.

Создал универсальный анализатор датасетов Kaggle! 🎉

## Основные возможности анализатора:

**🔍 Комплексный анализ включает:**
- Базовую информацию о структуре данных
- Анализ числовых переменных с поиском выбросов
- Анализ категориальных переменных
- Оценку качества данных (0-100 баллов)
- Оценку потенциала для машинного обучения
- Автоматические визуализации
- Итоговый отчет

**📊 Что анализирует:**
- Размер и структура датасета
- Типы данных и их распределение
- Пропущенные значения и дубликаты
- Корреляции между переменными
- Потенциальные целевые переменные для ML
- Рекомендации по предобработке

**🎨 Визуализации:**
- Карта пропущенных значений
- Распределение типов данных
- Гистограммы числовых переменных
- Частота категориальных переменных
- Корреляционные матрицы

## Как использовать:

```python
# Для одного датасета
analyzer = KaggleDatasetAnalyzer('your_dataset.csv', 'Dataset Name')
analyzer.run_full_analysis()

# Для множественного анализа 15+ датасетов
dataset_paths = ['dataset1.csv', 'dataset2.csv', ...] # ваши 15+ путей
dataset_names = ['Name1', 'Name2', ...] # названия
results = analyze_multiple_datasets(dataset_paths, dataset_names)
```

Анализатор уже протестирован на демонстрационном датасете. Готов к работе с вашими датасетами с Kaggle! 

