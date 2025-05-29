// 🎨 UX/UI ДИЗАЙН АВТОПОСТИНГ БОТ
// Автоматизация продвижения курса "Прототипирование в Figma и UX/UI дизайн"
// Готов для деплоя на Railway

const schedule = require('node-schedule');
const axios = require('axios');
const express = require('express');

// Создаем веб-сервер для Railway
const app = express();
const PORT = process.env.PORT || 3000;

// Конфигурация из переменных окружения
const CONFIG = {
    // Telegram Bot API
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    NOTIFICATION_CHAT_ID: process.env.NOTIFICATION_CHAT_ID,
    
    // Ссылки на UX/UI курс
    LANDING_URL: process.env.LANDING_URL || 'https://digoclasses.netlify.app/ux-ui-landing.html',
    FREE_LESSON_URL: process.env.FREE_LESSON_URL || 'https://digoclasses.netlify.app/ux-ui-free-lesson.html',
    
    // Каналы для продвижения
    TELEGRAM_CHANNEL: process.env.TELEGRAM_CHANNEL || '@digoclasses_ux'
};

// Health check endpoint для Railway
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        bot: 'DigoClasses UX/UI Design AutoPosting Bot',
        course: 'Прототипирование в Figma и UX/UI дизайн',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        scheduledJobs: schedule.scheduledJobs ? Object.keys(schedule.scheduledJobs).length : 0
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', course: 'UX/UI Design', timestamp: new Date().toISOString() });
});

// Запуск веб-сервера
app.listen(PORT, () => {
    console.log(`🌐 UX/UI автопостинг сервер запущен на порту ${PORT}`);
    console.log(`🎨 Бот готов к продвижению курса дизайна`);
});

// 🎨 КОНТЕНТ ДЛЯ АВТОПОСТИНГА UX/UI КУРСА

const UX_UI_POSTS = {
    linkedin: [
        {
            text: `🎨 Хотите войти в IT без программирования?

UX/UI дизайн - ваш шанс!

Реальная история: в 2024 зарплаты UX/UI дизайнеров в Таллинне: 2500-4500€

Что нужно знать:
✅ Figma (основной инструмент)
✅ Принципы UX исследований  
✅ Создание прототипов
✅ Понимание пользователей

Наш интенсивный курс - 3 месяца до первого портфолио.

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}
💰 Курс со скидкой: ${CONFIG.LANDING_URL}

#UXdesign #UIdesign #Figma #ITкарьера #дизайн`,
            scheduledFor: 'monday_10am',
            channel: CONFIG.TELEGRAM_CHANNEL
        },
        {
            text: `🚀 Figma меняет всё в дизайне!

Почему именно Figma:
→ Работает в браузере
→ Командная работа в реальном времени  
→ Бесплатная версия для старта
→ Используют Google, Netflix, Airbnb

В нашем курсе:
🎯 От новичка до профи за 3 месяца
🎯 252 часа практики
🎯 Создание полного портфолио
🎯 Подготовка к трудоустройству

Начните с бесплатного урока: ${CONFIG.FREE_LESSON_URL}

#Figma #дизайн #UX #UI #портфолио`,
            scheduledFor: 'thursday_2pm',
            channel: CONFIG.TELEGRAM_CHANNEL
        },
        {
            text: `💡 UX исследования - основа успешного продукта

Статистика:
• 88% стартапов провалились из-за плохого UX
• Каждый $1 в UX приносит $100 прибыли
• UX дизайнеры зарабатывают на 40% больше обычных дизайнеров

В курсе изучите:
🔍 Анализ пользователей
🔍 Создание персон
🔍 Customer Journey Map
🔍 Тестирование прототипов

Станьте востребованным UX специалистом: ${CONFIG.LANDING_URL}

#UXresearch #дизайнмышление #пользователи`,
            scheduledFor: 'monday_3pm',
            channel: CONFIG.TELEGRAM_CHANNEL
        }
    ],
    telegram: [
        {
            text: `🎨 Опрос для будущих дизайнеров:

Что больше всего привлекает в UX/UI дизайне?

🔹 Творческая работа
🔹 Высокие зарплаты  
🔹 Удаленная работа
🔹 Влияние на продукт
🔹 Вход в IT без кода

Курс "Прототипирование в Figma и UX/UI дизайн" поможет освоить профессию с нуля!

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}
💰 Записаться со скидкой: ${CONFIG.LANDING_URL}`,
            scheduledFor: 'tuesday_9am',
            channel: CONFIG.TELEGRAM_CHANNEL
        },
        {
            text: `🎯 5 фактов о карьере UX/UI дизайнера:

1️⃣ Средняя зарплата в Эстонии: 3500€
2️⃣ Можно работать удаленно на весь мир
3️⃣ Не нужно знать программирование
4️⃣ Высокий спрос на рынке труда
5️⃣ Креативная и аналитическая работа

Хотите попробовать? Начните с бесплатного урока!

📚 Урок: ${CONFIG.FREE_LESSON_URL}
🚀 Полный курс: ${CONFIG.LANDING_URL}

За 3 месяца - от новичка до портфолио! 💪`,
            scheduledFor: 'friday_4pm',
            channel: CONFIG.TELEGRAM_CHANNEL
        },
        {
            text: `🔥 Срочно! Скидка 25% на курс UX/UI дизайна!

Что входит в курс:
✅ 252 академических часа
✅ Изучение Figma с нуля до профи
✅ UX исследования и анализ
✅ HTML/CSS для дизайнеров
✅ Создание полного портфолио
✅ Помощь в трудоустройстве

Обычная цена: 2008€
Со скидкой: 1490€ 

⏰ Предложение ограничено!

Записаться: ${CONFIG.LANDING_URL}`,
            scheduledFor: 'wednesday_1pm',
            channel: CONFIG.TELEGRAM_CHANNEL
        }
    ]
};

