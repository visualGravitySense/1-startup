// 🌍 МНОГОЯЗЫЧНЫЙ АВТОПОСТИНГ БОТ
// Автоматизация продвижения на 3 языках: RU, EN, ET
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
    
    // Ссылки на курсы по языкам
    LANDING_RU: process.env.LANDING_RU || 'https://your-domain.com/ru/landing.html',
    LANDING_EN: process.env.LANDING_EN || 'https://your-domain.com/en/landing.html', 
    LANDING_ET: process.env.LANDING_ET || 'https://your-domain.com/et/landing.html',
    
    FREE_LESSON_RU: process.env.FREE_LESSON_RU || 'https://your-domain.com/ru/free-lesson.html',
    FREE_LESSON_EN: process.env.FREE_LESSON_EN || 'https://your-domain.com/en/free-lesson.html',
    FREE_LESSON_ET: process.env.FREE_LESSON_ET || 'https://your-domain.com/et/free-lesson.html',
    
    // Каналы для разных языков
    TELEGRAM_CHANNEL_RU: process.env.TELEGRAM_CHANNEL_RU || '@digoclasses_ru',
    TELEGRAM_CHANNEL_EN: process.env.TELEGRAM_CHANNEL_EN || '@digoclasses_en',
    TELEGRAM_CHANNEL_ET: process.env.TELEGRAM_CHANNEL_ET || '@digoclasses_et'
};

// Health check endpoint для Railway
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        bot: 'DigoClasses Multilingual AutoPosting Bot',
        languages: ['Russian', 'English', 'Estonian'],
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        scheduledJobs: schedule.scheduledJobs ? Object.keys(schedule.scheduledJobs).length : 0
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', languages: 3, timestamp: new Date().toISOString() });
});

// Запуск веб-сервера
app.listen(PORT, () => {
    console.log(`🌐 Многоязычный сервер запущен на порту ${PORT}`);
    console.log(`🤖 Автопостинг бот готов к работе на 3 языках`);
});

// 📝 МНОГОЯЗЫЧНЫЙ КОНТЕНТ ДЛЯ АВТОПОСТИНГА

