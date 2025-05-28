// Скрипт для автоматической загрузки данных в Firebase
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK
const admin = require('firebase-admin');

// Инициализация Firebase Admin (замените на ваш service account)
const serviceAccount = require('./firebase-service-account.json'); // Скачайте из Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
});

const db = admin.firestore();

class FirebaseUploader {
    constructor() {
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

    // Чтение и парсинг markdown файлов
    readMarkdownFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return this.parseMarkdown(content);
        } catch (error) {
            console.error(`Ошибка чтения файла ${filePath}:`, error.message);
            return null;
        }
    }

    // Простой парсер markdown для извлечения данных
    parseMarkdown(content) {
        const lines = content.split('\n');
        const data = {
            title: '',
            sections: {},
            metadata: {}
        };

        let currentSection = '';
        let currentContent = [];

        for (const line of lines) {
            if (line.startsWith('# ')) {
                data.title = line.replace('# ', '').trim();
            } else if (line.startsWith('## ')) {
                if (currentSection) {
                    data.sections[currentSection] = currentContent.join('\n');
                }
                currentSection = line.replace('## ', '').trim();
                currentContent = [];
            } else if (line.startsWith('### ')) {
                currentContent.push(line);
            } else {
                currentContent.push(line);
            }
        }

        if (currentSection) {
            data.sections[currentSection] = currentContent.join('\n');
        }

        return data;
    }

    // Загрузка результатов интервью
    async uploadInterviewResults() {
        console.log('📊 Загружаю результаты интервью...');
        
        const interviewFile = this.readMarkdownFile('./interview_results_day4.md');
        if (!interviewFile) return false;

        const interviewData = {
            id: 'day4_results',
            date: '2024-01-04',
            type: 'simulated',
            totalInterviews: 5,
            title: interviewFile.title,
            rawContent: interviewFile.sections,
            
            // Структурированные данные
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
                    skillsImportance: { communication: 9, presentations: 8, teamwork: 7 },
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
                    skillsImportance: { leadership: 9, presentations: 8, persuasion: 8 },
                    willingToPay: true,
                    maxPrice: 75,
                    quote: 'Хочу научиться продавать свои идеи руководству'
                }
                // Добавить остальные профили...
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
                validation: {
                    problemExists: true,
                    willingToPay: true,
                    priceValidated: true,
                    targetAudienceCorrect: true
                }
            },
            
            uploadedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection(this.collections.interviews).doc('day4_results').set(interviewData);
            console.log('✅ Результаты интервью загружены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка загрузки интервью:', error);
            return false;
        }
    }

    // Загрузка концепции продукта
    async uploadProductConcept() {
        console.log('📦 Загружаю концепцию продукта...');
        
        const productFile = this.readMarkdownFile('./product_concept_v2.md');
        if (!productFile) return false;

        const productData = {
            id: 'concept_v2',
            version: '2.0',
            date: '2024-01-04',
            title: productFile.title,
            rawContent: productFile.sections,
            
            // Структурированные данные
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
                    solution: 'Научиться переводить технические концепции в бизнес-ценности'
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

            metrics: {
                shortTerm: { sales: 50, rating: 4.5, repeatRate: 20 },
                mediumTerm: { sales: 200, corporateTrainings: 5, revenue: 15000 },
                longTerm: { sales: 500, revenue: 50000 }
            },
            
            uploadedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection(this.collections.products).doc('concept_v2').set(productData);
            console.log('✅ Концепция продукта загружена');
            return true;
        } catch (error) {
            console.error('❌ Ошибка загрузки концепции:', error);
            return false;
        }
    }

    // Загрузка MVP модуля
    async uploadMVPModule() {
        console.log('🎯 Загружаю MVP модуль...');
        
        const mvpFile = this.readMarkdownFile('./mvp_module1.md');
        if (!mvpFile) return false;

        const mvpData = {
            id: 'module1_translator',
            moduleNumber: 1,
            name: 'Переводчик кода',
            goal: 'Научить разработчиков переводить технические концепции в понятные бизнесу термины',
            date: '2024-01-04',
            title: mvpFile.title,
            rawContent: mvpFile.sections,
            
            // Структурированные данные
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
                    content: 'Банк фраз для разных ситуаций'
                },
                {
                    number: '1.5',
                    title: 'Практический кейс',
                    content: 'Переписывание технического ТЗ для бизнес-аудитории'
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
            practicalValue: 'Сразу можете применять в работе',
            
            uploadedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection(this.collections.mvp).doc('module1_translator').set(mvpData);
            console.log('✅ MVP модуль загружен');
            return true;
        } catch (error) {
            console.error('❌ Ошибка загрузки MVP:', error);
            return false;
        }
    }

    // Загрузка постов блога
    async uploadBlogPosts() {
        console.log('📝 Загружаю посты блога...');
        
        const postsDir = './posts/';
        const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
        
        let successCount = 0;
        
        for (const fileName of postFiles) {
            try {
                const postFile = this.readMarkdownFile(path.join(postsDir, fileName));
                if (!postFile) continue;

                const postId = fileName.replace('.md', '');
                const postData = {
                    id: postId,
                    fileName: fileName,
                    title: postFile.title,
                    rawContent: postFile.sections,
                    
                    // Определение типа поста
                    type: fileName.includes('telegram') ? 'social' : 'blog',
                    platform: fileName.includes('telegram') ? 'telegram' : 'blog',
                    
                    // Извлечение даты из названия файла
                    date: this.extractDateFromFileName(fileName),
                    
                    // Теги на основе содержания
                    tags: this.extractTags(postFile.title + ' ' + JSON.stringify(postFile.sections)),
                    
                    uploadedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                await db.collection(this.collections.blogPosts).doc(postId).set(postData);
                console.log(`✅ Пост ${fileName} загружен`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Ошибка загрузки поста ${fileName}:`, error);
            }
        }

        console.log(`✅ Загружено ${successCount} постов из ${postFiles.length}`);
        return successCount > 0;
    }

    // Загрузка ежедневных метрик
    async uploadDailyMetrics() {
        console.log('📈 Загружаю ежедневные метрики...');
        
        const metricsData = {
            id: 'day4',
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
            ],
            
            uploadedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection(this.collections.metrics).doc('day4').set(metricsData);
            console.log('✅ Ежедневные метрики загружены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка загрузки метрик:', error);
            return false;
        }
    }

    // Вспомогательные методы
    extractDateFromFileName(fileName) {
        const match = fileName.match(/day(\d+)/);
        if (match) {
            const day = parseInt(match[1]);
            const date = new Date('2024-01-01');
            date.setDate(date.getDate() + day - 1);
            return date.toISOString().split('T')[0];
        }
        return '2024-01-04'; // По умолчанию
    }

    extractTags(content) {
        const tags = [];
        const keywords = ['валидация', 'mvp', 'интервью', 'продукт', 'стартап', 'edtech', 'разработчики', 'softskills', 'презентации'];
        
        for (const keyword of keywords) {
            if (content.toLowerCase().includes(keyword)) {
                tags.push(keyword);
            }
        }
        
        return tags;
    }

    // Основной метод загрузки всех данных
    async uploadAllData() {
        console.log('🚀 Начинаю загрузку всех данных в Firebase...\n');
        
        const operations = [
            { name: 'Интервью', method: () => this.uploadInterviewResults() },
            { name: 'Концепция продукта', method: () => this.uploadProductConcept() },
            { name: 'MVP модуль', method: () => this.uploadMVPModule() },
            { name: 'Посты блога', method: () => this.uploadBlogPosts() },
            { name: 'Ежедневные метрики', method: () => this.uploadDailyMetrics() }
        ];

        let successCount = 0;
        
        for (const operation of operations) {
            try {
                const result = await operation.method();
                if (result) {
                    successCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка в операции "${operation.name}":`, error);
            }
            console.log(''); // Пустая строка для разделения
        }

        console.log(`🎉 Загрузка завершена: ${successCount}/${operations.length} операций успешно`);
        
        if (successCount === operations.length) {
            console.log('✅ Все данные успешно загружены в Firebase!');
        } else {
            console.log('⚠️ Некоторые операции завершились с ошибками');
        }
        
        return successCount === operations.length;
    }
}

// Запуск загрузки
async function main() {
    console.log('🔥 Firebase Data Uploader - Загрузка данных стартапа\n');
    
    const uploader = new FirebaseUploader();
    
    try {
        await uploader.uploadAllData();
    } catch (error) {
        console.error('💥 Критическая ошибка:', error);
        process.exit(1);
    }
    
    console.log('\n✨ Готово! Проверьте Firebase Console для подтверждения.');
    process.exit(0);
}

// Запуск только если файл выполняется напрямую
if (require.main === module) {
    main();
}

module.exports = FirebaseUploader; 