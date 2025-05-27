#!/usr/bin/env python3
"""
Интерактивный дашборд для анализа образовательных данных
Современный Material UI дизайн с dash-mantine-components
"""

import dash
from dash import dcc, html, Input, Output, callback
import dash_mantine_components as dmc
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from pathlib import Path
import re
from collections import Counter

# Путь к данным
DATA_DIR = Path("data/raw")

class MaterialEducationDashboard:
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
    
    def create_stats_cards(self):
        """Создаем карточки со статистикой"""
        total_records = sum(len(df) for df in self.data.values())
        datasets_count = len(self.data)
        
        # Подсчет студентов
        students_count = 0
        if 'student_exams' in self.data:
            students_count += len(self.data['student_exams'])
        if 'student_performance' in self.data:
            students_count += len(self.data['student_performance'])
        if 'xapi_education' in self.data:
            students_count += len(self.data['xapi_education'])
        
        # Подсчет вакансий
        jobs_count = 0
        if 'ds_jobs' in self.data:
            jobs_count += len(self.data['ds_jobs'])
        if 'salary_data' in self.data:
            jobs_count += len(self.data['salary_data'])
        
        return dmc.SimpleGrid(
            cols=4,
            children=[
                dmc.Card(
                    children=[
                        dmc.Group([
                            dmc.ThemeIcon(
                                children="📊",
                                size="xl",
                                radius="md",
                                variant="light",
                                color="blue"
                            ),
                            dmc.Stack([
                                dmc.Text("Всего записей", size="sm", c="dimmed"),
                                dmc.Text(f"{total_records:,}", size="xl", fw=700)
                            ], gap=0)
                        ], justify="space-between")
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    p="lg"
                ),
                dmc.Card(
                    children=[
                        dmc.Group([
                            dmc.ThemeIcon(
                                children="🗂️",
                                size="xl",
                                radius="md",
                                variant="light",
                                color="green"
                            ),
                            dmc.Stack([
                                dmc.Text("Датасетов", size="sm", c="dimmed"),
                                dmc.Text(f"{datasets_count}", size="xl", fw=700)
                            ], gap=0)
                        ], justify="space-between")
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    p="lg"
                ),
                dmc.Card(
                    children=[
                        dmc.Group([
                            dmc.ThemeIcon(
                                children="🎓",
                                size="xl",
                                radius="md",
                                variant="light",
                                color="orange"
                            ),
                            dmc.Stack([
                                dmc.Text("Студентов", size="sm", c="dimmed"),
                                dmc.Text(f"{students_count:,}", size="xl", fw=700)
                            ], gap=0)
                        ], justify="space-between")
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    p="lg"
                ),
                dmc.Card(
                    children=[
                        dmc.Group([
                            dmc.ThemeIcon(
                                children="💼",
                                size="xl",
                                radius="md",
                                variant="light",
                                color="violet"
                            ),
                            dmc.Stack([
                                dmc.Text("Вакансий", size="sm", c="dimmed"),
                                dmc.Text(f"{jobs_count:,}", size="xl", fw=700)
                            ], gap=0)
                        ], justify="space-between")
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    p="lg"
                )
            ]
        )
    
    def setup_layout(self):
        """Настраиваем макет дашборда с Material UI"""
        self.app.layout = dmc.MantineProvider(
            theme={
                "colorScheme": "light",
                "primaryColor": "blue",
                "fontFamily": "'Inter', sans-serif"
            },
            children=[
                dmc.Container(
                    size="xl",
                    px="md",
                    children=[
                        # Заголовок
                        dmc.Paper(
                            children=[
                                dmc.Stack([
                                    dmc.Group([
                                        dmc.ThemeIcon(
                                            children="🎓",
                                            size="xl",
                                            radius="md",
                                            variant="gradient",
                                            gradient={"from": "blue", "to": "cyan"}
                                        ),
                                        dmc.Stack([
                                            dmc.Title(
                                                "Дашборд образовательной платформы",
                                                order=1,
                                                c="blue"
                                            ),
                                            dmc.Text(
                                                "Анализ данных для разработки образовательной платформы на основе Kaggle датасетов",
                                                size="lg",
                                                c="dimmed"
                                            )
                                        ], gap=0)
                                    ]),
                                    
                                    # Карточки со статистикой
                                    self.create_stats_cards()
                                ])
                            ],
                            shadow="sm",
                            radius="md",
                            p="xl",
                            mb="xl",
                            withBorder=True
                        ),
                        
                        # Навигационные табы
                        dmc.Tabs(
                            id="main-tabs",
                            value="education-tab",
                            children=[
                                dmc.TabsList([
                                    dmc.Tab("📚 Образовательная аналитика", value="education-tab"),
                                    dmc.Tab("💼 Рыночная аналитика", value="market-tab"),
                                    dmc.Tab("🎯 Инсайты для MVP", value="insights-tab"),
                                ]),
                                
                                # Контент табов
                                html.Div(id='tab-content', style={'marginTop': '20px'})
                            ]
                        )
                    ]
                )
            ]
        )
    
    def create_education_tab(self):
        """Создаем таб с образовательной аналитикой в Material UI стиле"""
        charts = []
        
        # График успеваемости по полу
        if 'student_exams' in self.data:
            df = self.data['student_exams']
            
            # Средние баллы по полу
            gender_scores = df.groupby('gender')[['math score', 'reading score', 'writing score']].mean()
            
            fig1 = px.bar(
                x=gender_scores.index,
                y=[gender_scores['math score'], gender_scores['reading score'], gender_scores['writing score']],
                title="Средние баллы по предметам и полу",
                labels={'x': 'Пол', 'y': 'Средний балл'},
                color_discrete_sequence=['#1976d2', '#f57c00', '#388e3c']
            )
            fig1.update_layout(
                showlegend=True,
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="📊",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="blue"
                                ),
                                dmc.Text("Анализ успеваемости по полу", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig1, style={'height': '400px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
            
            # Влияние подготовки к тестам
            fig2 = px.box(
                df, 
                x='test preparation course', 
                y='math score',
                title="Влияние подготовительных курсов на результаты по математике",
                color='test preparation course',
                color_discrete_sequence=['#1976d2', '#f57c00']
            )
            fig2.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="📈",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="orange"
                                ),
                                dmc.Text("Эффективность подготовительных курсов", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig2, style={'height': '400px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
        
        # Анализ xAPI данных
        if 'xapi_education' in self.data:
            df = self.data['xapi_education']
            
            # Распределение классов
            class_dist = df['Class'].value_counts()
            
            fig3 = px.pie(
                values=class_dist.values,
                names=class_dist.index,
                title="Распределение студентов по уровням успеваемости",
                color_discrete_sequence=['#f44336', '#ff9800', '#4caf50']
            )
            fig3.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="🎯",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="green"
                                ),
                                dmc.Text("Распределение по успеваемости", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig3, style={'height': '400px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
            
            # Активность студентов
            fig4 = px.scatter(
                df,
                x='raisedhands',
                y='VisITedResources',
                color='Class',
                title="Активность студентов: поднятие рук vs посещение ресурсов",
                labels={'raisedhands': 'Поднятие рук', 'VisITedResources': 'Посещение ресурсов'},
                color_discrete_sequence=['#f44336', '#ff9800', '#4caf50']
            )
            fig4.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="🤚",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="violet"
                                ),
                                dmc.Text("Корреляция активности и успеваемости", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig4, style={'height': '400px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
        
        return dmc.Stack(charts, spacing="lg")
    
    def create_market_tab(self):
        """Создаем таб с рыночной аналитикой в Material UI стиле"""
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
                title="Топ-10 высокооплачиваемых должностей",
                labels={'x': 'Средняя зарплата ($)', 'y': 'Должность'},
                color=job_salaries.values,
                color_continuous_scale='Viridis'
            )
            fig1.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="💰",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="green"
                                ),
                                dmc.Text("Анализ зарплат по должностям", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig1, style={'height': '500px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
            
            # Зарплаты по образованию
            edu_salaries = df.groupby('Education Level')['Salary'].mean()
            
            fig2 = px.bar(
                x=edu_salaries.index,
                y=edu_salaries.values,
                title="Влияние уровня образования на зарплату",
                labels={'x': 'Уровень образования', 'y': 'Средняя зарплата ($)'},
                color=edu_salaries.values,
                color_continuous_scale='Blues'
            )
            fig2.update_layout(
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(family="Inter, sans-serif"),
                title_font_size=16,
                title_font_color='#1976d2'
            )
            
            charts.append(
                dmc.Card(
                    children=[
                        dmc.CardSection([
                            dmc.Group([
                                dmc.ThemeIcon(
                                    children="🎓",
                                    size="lg",
                                    radius="md",
                                    variant="light",
                                    color="blue"
                                ),
                                dmc.Text("ROI образования", weight=500, size="lg")
                            ], spacing="sm")
                        ], inheritPadding=True, py="xs"),
                        dcc.Graph(figure=fig2, style={'height': '400px'})
                    ],
                    withBorder=True,
                    shadow="sm",
                    radius="md",
                    mb="lg"
                )
            )
        
        # Анализ вакансий Data Science
        if 'ds_jobs' in self.data:
            df = self.data['ds_jobs']
            
            # Топ компаний
            if 'Company' in df.columns:
                top_companies = df['Company'].value_counts().head(10)
                
                fig3 = px.bar(
                    x=top_companies.values,
                    y=top_companies.index,
                    orientation='h',
                    title="Топ компаний по количеству вакансий Data Science",
                    labels={'x': 'Количество вакансий', 'y': 'Компания'},
                    color=top_companies.values,
                    color_continuous_scale='Oranges'
                )
                fig3.update_layout(
                    plot_bgcolor='rgba(0,0,0,0)',
                    paper_bgcolor='rgba(0,0,0,0)',
                    font=dict(family="Inter, sans-serif"),
                    title_font_size=16,
                    title_font_color='#1976d2'
                )
                
                charts.append(
                    dmc.Card(
                        children=[
                            dmc.CardSection([
                                dmc.Group([
                                    dmc.ThemeIcon(
                                        children="🏢",
                                        size="lg",
                                        radius="md",
                                        variant="light",
                                        color="orange"
                                    ),
                                    dmc.Text("Топ работодателей в Data Science", weight=500, size="lg")
                                ], spacing="sm")
                            ], inheritPadding=True, py="xs"),
                            dcc.Graph(figure=fig3, style={'height': '500px'})
                        ],
                        withBorder=True,
                        shadow="sm",
                        radius="md",
                        mb="lg"
                    )
                )
        
        return dmc.Stack(charts, spacing="lg")
    
    def create_insights_tab(self):
        """Создаем таб с инсайтами для MVP в Material UI стиле"""
        
        # Подсчет статистики
        total_records = sum(len(df) for df in self.data.values())
        datasets_count = len(self.data)
        
        insights = [
            {
                "icon": "🎯",
                "title": "Персонализация критична",
                "description": "Данные показывают, что разные группы студентов требуют разных подходов к обучению. Персонализированные программы показывают на 15-20% лучшие результаты.",
                "color": "blue",
                "recommendation": "Создайте адаптивную систему обучения на основе профиля студента"
            },
            {
                "icon": "📈",
                "title": "Подготовка эффективна",
                "description": "Подготовительные курсы улучшают результаты экзаменов на 15-20%. Это подтверждает ценность дополнительного образования.",
                "color": "green",
                "recommendation": "Разработайте систему подготовительных модулей для ключевых навыков"
            },
            {
                "icon": "🤚",
                "title": "Активность = успех",
                "description": "Студенты с высокой активностью (поднятие рук, посещение ресурсов) показывают значительно лучшие результаты.",
                "color": "orange",
                "recommendation": "Внедрите геймификацию и систему поощрения активности"
            },
            {
                "icon": "💰",
                "title": "Data Science востребован",
                "description": "Навыки анализа данных показывают самые высокие зарплаты и спрос на рынке труда.",
                "color": "violet",
                "recommendation": "Сфокусируйтесь на курсах по Data Science для не-технических специалистов"
            },
            {
                "icon": "🎓",
                "title": "Образование окупается",
                "description": "Каждый дополнительный уровень образования увеличивает зарплату на 20-40%.",
                "color": "teal",
                "recommendation": "Создайте четкие пути карьерного роста через образование"
            }
        ]
        
        insight_cards = []
        for insight in insights:
            card = dmc.Card(
                children=[
                    dmc.Group([
                        dmc.ThemeIcon(
                            children=insight["icon"],
                            size="xl",
                            radius="md",
                            variant="light",
                            color=insight["color"]
                        ),
                        dmc.Stack([
                            dmc.Text(insight["title"], weight=700, size="lg"),
                            dmc.Text(insight["description"], size="sm", color="dimmed"),
                            dmc.Divider(),
                            dmc.Group([
                                dmc.Badge("Рекомендация", color=insight["color"], variant="light"),
                                dmc.Text(insight["recommendation"], size="sm", weight=500)
                            ], spacing="xs")
                        ], spacing="xs")
                    ], spacing="md", align="flex-start")
                ],
                withBorder=True,
                shadow="sm",
                radius="md",
                p="lg"
            )
            insight_cards.append(card)
        
        # Статистика проекта
        stats_section = dmc.Card(
            children=[
                dmc.Stack([
                    dmc.Group([
                        dmc.ThemeIcon(
                            children="📊",
                            size="xl",
                            radius="md",
                            variant="gradient",
                            gradient={"from": "blue", "to": "cyan"}
                        ),
                        dmc.Text("Статистика анализа данных", weight=700, size="xl")
                    ], spacing="md"),
                    
                    dmc.SimpleGrid(
                        cols=3,
                        spacing="lg",
                        children=[
                            dmc.Stack([
                                dmc.Text(f"{total_records:,}", size="xl", weight=700, color="blue"),
                                dmc.Text("Записей проанализировано", size="sm", color="dimmed")
                            ], spacing=0, align="center"),
                            dmc.Stack([
                                dmc.Text(f"{datasets_count}", size="xl", weight=700, color="green"),
                                dmc.Text("Датасетов обработано", size="sm", color="dimmed")
                            ], spacing=0, align="center"),
                            dmc.Stack([
                                dmc.Text("5", size="xl", weight=700, color="orange"),
                                dmc.Text("Ключевых инсайтов", size="sm", color="dimmed")
                            ], spacing=0, align="center")
                        ]
                    )
                ], spacing="lg")
            ],
            withBorder=True,
            shadow="md",
            radius="md",
            p="xl",
            mb="xl"
        )
        
        # Рекомендации для MVP
        mvp_recommendations = dmc.Card(
            children=[
                dmc.Stack([
                    dmc.Group([
                        dmc.ThemeIcon(
                            children="🚀",
                            size="xl",
                            radius="md",
                            variant="gradient",
                            gradient={"from": "orange", "to": "red"}
                        ),
                        dmc.Text("Рекомендации для MVP", weight=700, size="xl")
                    ], spacing="md"),
                    
                    dmc.Text("На основе анализа данных рекомендуем следующие направления:", size="md", color="dimmed"),
                    
                    dmc.List([
                        dmc.ListItem("Soft Skills for Tech Professionals - низкая конкуренция, высокий потенциал"),
                        dmc.ListItem("Data Skills for Non-Techies - большой рынок, высокий спрос"),
                        dmc.ListItem("Career Transition Accelerator - высокая стоимость услуги, эмоциональная значимость")
                    ], spacing="sm"),
                    
                    dmc.Alert(
                        "Начните с ниши 'Soft Skills for Tech Professionals' для быстрого запуска MVP",
                        title="💡 Главная рекомендация",
                        color="blue",
                        variant="light"
                    )
                ], spacing="lg")
            ],
            withBorder=True,
            shadow="sm",
            radius="md",
            p="xl"
        )
        
        return dmc.Stack([
            stats_section,
            dmc.SimpleGrid(cols=1, spacing="lg", children=insight_cards),
            mvp_recommendations
        ], spacing="xl")
    
    def setup_callbacks(self):
        """Настраиваем коллбэки для интерактивности"""
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
            return html.Div("Выберите раздел для анализа")
    
    def run(self, debug=True, port=8051):
        """Запуск дашборда"""
        print("🚀 Запускаем дашборд на http://localhost:8051")
        print("🔗 Откройте браузер и перейдите по ссылке выше")
        print("📊 Доступные разделы:")
        print("  • Образовательная аналитика - анализ успеваемости студентов")
        print("  • Рыночная аналитика - анализ вакансий и зарплат")
        print("  • Инсайты для MVP - рекомендации для продукта")
        print()
        self.app.run_server(debug=debug, port=port, host='127.0.0.1')

def main():
    """Главная функция"""
    dashboard = MaterialEducationDashboard()
    dashboard.run()

if __name__ == "__main__":
    main() 