const MULTILINGUAL_POSTS = {
    // 🇷🇺 РУССКИЕ ПОСТЫ
    russian: {
        linkedin: [
            {
                text: `🚀 Реальная история из моей практики:

Разработчик: "Нужно отрефакторить legacy код"
Менеджер: "Зачем тратить время на то, что работает?"

Знакомо? 

Проблема не в коде, а в коммуникации. 90% разработчиков не умеют переводить технические концепции в бизнес-ценности.

Я создал курс "Как объяснять код бизнесу" - 5 модулей с готовыми фреймворками и фразами.

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_RU}
💰 Предзаказ -50%: $24 вместо $49
⏰ Только до конца недели

#разработка #карьера #softskills #коммуникация`,
                scheduledFor: 'monday_10am',
                channel: CONFIG.TELEGRAM_CHANNEL_RU
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

🎁 Начните с бесплатного урока: ${CONFIG.FREE_LESSON_RU}

#карьера #разработка #лидерство`,
                scheduledFor: 'thursday_2pm',
                channel: CONFIG.TELEGRAM_CHANNEL_RU
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

🎁 Бесплатный урок: ${CONFIG.FREE_LESSON_RU}
💰 Предзаказ со скидкой: ${CONFIG.LANDING_RU}`,
                scheduledFor: 'tuesday_9am',
                channel: CONFIG.TELEGRAM_CHANNEL_RU
            }
        ]
    },

    // 🇺🇸 ENGLISH POSTS
    english: {
        linkedin: [
            {
                text: `🚀 Real story from my practice:

Developer: "We need to refactor legacy code"
Manager: "Why waste time on something that works?"

Sound familiar?

The problem isn't the code, it's communication. 90% of developers can't translate technical concepts into business value.

I created "How to Explain Code to Business" course - 5 modules with ready frameworks and phrases.

🎁 Free lesson: ${CONFIG.FREE_LESSON_EN}
💰 Pre-order -50%: $24 instead of $49
⏰ Only until end of week

#development #career #softskills #communication`,
                scheduledFor: 'monday_11am',
                channel: CONFIG.TELEGRAM_CHANNEL_EN
            },
            {
                text: `💡 Career growth secret for developers:

It's not code that determines your salary, but your ability to explain it.

Senior developer != best programmer
Senior developer = one who can communicate

"How to Explain Code to Business" course:
✅ 5 modules of practical skills
✅ Ready presentation templates
✅ Phrases for any situation

🎁 Start with free lesson: ${CONFIG.FREE_LESSON_EN}

#career #development #leadership`,
                scheduledFor: 'thursday_3pm',
                channel: CONFIG.TELEGRAM_CHANNEL_EN
            }
        ],
        telegram: [
            {
                text: `🎯 Poll for developers:

How often do you need to explain technical solutions to non-technical people?

🔹 Every day
🔹 Several times a week
🔹 Once a month
🔹 Almost never

If you chose the first two - you definitely need "How to Explain Code to Business" course

🎁 Free lesson: ${CONFIG.FREE_LESSON_EN}
💰 Pre-order with discount: ${CONFIG.LANDING_EN}`,
                scheduledFor: 'tuesday_10am',
                channel: CONFIG.TELEGRAM_CHANNEL_EN
            }
        ]
    },

    // 🇪🇪 ESTONIAN POSTS
    estonian: {
        linkedin: [
            {
                text: `🚀 Tõeline lugu minu praktikast:

Arendaja: "Peame legacy koodi refaktoreerima"
Juht: "Miks kulutada aega millegi peale, mis töötab?"

Tuttav?

Probleem pole koodis, vaid kommunikatsioonis. 90% arendajatest ei oska tehnilisi kontseptsioone äriväärtuseks tõlkida.

Lõin kursuse "Kuidas koodi ärisektorile selgitada" - 5 moodulit valmis raamistike ja fraasidega.

🎁 Tasuta õppetund: ${CONFIG.FREE_LESSON_ET}
💰 Eeltellimus -50%: $24 asemel $49
⏰ Ainult nädala lõpuni

#arendus #karjäär #pehmedoskused #kommunikatsioon`,
                scheduledFor: 'monday_12pm',
                channel: CONFIG.TELEGRAM_CHANNEL_ET
            },
            {
                text: `💡 Karjäärikasvu saladus arendajatele:

Mitte kood ei määra teie palka, vaid oskus seda selgitada.

Senior arendaja != parim programmeerija
Senior arendaja = see, kes oskab kommunikeeruda

"Kuidas koodi ärisektorile selgitada" kursus:
✅ 5 praktiliste oskuste moodulit
✅ Valmis esitluste mallid
✅ Fraasid igaks olukorraks

🎁 Alustage tasuta õppetunniga: ${CONFIG.FREE_LESSON_ET}

#karjäär #arendus #juhtimine`,
                scheduledFor: 'thursday_4pm',
                channel: CONFIG.TELEGRAM_CHANNEL_ET
            }
        ],
        telegram: [
            {
                text: `🎯 Küsitlus arendajatele:

Kui tihti peate tehnilisi lahendusi mittetehnilisele inimesele selgitama?

🔹 Iga päev
🔹 Mitu korda nädalas
🔹 Kord kuus
🔹 Peaaegu mitte kunagi

Kui valisite esimesed kaks - vajate kindlasti kursust "Kuidas koodi ärisektorile selgitada"

🎁 Tasuta õppetund: ${CONFIG.FREE_LESSON_ET}
💰 Eeltellimus allahindlusega: ${CONFIG.LANDING_ET}`,
                scheduledFor: 'tuesday_11am',
                channel: CONFIG.TELEGRAM_CHANNEL_ET
            }
        ]
    }
};

// 📱 ФУНКЦИИ ПОСТИНГА

// Telegram постинг с поддержкой языков
async function postToTelegram(text, channelId, language = 'ru') {
    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: channelId,
            text: text,
            parse_mode: 'HTML'
        });
        
        console.log(`✅ ${language.toUpperCase()} пост в Telegram отправлен:`, response.data.message_id);
        await sendNotification(`✅ ${language.toUpperCase()} пост в Telegram опубликован`);
        return response.data;
    } catch (error) {
        console.error(`❌ Ошибка ${language} постинга в Telegram:`, error.message);
        await sendNotification(`❌ Ошибка ${language} постинга в Telegram: ${error.message}`);
    }
}

// LinkedIn постинг с поддержкой языков
async function postToLinkedIn(text, language = 'ru') {
    try {
        console.log(`📝 ${language.toUpperCase()} LinkedIn пост готов к публикации:`, text.substring(0, 100) + '...');
        await sendNotification(`📝 Готов ${language.toUpperCase()} пост для LinkedIn:\n${text.substring(0, 200)}...`);
        return { success: true, platform: 'linkedin', language };
    } catch (error) {
        console.error(`❌ Ошибка ${language} постинга в LinkedIn:`, error.message);
        await sendNotification(`❌ Ошибка ${language} LinkedIn: ${error.message}`);
    }
}

// Уведомления
async function sendNotification(message) {
    try {
        const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: CONFIG.NOTIFICATION_CHAT_ID,
            text: `🌍 Многоязычный автопостинг бот:\n${message}`,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('❌ Ошибка отправки уведомления:', error.message);
    }
}

// 📅 РАСПИСАНИЕ МНОГОЯЗЫЧНЫХ ПОСТОВ

