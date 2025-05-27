#!/usr/bin/env python3
"""
Интерактивный дашборд для анализа образовательных данных
Визуализация инсайтов для образовательной платформы
"""

import dash
from dash import dcc, html, Input, Output, callback
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from pathlib import Path
import re
from collections import Counter

# Путь к данным
DATA_DIR = Path("data/raw")

class EducationDashboard:
    def __init__(self):
        self.app = dash.Dash(__name__)
        self.data = {}
        self.load_data()
        self.setup_layout()
        self.setup_callbacks()
    
    def load_data(self):
        """Загружаем все доступные датасеты"""
        print("📊 Загружаем данные для дашборда...")
        
        # Образовательные данные
        try:
            # Студенческие экзамены
            exam_path = DATA_DIR / "education" / "whenamancodes_students-performance-in-exams" / "exams.csv"
            if exam_path.exists():
                self.data['student_exams'] = pd.read_csv(exam_path)
                print("✅ Загружены данные об экзаменах студентов")
        except Exception as e:
            print(f"⚠️ Ошибка загрузки экзаменов: {e}")
        
        try:
            # Данные о студентах (португальский датасет)
            student_path = DATA_DIR / "education" / "larsen0966_student-performance-data-set" / "student-por.csv"
            if student_path.exists():
                self.data['student_performance'] = pd.read_csv(student_path, sep=';')
                print("✅ Загружены данные о успеваемости студентов")
        except Exception as e:
            print(f"⚠️ Ошибка загрузки успеваемости: {e}")
        
        try:
            # xAPI образовательные данные
            xapi_path = DATA_DIR / "education" / "aljarah_xAPI-Edu-Data" / "xAPI-Edu-Data.csv"
            if xapi_path.exists():
                self.data['xapi_education'] = pd.read_csv(xapi_path)
                print("✅ Загружены xAPI образовательные данные")
        except Exception as e:
            print(f"⚠️ Ошибка загрузки xAPI: {e}")
        
        # Рыночные данные
        try:
            # Зарплатные данные
            salary_path = DATA_DIR / "job_market" / "rkiattisak_salaly-prediction-for-beginer" / "Salary Data.csv"
            if salary_path.exists():
                self.data['salary_data'] = pd.read_csv(salary_path)
                print("✅ Загружены зарплатные данные")
        except Exception as e:
            print(f"⚠️ Ошибка загрузки зарплат: {e}")
        
        try:
            # Data Science вакансии
            ds_jobs_path = DATA_DIR / "job_market" / "andrewmvd_data-scientist-jobs" / "DataScientist.csv"
            if ds_jobs_path.exists():
                self.data['ds_jobs'] = pd.read_csv(ds_jobs_path)
                print("✅ Загружены данные о вакансиях Data Science")
        except Exception as e:
            print(f"⚠️ Ошибка загрузки DS вакансий: {e}")
        
        print(f"📈 Загружено {len(self.data)} датасетов")
    
    def setup_layout(self):
        """Настраиваем макет дашборда"""
        self.app.layout = html.Div([
            # Заголовок
            html.Div([
                html.H1("🎓 Дашборд образовательной платформы", 
                       style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': 30}),
                html.P("Анализ данных для разработки образовательной платформы на основе Kaggle датасетов",
                       style={'textAlign': 'center', 'color': '#7f8c8d', 'fontSize': 18})
            ], style={'backgroundColor': '#ecf0f1', 'padding': '20px', 'marginBottom': '20px'}),
            
            # Навигационные табы
            dcc.Tabs(id="main-tabs", value='education-tab', children=[
                dcc.Tab(label='📚 Образовательная аналитика', value='education-tab'),
                dcc.Tab(label='💼 Рыночная аналитика', value='market-tab'),
                dcc.Tab(label='🎯 Инсайты для MVP', value='insights-tab'),
            ], style={'marginBottom': '20px'}),
            
            # Контент табов
            html.Div(id='tab-content')
        ])
    
    def create_education_tab(self):
        """Создаем таб с образовательной аналитикой"""
        charts = []
        
        # График успеваемости по полу
        if 'student_exams' in self.data:
            df = self.data['student_exams']
            
            # Средние баллы по полу
            gender_scores = df.groupby('gender')[['math score', 'reading score', 'writing score']].mean()
            
            fig1 = px.bar(
                x=gender_scores.index,
                y=[gender_scores['math score'], gender_scores['reading score'], gender_scores['writing score']],
                title="📊 Средние баллы по предметам и полу",
                labels={'x': 'Пол', 'y': 'Средний балл'},
                color_discrete_sequence=['#3498db', '#e74c3c', '#2ecc71']
            )
            fig1.update_layout(showlegend=True)
            
            charts.append(dcc.Graph(figure=fig1))
            
            # Влияние подготовки к тестам
            prep_scores = df.groupby('test preparation course')[['math score', 'reading score', 'writing score']].mean()
            
            fig2 = px.box(
                df, 
                x='test preparation course', 
                y='math score',
                title="📈 Влияние подготовительных курсов на результаты по математике",
                color='test preparation course'
            )
            
            charts.append(dcc.Graph(figure=fig2))
        
        # Анализ xAPI данных
        if 'xapi_education' in self.data:
            df = self.data['xapi_education']
            
            # Распределение классов
            class_dist = df['Class'].value_counts()
            
            fig3 = px.pie(
                values=class_dist.values,
                names=class_dist.index,
                title="🎯 Распределение студентов по уровням успеваемости",
                color_discrete_sequence=['#e74c3c', '#f39c12', '#2ecc71']
            )
            
            charts.append(dcc.Graph(figure=fig3))
            
            # Активность студентов
            fig4 = px.scatter(
                df,
                x='raisedhands',
                y='VisITedResources',
                color='Class',
                title="🤚 Активность студентов: поднятие рук vs посещение ресурсов",
                labels={'raisedhands': 'Поднятие рук', 'VisITedResources': 'Посещение ресурсов'}
            )
            
            charts.append(dcc.Graph(figure=fig4))
        
        return html.Div(charts)
    
    def create_market_tab(self):
        """Создаем таб с рыночной аналитикой"""
        charts = []
        
        # Зарплатная аналитика
        if 'salary_data' in self.data:
            df = self.data['salary_data'].dropna()
            
            # Зарплаты по должностям
            job_salaries = df.groupby('Job Title')['Salary'].mean().sort_values(ascending=False).head(10)
            
            fig1 = px.bar(
                x=job_salaries.values,
                y=job_salaries.index,
                orientation='h',
                title="💰 Топ-10 высокооплачиваемых должностей",
                labels={'x': 'Средняя зарплата ($)', 'y': 'Должность'},
                color=job_salaries.values,
                color_continuous_scale='Viridis'
            )
            
            charts.append(dcc.Graph(figure=fig1))
            
            # Зарплаты по образованию
            edu_salaries = df.groupby('Education Level')['Salary'].mean()
            
            fig2 = px.bar(
                x=edu_salaries.index,
                y=edu_salaries.values,
                title="🎓 Влияние уровня образования на зарплату",
                labels={'x': 'Уровень образования', 'y': 'Средняя зарплата ($)'},
                color=edu_salaries.values,
                color_continuous_scale='Blues'
            )
            
            charts.append(dcc.Graph(figure=fig2))
            
            # Опыт vs Зарплата
            fig3 = px.scatter(
                df,
                x='Years of Experience',
                y='Salary',
                color='Education Level',
                title="📈 Зависимость зарплаты от опыта работы",
                labels={'Years of Experience': 'Годы опыта', 'Salary': 'Зарплата ($)'}
            )
            
            charts.append(dcc.Graph(figure=fig3))
        
        # Анализ вакансий Data Science
        if 'ds_jobs' in self.data:
            df = self.data['ds_jobs']
            
            # Топ компаний
            top_companies = df['Company Name'].value_counts().head(10)
            
            fig4 = px.bar(
                x=top_companies.values,
                y=top_companies.index,
                orientation='h',
                title="🏢 Топ-10 компаний по количеству вакансий Data Science",
                labels={'x': 'Количество вакансий', 'y': 'Компания'}
            )
            
            charts.append(dcc.Graph(figure=fig4))
            
            # Рейтинги компаний
            if 'Rating' in df.columns:
                rating_dist = df['Rating'].dropna()
                
                fig5 = px.histogram(
                    x=rating_dist,
                    title="⭐ Распределение рейтингов компаний",
                    labels={'x': 'Рейтинг компании', 'y': 'Количество'},
                    nbins=20
                )
                
                charts.append(dcc.Graph(figure=fig5))
        
        return html.Div(charts)
    
    def create_insights_tab(self):
        """Создаем таб с инсайтами для MVP"""
        insights = []
        
        # Статистика по данным
        stats = []
        for name, df in self.data.items():
            stats.append({
                'Датасет': name.replace('_', ' ').title(),
                'Записей': f"{len(df):,}",
                'Столбцов': len(df.columns),
                'Размер': f"{df.memory_usage(deep=True).sum() / 1024:.1f} KB"
            })
        
        if stats:
            stats_df = pd.DataFrame(stats)
            
            fig_stats = go.Figure(data=[go.Table(
                header=dict(values=list(stats_df.columns),
                           fill_color='paleturquoise',
                           align='left'),
                cells=dict(values=[stats_df[col] for col in stats_df.columns],
                          fill_color='lavender',
                          align='left'))
            ])
            fig_stats.update_layout(title="📊 Статистика загруженных данных")
            
            insights.append(dcc.Graph(figure=fig_stats))
        
        # Ключевые инсайты
        insights_text = html.Div([
            html.H3("🎯 Ключевые инсайты для образовательной платформы", 
                   style={'color': '#2c3e50', 'marginTop': '30px'}),
            
            html.Div([
                html.H4("📚 Образовательные возможности:", style={'color': '#3498db'}),
                html.Ul([
                    html.Li("Персонализация обучения на основе пола и предыдущей подготовки"),
                    html.Li("Важность подготовительных курсов для улучшения результатов"),
                    html.Li("Корреляция между активностью студентов и успеваемостью"),
                    html.Li("Необходимость разных подходов для разных предметов")
                ])
            ], style={'backgroundColor': '#ecf0f1', 'padding': '15px', 'margin': '10px', 'borderRadius': '5px'}),
            
            html.Div([
                html.H4("💼 Рыночные возможности:", style={'color': '#e74c3c'}),
                html.Ul([
                    html.Li("Высокий спрос на Data Science специалистов"),
                    html.Li("Значительное влияние уровня образования на зарплату"),
                    html.Li("Важность опыта работы для карьерного роста"),
                    html.Li("Разнообразие компаний, нанимающих специалистов")
                ])
            ], style={'backgroundColor': '#fdf2e9', 'padding': '15px', 'margin': '10px', 'borderRadius': '5px'}),
            
            html.Div([
                html.H4("🚀 Рекомендации для MVP:", style={'color': '#27ae60'}),
                html.Ol([
                    html.Li("Система адаптивного обучения на основе профиля студента"),
                    html.Li("Интеграция с данными о рынке труда для актуальных курсов"),
                    html.Li("Геймификация для повышения активности студентов"),
                    html.Li("Персональные рекомендации курсов на основе карьерных целей"),
                    html.Li("Аналитика прогресса с предсказанием успешности")
                ])
            ], style={'backgroundColor': '#eafaf1', 'padding': '15px', 'margin': '10px', 'borderRadius': '5px'})
        ])
        
        insights.append(insights_text)
        
        return html.Div(insights)
    
    def setup_callbacks(self):
        """Настраиваем интерактивность"""
        @self.app.callback(
            Output('tab-content', 'children'),
            Input('main-tabs', 'value')
        )
        def render_content(active_tab):
            if active_tab == 'education-tab':
                return self.create_education_tab()
            elif active_tab == 'market-tab':
                return self.create_market_tab()
            elif active_tab == 'insights-tab':
                return self.create_insights_tab()
            return html.Div("Выберите таб для просмотра данных")
    
    def run(self, debug=True, port=8050):
        """Запускаем дашборд"""
        print(f"🚀 Запускаем дашборд на http://localhost:{port}")
        print("📊 Доступные разделы:")
        print("  • Образовательная аналитика - анализ успеваемости студентов")
        print("  • Рыночная аналитика - анализ вакансий и зарплат")
        print("  • Инсайты для MVP - рекомендации для продукта")
        print("\n🔗 Откройте браузер и перейдите по ссылке выше")
        
        self.app.run(debug=debug, port=port, host='127.0.0.1')

def main():
    """Основная функция"""
    dashboard = EducationDashboard()
    dashboard.run()

if __name__ == "__main__":
    main() 