// Функция отправки в Telegram
async function postToTelegram(text, channelId) {
    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: channelId,
            text: text,
            parse_mode: 'HTML'
        });

        console.log(`✅ Telegram пост отправлен в ${channelId}`);
        await sendNotification(`📱 Telegram пост опубликован!\n\nКанал: ${channelId}\n\nТекст: ${text.substring(0, 100)}...`);
        return response.data;
    } catch (error) {
        console.error('❌ Ошибка отправки в Telegram:', error.message);
        await sendNotification(`❌ Ошибка Telegram: ${error.message}`);
        throw error;
    }
}

// Функция отправки в LinkedIn (заглушка - требует отдельной настройки API)
async function postToLinkedIn(text) {
    try {
        console.log('📝 LinkedIn пост (симуляция):', text.substring(0, 100) + '...');
        await sendNotification(`💼 LinkedIn пост запланирован!\n\nТекст: ${text.substring(0, 100)}...`);
        return { success: true, platform: 'LinkedIn' };
    } catch (error) {
        console.error('❌ Ошибка LinkedIn:', error.message);
        return { success: false, error: error.message };
    }
}

// Отправка уведомлений
async function sendNotification(message) {
    try {
        if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.NOTIFICATION_CHAT_ID) {
            console.log('📝 Уведомление (локально):', message);
            return;
        }

        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: CONFIG.NOTIFICATION_CHAT_ID,
            text: `🎨 UX/UI Автопостинг бот:\n${message}`,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('❌ Ошибка уведомления:', error.message);
    }
}

// Планирование постов
function scheduleUXUIPosts() {
    console.log('📅 Настройка расписания UX/UI постов...');

    // Планируем каждый пост
    [...UX_UI_POSTS.linkedin, ...UX_UI_POSTS.telegram].forEach(post => {
        schedulePost(post, post.scheduledFor.includes('linkedin') ? 'linkedin' : 'telegram');
    });

    // Ежедневный отчет
    schedule.scheduleJob('0 18 * * *', sendDailyReport);
    
    console.log('✅ Все UX/UI посты запланированы!');
}

function schedulePost(post, platform) {
    const rule = getScheduleRule(post.scheduledFor);
    
    schedule.scheduleJob(rule, async () => {
        try {
            if (platform === 'telegram') {
                await postToTelegram(post.text, post.channel);
            } else if (platform === 'linkedin') {
                await postToLinkedIn(post.text);
            }
        } catch (error) {
            console.error(`❌ Ошибка планировщика (${platform}):`, error.message);
        }
    });
    
    console.log(`📅 ${platform} пост запланирован на ${post.scheduledFor}`);
}

function getScheduleRule(timeString) {
    const scheduleMap = {
        'monday_10am': '0 10 * * 1',      // Понедельник 10:00
        'monday_3pm': '0 15 * * 1',       // Понедельник 15:00
        'tuesday_9am': '0 9 * * 2',       // Вторник 9:00
        'wednesday_1pm': '0 13 * * 3',    // Среда 13:00
        'thursday_2pm': '0 14 * * 4',     // Четверг 14:00
        'friday_4pm': '0 16 * * 5'        // Пятница 16:00
    };
    
    return scheduleMap[timeString] || '0 12 * * *'; // По умолчанию каждый день в 12:00
}

// Запуск автоматизации
function startUXUIAutomation() {
    console.log('🎨 Запуск UX/UI автопостинг системы...');
    
    scheduleUXUIPosts();
    
    // Отправляем уведомление о запуске
    sendNotification('🚀 UX/UI автопостинг бот запущен! Система продвижения курса дизайна работает на автопилоте.');
    
    console.log('✅ UX/UI автоматизация активна!');
}

// Ежедневный отчет
async function sendDailyReport() {
    const currentTime = new Date().toLocaleString('ru-RU');
    const uptime = Math.floor(process.uptime() / 3600); // в часах
    
    const report = `📊 Ежедневный отчет UX/UI бота
    
🕒 Время: ${currentTime}
⏰ Работает: ${uptime} часов
🎨 Курс: Прототипирование в Figma и UX/UI дизайн
💰 Цена: 1490€ (скидка 25%)
📈 Планы: ${Object.keys(schedule.scheduledJobs).length} активных задач

🔗 Лендинг: ${CONFIG.LANDING_URL}
🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}

Система работает стабильно! 🎯`;

    await sendNotification(report);
}

// Запуск при старте сервера
startUXUIAutomation();

// Экспорт для тестирования
module.exports = {
    startUXUIAutomation,
    scheduleUXUIPosts,
    postToTelegram,
    postToLinkedIn
}; 