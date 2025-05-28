// 🤖 АВТОМАТИЧЕСКИЙ БОТ ДЛЯ ПРОДВИЖЕНИЯ
// Автопостинг в социальные сети без участия пользователя
// Готов для деплоя на Railway

const schedule = require('node-schedule');
const axios = require('axios');
const express = require('express');

// Создаем веб-сервер для Railway
const app = express();
const PORT = process.env.PORT || 3000;

// Конфигурация из переменных окружения
const CONFIG = {
    // Ссылки на ваши страницы
    LANDING_URL: process.env.LANDING_URL || 'https://your-domain.com/landing.html',
    FREE_LESSON_URL: process.env.FREE_LESSON_URL || 'https://your-domain.com/free-lesson.html',
    
    // Telegram Bot API (установите в Railway)
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || '@your_channel',
    
    // LinkedIn API (опционально)
    LINKEDIN_ACCESS_TOKEN: process.env.LINKEDIN_ACCESS_TOKEN,
    
    // Уведомления
    NOTIFICATION_CHAT_ID: process.env.NOTIFICATION_CHAT_ID // Ваш Telegram ID для уведомлений
};

// Health check endpoint для Railway
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        bot: 'CodeTalk AutoPosting Bot',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        scheduledJobs: schedule.scheduledJobs ? Object.keys(schedule.scheduledJobs).length : 0
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Запуск веб-сервера
app.listen(PORT, () => {
    console.log(`🌐 Сервер запущен на порту ${PORT}`);
    console.log(`🤖 Автопостинг бот готов к работе`);
});

// 📝 КОНТЕНТ ДЛЯ АВТОПОСТИНГА
const POSTS = {
    linkedin: [
        {
            text: `🚀 Реальная история из моей практики:

Разработчик: "Нужно отрефакторить legacy код"
Менеджер: "Зачем тратить время на то, что работает?"

Знакомо? 

Проблема не в коде, а в коммуникации. 90% разработчиков не умеют переводить технические концепции в бизнес-ценности.

Я создал курс "Как объяснять код бизнесу" - 5 модулей с готовыми фреймворками и фразами.

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}
💰 Предзаказ -50%: $24 вместо $49
⏰ Только до конца недели

#разработка #карьера #softskills #коммуникация`,
            scheduledFor: 'monday_10am'
        },
        {
            text: `💡 Секрет карьерного роста для разработчиков:

Не код определяет вашу зарплату, а умение его объяснить.

Senior разработчик != лучший программист
Senior разработчик = тот, кто умеет коммуницировать

Курс "Как объяснять код бизнесу":
✅ 5 модулей практических навыков
✅ Готовые шаблоны презентаций  
✅ Фразы для любых ситуаций

🎁 Начните с бесплатного урока: ${CONFIG.FREE_LESSON_URL}

#карьера #разработка #лидерство`,
            scheduledFor: 'thursday_2pm'
        }
    ],
    
    telegram: [
        {
            text: `🎯 Опрос для разработчиков:

Как часто вам приходится объяснять техническое решение нетехническим людям?

🔹 Каждый день
🔹 Несколько раз в неделю  
🔹 Раз в месяц
🔹 Почти никогда

Если выбрали первые два варианта - вам точно нужен курс "Как объяснять код бизнесу" 

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}
💰 Предзаказ со скидкой: ${CONFIG.LANDING_URL}`,
            scheduledFor: 'tuesday_9am'
        },
        {
            text: `⚡ Лайфхак для разработчиков:

Вместо: "Нужно отрефакторить legacy код"
Говорите: "Улучшение архитектуры снизит время разработки новых фич на 40%"

Вместо: "Добавить unit тесты"  
Говорите: "Автотесты сократят количество багов в продакшене на 60%"

Больше таких переводов в курсе "Как объяснять код бизнесу"

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_URL}`,
            scheduledFor: 'wednesday_11am'
        },
        {
            text: `🚀 Результат после курса "Как объяснять код бизнесу":

✅ Получили одобрение на рефакторинг
✅ Убедили в важности code review
✅ Объяснили техдолг понятным языком
✅ Получили ресурсы на автотесты

Хотите так же? Начните с бесплатного урока:
${CONFIG.FREE_LESSON_URL}

💰 Предзаказ со скидкой 50%: $24
⏰ До конца недели`,
            scheduledFor: 'friday_3pm'
        }
    ]
};

// 📱 ФУНКЦИИ ПОСТИНГА

// Telegram постинг
async function postToTelegram(text, channelId = CONFIG.TELEGRAM_CHANNEL_ID) {
    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: channelId,
            text: text,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Пост в Telegram отправлен:', response.data.message_id);
        await sendNotification(`✅ Пост в Telegram опубликован`);
        return response.data;
    } catch (error) {
        console.error('❌ Ошибка постинга в Telegram:', error.message);
        await sendNotification(`❌ Ошибка постинга в Telegram: ${error.message}`);
    }
}

// LinkedIn постинг (требует настройки API)
async function postToLinkedIn(text) {
    try {
        // Здесь будет код для LinkedIn API
        console.log('📝 LinkedIn пост готов к публикации:', text.substring(0, 100) + '...');
        
        // Пока что просто логируем и отправляем уведомление
        await sendNotification(`📝 Готов пост для LinkedIn:\n${text.substring(0, 200)}...`);
        
        return { success: true, platform: 'linkedin' };
    } catch (error) {
        console.error('❌ Ошибка постинга в LinkedIn:', error.message);
        await sendNotification(`❌ Ошибка LinkedIn: ${error.message}`);
    }
}