function scheduleMultilingualPosts() {
    console.log('🌍 Настройка многоязычного расписания...');
    
    // Русские посты
    MULTILINGUAL_POSTS.russian.linkedin.forEach(post => {
        schedulePost(post, 'linkedin', 'russian');
    });
    MULTILINGUAL_POSTS.russian.telegram.forEach(post => {
        schedulePost(post, 'telegram', 'russian');
    });
    
    // Английские посты
    MULTILINGUAL_POSTS.english.linkedin.forEach(post => {
        schedulePost(post, 'linkedin', 'english');
    });
    MULTILINGUAL_POSTS.english.telegram.forEach(post => {
        schedulePost(post, 'telegram', 'english');
    });
    
    // Эстонские посты
    MULTILINGUAL_POSTS.estonian.linkedin.forEach(post => {
        schedulePost(post, 'linkedin', 'estonian');
    });
    MULTILINGUAL_POSTS.estonian.telegram.forEach(post => {
        schedulePost(post, 'telegram', 'estonian');
    });
    
    console.log('✅ Многоязычное расписание настроено!');
}

function schedulePost(post, platform, language) {
    const rule = getScheduleRule(post.scheduledFor);
    
    schedule.scheduleJob(rule, async () => {
        console.log(`🕐 Время для ${language} поста в ${platform}:`, new Date());
        
        if (platform === 'telegram') {
            await postToTelegram(post.text, post.channel, language);
        } else if (platform === 'linkedin') {
            await postToLinkedIn(post.text, language);
        }
    });
}

function getScheduleRule(timeString) {
    const schedules = {
        'monday_10am': '0 10 * * 1',      // Понедельник 10:00 (RU)
        'monday_11am': '0 11 * * 1',      // Понедельник 11:00 (EN)
        'monday_12pm': '0 12 * * 1',      // Понедельник 12:00 (ET)
        'tuesday_9am': '0 9 * * 2',       // Вторник 9:00 (RU)
        'tuesday_10am': '0 10 * * 2',     // Вторник 10:00 (EN)
        'tuesday_11am': '0 11 * * 2',     // Вторник 11:00 (ET)
        'thursday_2pm': '0 14 * * 4',     // Четверг 14:00 (RU)
        'thursday_3pm': '0 15 * * 4',     // Четверг 15:00 (EN)
        'thursday_4pm': '0 16 * * 4'      // Четверг 16:00 (ET)
    };
    
    return schedules[timeString] || '0 12 * * *';
}

// 🚀 ЗАПУСК МНОГОЯЗЫЧНОЙ АВТОМАТИЗАЦИИ

function startMultilingualAutomation() {
    console.log('🌍 Запуск многоязычной автоматизации...');
    
    scheduleMultilingualPosts();
    
    // Ежедневный многоязычный отчет
    schedule.scheduleJob('0 18 * * *', async () => {
        await sendMultilingualReport();
    });
    
    console.log('✅ Многоязычная автоматизация настроена!');
    sendNotification('🚀 Многоязычный автопостинг бот запущен! 🇷🇺🇺🇸🇪🇪');
}

// 📊 МНОГОЯЗЫЧНЫЙ ОТЧЕТ

async function sendMultilingualReport() {
    try {
        const report = `📊 Многоязычный ежедневный отчет:

🇷🇺 РУССКИЙ РЫНОК:
🎯 Прогресс к цели: X/10 предзаказов
💰 Выручка: $XXX

🇺🇸 ENGLISH MARKET:
🎯 Progress to goal: X/10 pre-orders  
💰 Revenue: $XXX

🇪🇪 EESTI TURG:
🎯 Eesmärgi progress: X/10 eeltellimust
💰 Tulu: $XXX

📈 ОБЩАЯ СТАТИСТИКА:
💰 Общая выручка: $XXX
🎯 Всего предзаказов: X/30
🌍 Охват: 3 рынка

🤖 Автопостинг работает стабильно на всех языках`;

        await sendNotification(report);
    } catch (error) {
        console.error('❌ Ошибка создания многоязычного отчета:', error.message);
    }
}

// Экспорт функций
module.exports = {
    startMultilingualAutomation,
    scheduleMultilingualPosts,
    sendNotification
};

// Автоматический запуск при деплое на Railway
if (require.main === module) {
    console.log('🚀 Запуск многоязычного автопостинг бота на Railway...');
    
    if (!CONFIG.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN не установлен');
        return;
    }
    
    if (!CONFIG.NOTIFICATION_CHAT_ID) {
        console.error('❌ NOTIFICATION_CHAT_ID не установлен');
        return;
    }
    
    console.log('✅ Конфигурация проверена');
    console.log('🌍 Поддерживаемые языки: RU, EN, ET');
    
    setTimeout(() => {
        startMultilingualAutomation();
        console.log('🎯 Многоязычный автопостинг бот полностью запущен!');
    }, 5000);
} 