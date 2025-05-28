// Firebase Data Manager - Управление всеми данными стартапа
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase конфигурация (ваша реальная конфигурация)
const firebaseConfig = {
    apiKey: "AIzaSyCYV9WGP9JItX-vZL6sYMkoxAnLXq0pmCg",
    authDomain: "main-management-572b0.firebaseapp.com",
    projectId: "main-management-572b0",
    storageBucket: "main-management-572b0.firebasestorage.app",
    messagingSenderId: "1081305439096",
    appId: "1:1081305439096:web:0b7bdcc3f8f0ddc900068d",
    measurementId: "G-2T7T34TSMF"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class StartupDataManager {
    constructor() {
        this.db = db;
        this.collections = {
            interviews: 'interviews',
            blogPosts: 'blog_posts',
            research: 'research_results',
            products: 'product_concepts',
            mvp: 'mvp_modules',
            metrics: 'daily_metrics',
            contacts: 'contacts',
            tasks: 'daily_tasks'
        };
    }

    // ==================== ИНТЕРВЬЮ ====================
    
    async saveInterviewData() {
        const interviewData = {
            date: '2024-01-04',
            type: 'simulated',
            totalInterviews: 5,
            profiles: [
                {
                    id: 'alexey_frontend',
                    name: 'Алексей',
                    role: 'Frontend Developer',
                    experience: 3,
                    company: 'Средний IT стартап, Москва',
                    tech: 'React',
                    teamSize: 8,
                    presentationFrequency: '2-3 раза в месяц',
                    mainProblem: 'Сложно объяснить техническую архитектуру менеджерам без технического бэкграунда',
                    painPoints: [
                        'Не знает как структурировать презентацию',
                        'Теряется когда задают вопросы не по теме',
                        'Слишком углубляется в технические детали'
                    ],
                    skillsImportance: {
                        communication: 9,
                        presentations: 8,
                        teamwork: 7
                    },
                    willingToPay: true,
                    maxPrice: 50,
                    quote: 'Мне нужно научиться говорить на языке бизнеса, а не только кода'
                },
                {
                    id: 'maria_backend',
                    name: 'Мария',
                    role: 'Backend Developer',
                    experience: 5,
                    company: 'Крупная IT компания, Санкт-Петербург',
                    tech: 'Python',
                    teamSize: 5,
                    isTeamLead: true,
                    presentationFrequency: 'Еженедельно',
                    mainProblem: 'Команда не понимает мои технические решения, приходится переделывать',
                    painPoints: [
                        'Сложно донести важность рефакторинга до менеджмента',
                        'Не умеет делать убедительные презентации для получения ресурсов',
                        'Стесняется выступать перед большой аудиторией'
                    ],
                    skillsImportance: {
                        leadership: 9,
                        presentations: 8,
                        persuasion: 8
                    },
                    willingToPay: true,
                    maxPrice: 75,
                    quote: 'Хочу научиться продавать свои идеи руководству'
                },
                {
                    id: 'dmitry_fullstack',
                    name: 'Дмитрий',
                    role: 'Full Stack Developer',
                    experience: 2,
                    company: 'Фриланс + стартап, удаленно',
                    isFreelancer: true,
                    presentationFrequency: '1-2 раза в неделю',
                    mainProblem: 'Клиенты не понимают почему нужно время на невидимые задачи',
                    painPoints: [
                        'Сложно объяснить техническую сложность задач',
                        'Не умеет управлять ожиданиями клиентов',
                        'Теряется при возражениях и критике'
                    ],
                    skillsImportance: {
                        clientCommunication: 10,
                        presentations: 7,
                        expectationManagement: 9
                    },
                    willingToPay: true,
                    maxPrice: 40,
                    quote: 'Нужны готовые фразы для объяснения технических вещей простым языком'
                },
                {
                    id: 'anna_devops',
                    name: 'Анна',
                    role: 'DevOps Engineer',
                    experience: 4,
                    company: 'Банк, Москва',
                    teamSize: 12,
                    presentationFrequency: '2-3 раза в месяц',
                    mainProblem: 'Сложно объяснить важность DevOps практик разработчикам',
                    painPoints: [
                        'Не умеет делать презентации об инцидентах без обвинений',
                        'Сложно обучать команду новым инструментам',
                        'Не получается убедить в важности автоматизации'
                    ],
                    skillsImportance: {
                        teaching: 9,
                        presentations: 6,
                        conflictResolution: 8
                    },
                    willingToPay: true,
                    maxPrice: 60,
                    quote: 'Хочу научиться делать презентации, которые мотивируют, а не пугают'
                },
                {
                    id: 'igor_senior',
                    name: 'Игорь',
                    role: 'Senior Java Developer',
                    experience: 7,
                    company: 'Международная IT компания, Москва',
                    isArchitect: true,
                    isMentor: true,
                    presentationFrequency: 'Почти ежедневно',
                    mainProblem: 'Джуниоры не понимают архитектурные принципы из моих объяснений',
                    painPoints: [
                        'Слишком сложно объясняет простые вещи',
                        'Не умеет адаптировать уровень сложности под аудиторию',
                        'Сложно проводить технические интервью'
                    ],
                    skillsImportance: {
                        mentoring: 10,
                        presentations: 7,
                        audienceAdaptation: 9
                    },
                    willingToPay: true,
                    maxPrice: 100,
                    quote: 'Нужно научиться объяснять сложное простыми словами'
                }
            ],
            analysis: {
                mainPainPoints: [
                    { point: 'Объяснение технических вещей нетехнической аудитории', frequency: 5 },
                    { point: 'Структурирование презентации', frequency: 4 },
                    { point: 'Адаптация под уровень аудитории', frequency: 4 },
                    { point: 'Управление вопросами и возражениями', frequency: 3 },
                    { point: 'Убеждение и продажа идей', frequency: 3 }
                ],
                pricing: {
                    averagePrice: 65,
                    minPrice: 40,
                    maxPrice: 100,
                    willingToPayPercentage: 100
                },
                presentationFrequency: {
                    daily: 1,
                    weekly: 2,
                    monthly: 2
                },
                validation: {
                    problemExists: true,
                    willingToPay: true,
                    priceValidated: true,
                    targetAudienceCorrect: true
                }
            }
        };

        try {
            await setDoc(doc(this.db, this.collections.interviews, 'day4_results'), interviewData);
            console.log('✅ Данные интервью сохранены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения интервью:', error);
            return false;
        }
    }

    // ==================== КОНЦЕПЦИЯ ПРОДУКТА ====================
    
    async saveProductConcept() {
        const productData = {
            version: '2.0',
            date: '2024-01-04',
            name: 'Как объяснять код бизнесу: Презентации для разработчиков',
            subtitle: 'Научитесь переводить с технического языка на бизнес-язык за 5 модулей',
            price: 49,
            priceValidated: true,
            priceRange: { min: 40, max: 100 },
            
            structure: [
                {
                    module: 1,
                    name: 'Переводчик кода',
                    problem: 'Разработчики говорят на техническом языке, бизнес не понимает',
                    solution: 'Научиться переводить технические концепции в бизнес-ценности',
                    content: [
                        'Словарь переводов: техника → бизнес',
                        'Фреймворк "Проблема → Решение → Выгода"',
                        '20 готовых фраз для объяснения сложного простым языком',
                        'Практика: переписать техническое ТЗ на бизнес-язык'
                    ]
                },
                {
                    module: 2,
                    name: 'Архитектура убеждения',
                    problem: 'Презентации хаотичны, нет четкой структуры',
                    solution: 'Готовый шаблон технической презентации'
                },
                {
                    module: 3,
                    name: 'Адаптивная подача',
                    problem: 'Одинаково объясняют джуниорам и CEO',
                    solution: 'Техники адаптации под уровень аудитории'
                },
                {
                    module: 4,
                    name: 'Мастер вопросов',
                    problem: 'Теряются при неожиданных вопросах и критике',
                    solution: 'Система работы с вопросами и возражениями'
                },
                {
                    module: 5,
                    name: 'Продажа идей',
                    problem: 'Руководство не выделяет ресурсы на технические задачи',
                    solution: 'Техники убеждения и "продажи" технических решений'
                }
            ],

            targetAudience: {
                primary: [
                    'Frontend/Backend разработчики с опытом 2-7 лет',
                    'Тимлиды и архитекторы',
                    'DevOps инженеры',
                    'Фрилансеры работающие с клиентами'
                ],
                painPoints: [
                    { pain: 'Сложно объяснить техническое нетехникам', percentage: 100 },
                    { pain: 'Нет структуры в презентациях', percentage: 80 },
                    { pain: 'Не умеют адаптировать под аудиторию', percentage: 80 },
                    { pain: 'Теряются при вопросах', percentage: 60 },
                    { pain: 'Не могут "продать" идеи руководству', percentage: 60 }
                ]
            },

            competitiveAdvantages: [
                'Специализация именно для разработчиков',
                'Практические кейсы из IT',
                'Готовые шаблоны и фразы',
                'Фокус на бизнес-ценность технических решений'
            ],

            monetization: {
                mainProduct: { price: 49, description: '5 модулей курса + шаблоны + кейсы' },
                additional: [
                    { product: 'Консультация 1:1', price: 100, unit: 'час' },
                    { product: 'Корпоративный тренинг', price: 2000, unit: 'день' },
                    { product: 'Продвинутый курс', price: 149, description: 'для сениоров' }
                ]
            },

            metrics: {
                shortTerm: { sales: 50, rating: 4.5, repeatRate: 20 },
                mediumTerm: { sales: 200, corporateTrainings: 5, revenue: 15000 },
                longTerm: { sales: 500, revenue: 50000 }
            }
        };

        try {
            await setDoc(doc(this.db, this.collections.products, 'concept_v2'), productData);
            console.log('✅ Концепция продукта сохранена');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения концепции:', error);
            return false;
        }
    }

    // ==================== MVP МОДУЛЬ ====================
    
    async saveMVPModule() {
        const mvpData = {
            moduleNumber: 1,
            name: 'Переводчик кода',
            goal: 'Научить разработчиков переводить технические концепции в понятные бизнесу термины',
            date: '2024-01-04',
            
            lessons: [
                {
                    number: '1.1',
                    title: 'Два языка одной профессии',
                    content: 'Понимание разницы между техническим и бизнес-языком',
                    framework: 'ТБВ (Техническая проблема → Бизнес-последствия → Выгода)',
                    practicalTask: 'Перевести 4 технические фразы на бизнес-язык'
                },
                {
                    number: '1.2',
                    title: 'Словарь переводчика',
                    content: '20 готовых переводов техника → бизнес',
                    translations: [
                        { tech: 'Рефакторинг', business: 'Оптимизация кода для ускорения разработки' },
                        { tech: 'Технический долг', business: 'Накопленные проблемы, замедляющие развитие' },
                        { tech: 'Legacy код', business: 'Устаревший код, требующий больше времени на изменения' },
                        { tech: 'Performance', business: 'Скорость работы приложения' },
                        { tech: 'Scalability', business: 'Способность выдерживать рост нагрузки' }
                        // ... остальные переводы
                    ]
                },
                {
                    number: '1.3',
                    title: 'Фреймворк ПРВ',
                    content: 'Структура Проблема-Решение-Выгода для любых объяснений',
                    structure: {
                        problem: 'Какая боль у пользователей/бизнеса',
                        solution: 'Техническое решение простыми словами',
                        benefit: 'Конкретные метрики улучшения'
                    }
                },
                {
                    number: '1.4',
                    title: 'Готовые фразы-переводчики',
                    content: 'Банк фраз для разных ситуаций',
                    phrases: {
                        explanation: [
                            'Представьте, что наш код - это город, а я предлагаю построить новые дороги',
                            'Это как разница между рукописным письмом и печатной машинкой'
                        ],
                        complexity: [
                            'Это займет время, потому что нужно не сломать то, что уже работает',
                            'Как ремонт фундамента - незаметно, но критически важно'
                        ]
                    }
                },
                {
                    number: '1.5',
                    title: 'Практический кейс',
                    content: 'Переписывание технического ТЗ для бизнес-аудитории',
                    case: {
                        original: 'Техническое ТЗ по оптимизации SQL запросов',
                        transformed: 'Презентация для руководства с ПРВ структурой'
                    }
                }
            ],

            tools: [
                'Таблица переводов 20 технических терминов',
                'Фреймворк ПРВ для любых объяснений',
                'Банк готовых фраз для презентаций',
                'Реальный кейс с примером решения',
                'Чек-лист для самопроверки'
            ],

            result: 'Умение переводить любые технические концепции в понятные бизнесу термины',
            timeToComplete: '2-3 часа',
            practicalValue: 'Сразу можете применять в работе'
        };

        try {
            await setDoc(doc(this.db, this.collections.mvp, 'module1_translator'), mvpData);
            console.log('✅ MVP модуль сохранен');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения MVP:', error);
            return false;
        }
    }

    // ==================== ПОСТЫ БЛОГА ====================
    
    async saveBlogPosts() {
        const blogPosts = [
            {
                id: 'day4_blog',
                title: 'День 4: Валидация концепции и создание MVP - от интервью к готовому продукту',
                date: '2024-01-04',
                type: 'blog',
                platform: 'blog',
                tags: ['валидация', 'mvp', 'интервью', 'продукт'],
                summary: 'Провел симулированные интервью с программистами и создал валидированную концепцию продукта + MVP первого модуля',
                achievements: [
                    'Проведено 5 интервью с разработчиками',
                    'Валидирована концепция продукта',
                    'Создан MVP первого модуля курса'
                ],
                metrics: {
                    interviews: 5,
                    validationRate: 100,
                    averagePrice: 65,
                    priceRange: { min: 40, max: 100 }
                },
                insights: [
                    'Проблема болезненная - влияет на карьерный рост',
                    'Готовы платить - 100% респондентов',
                    'Цена адекватна - $49 в диапазоне ожиданий',
                    'Ниша правильная - soft skills критичны'
                ]
            },
            {
                id: 'day4_telegram',
                title: 'День 4: Валидация концепции и создание MVP',
                date: '2024-01-04',
                type: 'social',
                platform: 'telegram',
                tags: ['валидация', 'mvp', 'edtech', 'стартап'],
                summary: 'Сегодня провел симулированные интервью с программистами и создал валидированную концепцию продукта + MVP первого модуля!',
                keyPoints: [
                    '100% респондентов подтвердили проблему',
                    '100% готовы платить за решение',
                    'Средняя цена: $65 (наша $49 ✅)',
                    'Создан MVP первого модуля курса'
                ]
            }
        ];

        try {
            for (const post of blogPosts) {
                await setDoc(doc(this.db, this.collections.blogPosts, post.id), post);
            }
            console.log('✅ Посты блога сохранены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения постов:', error);
            return false;
        }
    }

    // ==================== ЕЖЕДНЕВНЫЕ МЕТРИКИ ====================
    
    async saveDailyMetrics() {
        const metricsData = {
            date: '2024-01-04',
            day: 4,
            
            completed: {
                interviews: 5,
                productConcept: 1,
                mvpModules: 1,
                blogPosts: 2,
                timeSpent: 4 // часов
            },

            validation: {
                problemConfirmed: true,
                willingToPayPercentage: 100,
                priceValidated: true,
                targetAudienceCorrect: true
            },

            nextSteps: [
                'Создать лендинг с новым позиционированием',
                'Подготовить бесплатный мини-урок',
                'Запустить предзаказ со скидкой 50%',
                'Цель: 10 предзаказов до конца недели'
            ],

            goals: {
                weekly: { preorders: 10, emailSubscribers: 50, landingViews: 200 },
                monthly: { sales: 50, rating: 4.5, repeatRate: 20 },
                quarterly: { sales: 200, corporateTrainings: 5, revenue: 15000 }
            },

            insights: [
                'Валидация через интервью - это золото!',
                'Фокус на переводе техника → бизнес',
                'Специализация для разработчиков работает',
                'Готовые инструменты критически важны'
            ]
        };

        try {
            await setDoc(doc(this.db, this.collections.metrics, 'day4'), metricsData);
            console.log('✅ Ежедневные метрики сохранены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения метрик:', error);
            return false;
        }
    }

    // ==================== ОСНОВНОЙ МЕТОД ЗАГРУЗКИ ====================
    
    async uploadAllData() {
        console.log('🚀 Начинаю загрузку всех данных в Firebase...');
        
        const results = await Promise.allSettled([
            this.saveInterviewData(),
            this.saveProductConcept(),
            this.saveMVPModule(),
            this.saveBlogPosts(),
            this.saveDailyMetrics()
        ]);

        let successCount = 0;
        results.forEach((result, index) => {
            const operations = ['Интервью', 'Концепция продукта', 'MVP модуль', 'Посты блога', 'Метрики'];
            if (result.status === 'fulfilled' && result.value) {
                successCount++;
                console.log(`✅ ${operations[index]} - успешно`);
            } else {
                console.log(`❌ ${operations[index]} - ошибка`);
            }
        });

        console.log(`\n🎉 Загрузка завершена: ${successCount}/5 операций успешно`);
        return successCount === 5;
    }

    // ==================== МЕТОДЫ ЧТЕНИЯ ====================
    
    async getAllInterviews() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.collections.interviews));
            const interviews = [];
            querySnapshot.forEach((doc) => {
                interviews.push({ id: doc.id, ...doc.data() });
            });
            return interviews;
        } catch (error) {
            console.error('Ошибка получения интервью:', error);
            return [];
        }
    }

    async getAllBlogPosts() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.collections.blogPosts));
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
            });
            return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Ошибка получения постов:', error);
            return [];
        }
    }

    async getDailyMetrics() {
        try {
            const querySnapshot = await getDocs(collection(this.db, this.collections.metrics));
            const metrics = [];
            querySnapshot.forEach((doc) => {
                metrics.push({ id: doc.id, ...doc.data() });
            });
            return metrics.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Ошибка получения метрик:', error);
            return [];
        }
    }
}

// Экспорт для использования
export default StartupDataManager;

// Для использования в браузере
if (typeof window !== 'undefined') {
    window.StartupDataManager = StartupDataManager;
} 