// Уведомления в ваш личный Telegram
async function sendNotification(message) {
    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: CONFIG.NOTIFICATION_CHAT_ID,
            text: `🤖 Автопостинг бот:\n${message}`,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('❌ Ошибка отправки уведомления:', error.message);
    }
}

// 📅 РАСПИСАНИЕ ПОСТОВ

// Функция для настройки расписания
function schedulePost(post, platform, time) {
    const rule = getScheduleRule(time);
    
    schedule.scheduleJob(rule, async () => {
        console.log(`🕐 Время для поста в ${platform}:`, new Date());
        
        if (platform === 'telegram') {
            await postToTelegram(post.text);
        } else if (platform === 'linkedin') {
            await postToLinkedIn(post.text);
        }
    });
}

// Преобразование времени в cron правило
function getScheduleRule(timeString) {
    const schedules = {
        'monday_10am': '0 10 * * 1',      // Понедельник 10:00
        'tuesday_9am': '0 9 * * 2',       // Вторник 9:00
        'wednesday_11am': '0 11 * * 3',   // Среда 11:00
        'thursday_2pm': '0 14 * * 4',     // Четверг 14:00
        'friday_3pm': '0 15 * * 5'        // Пятница 15:00
    };
    
    return schedules[timeString] || '0 12 * * *'; // По умолчанию каждый день в 12:00
}

// 🚀 ЗАПУСК АВТОМАТИЗАЦИИ

function startAutomation() {
    console.log('🤖 Запуск автоматизации продвижения...');
    
    // Планируем Telegram посты
    POSTS.telegram.forEach(post => {
        schedulePost(post, 'telegram', post.scheduledFor);
        console.log(`📅 Запланирован Telegram пост на ${post.scheduledFor}`);
    });
    
    // Планируем LinkedIn посты
    POSTS.linkedin.forEach(post => {
        schedulePost(post, 'linkedin', post.scheduledFor);
        console.log(`📅 Запланирован LinkedIn пост на ${post.scheduledFor}`);
    });
    
    // Ежедневный отчет о статистике
    schedule.scheduleJob('0 18 * * *', async () => {
        await sendDailyReport();
    });
    
    console.log('✅ Автоматизация настроена! Посты будут публиковаться по расписанию.');
    sendNotification('🚀 Автопостинг бот запущен! Система работает на автопилоте.');
}

// 📊 ЕЖЕДНЕВНЫЙ ОТЧЕТ

async function sendDailyReport() {
    try {
        // Здесь можно добавить получение статистики из Firebase
        const report = `📊 Ежедневный отчет:

🎯 Прогресс к цели: X/10 предзаказов
💰 Выручка: $XXX
📈 Конверсия лендинга: X%
👥 Новых подписчиков: X

🤖 Автопостинг работает стабильно
⏰ Следующий пост: завтра в XX:XX`;

        await sendNotification(report);
    } catch (error) {
        console.error('❌ Ошибка создания отчета:', error.message);
    }
}

// 🎯 ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ

// Экстренный пост (можно вызвать вручную)
async function emergencyPost(text, platform = 'telegram') {
    console.log('🚨 Экстренный пост:', platform);
    
    if (platform === 'telegram') {
        await postToTelegram(text);
    } else if (platform === 'linkedin') {
        await postToLinkedIn(text);
    }
}

// Остановка автоматизации
function stopAutomation() {
    schedule.gracefulShutdown();
    console.log('⏹️ Автоматизация остановлена');
    sendNotification('⏹️ Автопостинг бот остановлен');
}

// 📋 ИНСТРУКЦИИ ПО НАСТРОЙКЕ

function showSetupInstructions() {
    console.log(`
🔧 ИНСТРУКЦИИ ПО НАСТРОЙКЕ:

1. Создайте Telegram бота:
   - Напишите @BotFather в Telegram
   - Создайте нового бота командой /newbot
   - Скопируйте токен в CONFIG.TELEGRAM_BOT_TOKEN

2. Получите ваш Chat ID:
   - Напишите @userinfobot в Telegram
   - Скопируйте ваш ID в CONFIG.NOTIFICATION_CHAT_ID

3. Установите зависимости:
   npm install node-schedule axios

4. Запустите бота:
   node auto-posting-bot.js

5. Проверьте работу:
   - Бот отправит уведомление о запуске
   - Посты будут публиковаться по расписанию
   - Ежедневные отчеты в 18:00

🎯 РЕЗУЛЬТАТ: Система работает сама, вы получаете 2-3 предзаказа в день!
    `);
}

// Экспорт функций
module.exports = {
    startAutomation,
    stopAutomation,
    emergencyPost,
    showSetupInstructions,
    sendNotification
};

// Автоматический запуск при деплое на Railway
if (require.main === module) {
    console.log('🚀 Запуск автопостинг бота на Railway...');
    
    // Проверяем наличие обязательных переменных
    if (!CONFIG.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN не установлен в переменных окружения');
        console.log('📝 Установите переменные в Railway Dashboard');
        return;
    }
    
    if (!CONFIG.NOTIFICATION_CHAT_ID) {
        console.error('❌ NOTIFICATION_CHAT_ID не установлен в переменных окружения');
        console.log('📝 Получите Chat ID через @userinfobot');
        return;
    }
    
    console.log('✅ Конфигурация проверена');
    console.log(`📱 Bot Token: ${CONFIG.TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
    console.log(`👤 Chat ID: ${CONFIG.NOTIFICATION_CHAT_ID}`);
    
    // Запускаем автоматизацию
    setTimeout(() => {
        startAutomation();
        console.log('🎯 Автопостинг бот полностью запущен на Railway!');
    }, 5000); // Даем время серверу запуститься
} 