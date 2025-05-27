import os
import json
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import sqlite3
from pathlib import Path
import yaml
import logging
from typing import Dict, List, Any, Optional
import hashlib
import shutil

class ResearchDataManager:
    """
    Система управления данными исследований для последующей разработки продукта
    """
    
    def __init__(self, project_name: str, base_path: str = "./research_projects"):
        self.project_name = project_name
        self.base_path = Path(base_path)
        self.project_path = self.base_path / project_name
        
        # Создаем структуру проекта
        self.setup_project_structure()
        
        # Настраиваем логирование
        self.setup_logging()
        
        # Инициализируем базу данных метаданных
        self.setup_metadata_db()
        
        # Конфигурация проекта
        self.config = self.load_or_create_config()
        
        self.logger.info(f"Инициализован проект: {project_name}")
    
    def setup_project_structure(self):
        """Создание структуры папок проекта"""
        folders = [
            "data/raw",           # Исходные данные
            "data/processed",     # Обработанные данные
            "data/features",      # Извлеченные признаки
            "data/models",        # Обученные модели
            "analysis",           # Результаты анализа
            "experiments",        # Эксперименты
            "reports",           # Отчеты
            "configs",           # Конфигурации
            "logs",              # Логи
            "notebooks",         # Jupyter notebooks
            "scripts",           # Скрипты
            "artifacts",         # Артефакты для продакшна
            "docs"               # Документация
        ]
        
        for folder in folders:
            (self.project_path / folder).mkdir(parents=True, exist_ok=True)
    
    def setup_logging(self):
        """Настройка логирования"""
        log_file = self.project_path / "logs" / f"{self.project_name}_{datetime.now().strftime('%Y%m%d')}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(f"research_{self.project_name}")
    
    def setup_metadata_db(self):
        """Настройка базы данных метаданных"""
        db_path = self.project_path / "metadata.db"
        self.conn = sqlite3.connect(db_path)
        
        # Создаем таблицы метаданных
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS datasets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                file_path TEXT,
                file_hash TEXT,
                size_mb REAL,
                rows INTEGER,
                columns INTEGER,
                created_date TEXT,
                description TEXT,
                source TEXT,
                version TEXT
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS experiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                dataset_id INTEGER,
                config_path TEXT,
                results_path TEXT,
                model_path TEXT,
                metrics TEXT,
                created_date TEXT,
                status TEXT,
                description TEXT,
                FOREIGN KEY (dataset_id) REFERENCES datasets (id)
            )
        ''')
        
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS features (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                dataset_id INTEGER,
                feature_type TEXT,
                importance REAL,
                description TEXT,
                created_date TEXT,
                FOREIGN KEY (dataset_id) REFERENCES datasets (id)
            )
        ''')
        
        self.conn.commit()
    
    def load_or_create_config(self) -> Dict:
        """Загрузка или создание конфигурации проекта"""
        config_path = self.project_path / "configs" / "project_config.yaml"
        
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        else:
            # Создаем базовую конфигурацию
            config = {
                'project': {
                    'name': self.project_name,
                    'created_date': datetime.now().isoformat(),
                    'description': '',
                    'team': [],
                    'version': '1.0.0'
                },
                'data': {
                    'data_sources': [],
                    'preprocessing_steps': [],
                    'feature_engineering': []
                },
                'modeling': {
                    'target_variable': '',
                    'task_type': '',  # classification, regression, clustering
                    'evaluation_metrics': [],
                    'model_types': []
                },
                'deployment': {
                    'target_environment': '',
                    'api_requirements': {},
                    'performance_requirements': {}
                }
            }
            
            self.save_config(config)
            return config
    
    def save_config(self, config: Dict):
        """Сохранение конфигурации"""
        config_path = self.project_path / "configs" / "project_config.yaml"
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, default_flow_style=False, allow_unicode=True)
    
    def calculate_file_hash(self, file_path: Path) -> str:
        """Расчет хеша файла для отслеживания изменений"""
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    
    def register_dataset(self, 
                        name: str, 
                        file_path: str, 
                        description: str = "", 
                        source: str = "",
                        version: str = "1.0") -> int:
        """
        Регистрация датасета в системе
        
        Returns:
            dataset_id для дальнейшего использования
        """
        source_path = Path(file_path)
        
        if not source_path.exists():
            raise FileNotFoundError(f"Файл не найден: {file_path}")
        
        # Копируем файл в папку raw data
        dest_path = self.project_path / "data" / "raw" / source_path.name
        shutil.copy2(source_path, dest_path)
        
        # Рассчитываем метаданные
        file_hash = self.calculate_file_hash(dest_path)
        size_mb = dest_path.stat().st_size / (1024 * 1024)
        
        # Анализируем структуру данных
        if dest_path.suffix.lower() == '.csv':
            df = pd.read_csv(dest_path)
            rows, columns = df.shape
        else:
            rows, columns = 0, 0
        
        # Сохраняем в базу данных
        cursor = self.conn.execute('''
            INSERT OR REPLACE INTO datasets 
            (name, file_path, file_hash, size_mb, rows, columns, created_date, description, source, version)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, str(dest_path), file_hash, size_mb, rows, columns, 
              datetime.now().isoformat(), description, source, version))
        
        self.conn.commit()
        dataset_id = cursor.lastrowid
        
        self.logger.info(f"Зарегистрирован датасет: {name} (ID: {dataset_id})")
        return dataset_id
    
    def save_processed_data(self, 
                          data: pd.DataFrame, 
                          name: str, 
                          processing_steps: List[str],
                          parent_dataset_id: int = None) -> str:
        """Сохранение обработанных данных"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{name}_{timestamp}.parquet"
        file_path = self.project_path / "data" / "processed" / filename
        
        # Сохраняем данные в Parquet (эффективный формат)
        data.to_parquet(file_path, compression='snappy')
        
        # Сохраняем метаданные обработки
        metadata = {
            'name': name,
            'file_path': str(file_path),
            'created_date': datetime.now().isoformat(),
            'shape': data.shape,
            'processing_steps': processing_steps,
            'parent_dataset_id': parent_dataset_id,
            'columns': list(data.columns),
            'dtypes': {col: str(dtype) for col, dtype in data.dtypes.items()}
        }
        
        metadata_path = self.project_path / "data" / "processed" / f"{name}_{timestamp}_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Сохранены обработанные данные: {filename}")
        return str(file_path)
    
    def save_features(self, 
                     features: pd.DataFrame, 
                     feature_names: List[str],
                     feature_importance: Dict[str, float] = None,
                     dataset_id: int = None) -> str:
        """Сохранение извлеченных признаков"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"features_{timestamp}.parquet"
        file_path = self.project_path / "data" / "features" / filename
        
        # Сохраняем признаки
        features.to_parquet(file_path, compression='snappy')
        
        # Регистрируем признаки в базе данных
        if dataset_id:
            for feature_name in feature_names:
                importance = feature_importance.get(feature_name, 0.0) if feature_importance else 0.0
                self.conn.execute('''
                    INSERT INTO features (name, dataset_id, feature_type, importance, created_date)
                    VALUES (?, ?, ?, ?, ?)
                ''', (feature_name, dataset_id, 'engineered', importance, datetime.now().isoformat()))
        
        self.conn.commit()
        
        # Сохраняем метаданные признаков
        metadata = {
            'file_path': str(file_path),
            'created_date': datetime.now().isoformat(),
            'feature_names': feature_names,
            'feature_importance': feature_importance or {},
            'shape': features.shape
        }
        
        metadata_path = self.project_path / "data" / "features" / f"features_{timestamp}_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Сохранены признаки: {filename}")
        return str(file_path)
    
    def save_model(self, 
                  model: Any, 
                  name: str,
                  metrics: Dict[str, float],
                  config: Dict[str, Any],
                  dataset_id: int = None) -> str:
        """Сохранение обученной модели"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        model_dir = self.project_path / "data" / "models" / f"{name}_{timestamp}"
        model_dir.mkdir(exist_ok=True)
        
        # Сохраняем модель
        model_path = model_dir / "model.pkl"
        with open(model_path, 'wb') as f:
            pickle.dump(model, f)
        
        # Сохраняем конфигурацию модели
        config_path = model_dir / "config.json"
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        # Сохраняем метрики
        metrics_path = model_dir / "metrics.json"
        with open(metrics_path, 'w', encoding='utf-8') as f:
            json.dump(metrics, f, indent=2, ensure_ascii=False)
        
        # Регистрируем эксперимент
        self.conn.execute('''
            INSERT INTO experiments 
            (name, dataset_id, config_path, results_path, model_path, metrics, created_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, dataset_id, str(config_path), str(metrics_path), str(model_path),
              json.dumps(metrics), datetime.now().isoformat(), 'completed'))
        
        self.conn.commit()
        
        self.logger.info(f"Сохранена модель: {name}")
        return str(model_dir)
    
    def save_analysis_report(self, 
                           report_data: Dict[str, Any], 
                           report_name: str,
                           report_type: str = "analysis") -> str:
        """Сохранение отчета анализа"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{report_name}_{report_type}_{timestamp}.json"
        file_path = self.project_path / "reports" / filename
        
        # Добавляем метаданные к отчету
        full_report = {
            'metadata': {
                'report_name': report_name,
                'report_type': report_type,
                'created_date': datetime.now().isoformat(),
                'project_name': self.project_name
            },
            'data': report_data
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(full_report, f, indent=2, ensure_ascii=False, default=str)
        
        self.logger.info(f"Сохранен отчет: {filename}")
        return str(file_path)
    
    def create_experiment_config(self, 
                               experiment_name: str,
                               parameters: Dict[str, Any]) -> str:
        """Создание конфигурации эксперимента"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{experiment_name}_config_{timestamp}.yaml"
        file_path = self.project_path / "experiments" / filename
        
        config = {
            'experiment': {
                'name': experiment_name,
                'created_date': datetime.now().isoformat(),
                'parameters': parameters,
                'status': 'configured'
            }
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(config, f, default_flow_style=False, allow_unicode=True)
        
        return str(file_path)
    
    def prepare_production_artifacts(self, 
                                   model_path: str,
                                   feature_config: Dict[str, Any],
                                   api_requirements: Dict[str, Any]) -> str:
        """Подготовка артефактов для продакшна"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        artifacts_dir = self.project_path / "artifacts" / f"production_{timestamp}"
        artifacts_dir.mkdir(exist_ok=True)
        
        # Копируем модель
        model_source = Path(model_path)
        if model_source.is_file():
            shutil.copy2(model_source, artifacts_dir / "model.pkl")
        elif model_source.is_dir():
            shutil.copytree(model_source, artifacts_dir / "model")
        
        # Сохраняем конфигурацию признаков
        with open(artifacts_dir / "feature_config.json", 'w', encoding='utf-8') as f:
            json.dump(feature_config, f, indent=2, ensure_ascii=False)
        
        # Сохраняем требования к API
        with open(artifacts_dir / "api_requirements.json", 'w', encoding='utf-8') as f:
            json.dump(api_requirements, f, indent=2, ensure_ascii=False)
        
        # Создаем README для продакшна
        readme_content = f"""# Production Artifacts - {self.project_name}

Дата создания: {datetime.now().isoformat()}

## Структура:
- model.pkl / model/ - Обученная модель
- feature_config.json - Конфигурация признаков
- api_requirements.json - Требования к API

## Использование:
1. Загрузить модель из model.pkl
2. Применить обработку признаков согласно feature_config.json
3. Развернуть API согласно api_requirements.json
"""
        
        with open(artifacts_dir / "README.md", 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        self.logger.info(f"Подготовлены артефакты для продакшна: {artifacts_dir}")
        return str(artifacts_dir)
    
    def get_project_summary(self) -> Dict[str, Any]:
        """Получение сводки по проекту"""
        # Статистика по датасетам
        datasets = pd.read_sql_query("SELECT * FROM datasets", self.conn)
        
        # Статистика по экспериментам
        experiments = pd.read_sql_query("SELECT * FROM experiments", self.conn)
        
        # Статистика по признакам
        features = pd.read_sql_query("SELECT * FROM features", self.conn)
        
        summary = {
            'project_info': {
                'name': self.project_name,
                'path': str(self.project_path),
                'config': self.config
            },
            'statistics': {
                'datasets_count': len(datasets),
                'experiments_count': len(experiments),
                'features_count': len(features),
                'total_data_size_mb': datasets['size_mb'].sum() if not datasets.empty else 0
            },
            'recent_activity': {
                'latest_dataset': datasets.iloc[-1].to_dict() if not datasets.empty else None,
                'latest_experiment': experiments.iloc[-1].to_dict() if not experiments.empty else None
            }
        }
        
        return summary
    
    def export_project_structure(self) -> str:
        """Экспорт структуры проекта для документации"""
        export_path = self.project_path / "docs" / "project_structure.json"
        
        structure = {
            'project_name': self.project_name,
            'created_date': datetime.now().isoformat(),
            'summary': self.get_project_summary(),
            'file_structure': self._get_directory_structure(self.project_path)
        }
        
        with open(export_path, 'w', encoding='utf-8') as f:
            json.dump(structure, f, indent=2, ensure_ascii=False, default=str)
        
        return str(export_path)
    
    def _get_directory_structure(self, path: Path, max_depth: int = 3, current_depth: int = 0) -> Dict:
        """Рекурсивное получение структуры директорий"""
        if current_depth >= max_depth:
            return {}
        
        structure = {}
        try:
            for item in path.iterdir():
                if item.is_dir():
                    structure[item.name] = {
                        'type': 'directory',
                        'contents': self._get_directory_structure(item, max_depth, current_depth + 1)
                    }
                else:
                    structure[item.name] = {
                        'type': 'file',
                        'size_bytes': item.stat().st_size
                    }
        except PermissionError:
            pass
        
        return structure
    
    def close(self):
        """Закрытие соединений"""
        if hasattr(self, 'conn'):
            self.conn.close()

# Пример интеграции с анализатором датасетов
class IntegratedResearchPipeline:
    """Интегрированный пайплайн для исследований с сохранением данных"""
    
    def __init__(self, project_name: str):
        self.data_manager = ResearchDataManager(project_name)
        self.logger = self.data_manager.logger
    
    def run_dataset_analysis_pipeline(self, 
                                    dataset_paths: List[str],
                                    dataset_names: List[str] = None):
        """Запуск пайплайна анализа с сохранением результатов"""
        
        if not dataset_names:
            dataset_names = [f"Dataset_{i+1}" for i in range(len(dataset_paths))]
        
        all_results = {}
        
        for i, (path, name) in enumerate(zip(dataset_paths, dataset_names)):
            self.logger.info(f"Начинаем анализ датасета: {name}")
            
            try:
                # Регистрируем датасет
                dataset_id = self.data_manager.register_dataset(
                    name=name,
                    file_path=path,
                    description=f"Анализируемый датасет #{i+1}",
                    source="Kaggle"
                )
                
                # Анализируем датасет (здесь должен быть ваш анализатор)
                # analyzer = KaggleDatasetAnalyzer(path, name)
                # analysis_results = analyzer.run_full_analysis()
                
                # Имитируем результаты анализа
                analysis_results = {
                    'dataset_id': dataset_id,
                    'basic_info': {'shape': (1000, 10), 'memory_usage_mb': 5.2},
                    'quality_score': 85,
                    'ml_potential': ['classification', 'regression']
                }
                
                # Сохраняем результаты анализа
                report_path = self.data_manager.save_analysis_report(
                    report_data=analysis_results,
                    report_name=f"{name}_analysis",
                    report_type="dataset_analysis"
                )
                
                all_results[name] = {
                    'dataset_id': dataset_id,
                    'analysis_results': analysis_results,
                    'report_path': report_path
                }
                
                self.logger.info(f"Завершен анализ датасета: {name}")
                
            except Exception as e:
                self.logger.error(f"Ошибка при анализе {name}: {e}")
                continue
        
        # Создаем сводный отчет
        summary_report = {
            'total_datasets': len(all_results),
            'successful_analyses': len([r for r in all_results.values() if 'analysis_results' in r]),
            'datasets_summary': all_results,
            'project_summary': self.data_manager.get_project_summary()
        }
        
        self.data_manager.save_analysis_report(
            report_data=summary_report,
            report_name="datasets_analysis_summary",
            report_type="summary"
        )
        
        return all_results

# Демонстрация использования
def demo_research_data_management():
    """Демонстрация системы управления исследовательскими данными"""
    
    print("🔬 ДЕМОНСТРАЦИЯ СИСТЕМЫ УПРАВЛЕНИЯ ИССЛЕДОВАТЕЛЬСКИМИ ДАННЫМИ")
    print("="*70)
    
    # Создаем менеджер данных
    manager = ResearchDataManager("kaggle_datasets_analysis")
    
    # Показываем структуру проекта
    summary = manager.get_project_summary()
    print(f"\n📊 Сводка по проекту:")
    print(f"Название: {summary['project_info']['name']}")
    print(f"Путь: {summary['project_info']['path']}")
    print(f"Датасетов: {summary['statistics']['datasets_count']}")
    print(f"Экспериментов: {summary['statistics']['experiments_count']}")
    
    # Экспортируем структуру
    structure_path = manager.export_project_structure()
    print(f"\n📁 Структура проекта экспортирована: {structure_path}")
    
    print("\n" + "="*70)
    print("📖 РЕКОМЕНДАЦИИ ПО ИСПОЛЬЗОВАНИЮ:")
    print("="*70)
    print("""
1. Регистрация датасетов:
   dataset_id = manager.register_dataset('name', 'path/to/file.csv', 'description')

2. Сохранение обработанных данных:
   manager.save_processed_data(df, 'processed_name', ['step1', 'step2'])

3. Сохранение признаков:
   manager.save_features(features_df, feature_list, importance_dict)

4. Сохранение моделей:
   manager.save_model(model, 'model_name', metrics_dict, config_dict)

5. Подготовка к продакшну:
   manager.prepare_production_artifacts(model_path, feature_config, api_requirements)
    """)
    
    manager.close()

if __name__ == "__main__":
    demo_research_data_management()