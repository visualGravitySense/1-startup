# 🚀 ДЕПЛОЙ АВТОПОСТИНГ БОТА НА RAILWAY
## Запуск 24/7 автоматизации в облаке

### 🎯 ЦЕЛЬ: Развернуть бота на Railway за 10 минут

---

## 📋 ПОДГОТОВКА (5 минут)

### **1. Создайте Telegram бота (если еще не создали):**
1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Введите имя: `CodeTalk Promo Bot`
4. Введите username: `codetalk_promo_bot`
5. **Сохраните токен** (например: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### **2. Получите ваш Chat ID:**
1. Найдите @userinfobot в Telegram
2. Отправьте `/start`
3. **Сохраните ваш ID** (например: `123456789`)

---

## 🚂 ДЕПЛОЙ НА RAILWAY (5 минут)

### **Шаг 1: Создание проекта**
1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите **"New Project"**
4. Выберите **"Deploy from GitHub repo"**

### **Шаг 2: Подключение репозитория**
1. Создайте новый репозиторий на GitHub
2. Загрузите туда файлы:
   - `auto-posting-bot.js`
   - `package.json`
3. Выберите этот репозиторий в Railway

### **Шаг 3: Настройка переменных окружения**
В Railway Dashboard → Variables добавьте:

```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
NOTIFICATION_CHAT_ID=123456789
LANDING_URL=https://your-domain.com/landing.html
FREE_LESSON_URL=https://your-domain.com/free-lesson.html
```

### **Шаг 4: Деплой**
1. Railway автоматически развернет проект
2. Получите URL вашего сервиса
3. Проверьте статус: `https://your-app.railway.app/`

---

## ✅ ПРОВЕРКА РАБОТЫ

### **1. Проверьте статус бота:**
Откройте URL вашего Railway приложения, должно показать:
```json
{
  "status": "running",
  "bot": "CodeTalk AutoPosting Bot",
  "uptime": 123,
  "scheduledJobs": 5
}
```

### **2. Проверьте Telegram уведомления:**
В течение 1-2 минут должно прийти сообщение:
```
🤖 Автопостинг бот:
🚀 Автопостинг бот запущен! Система работает на автопилоте.
```

---

## 📅 РАСПИСАНИЕ РАБОТЫ

Бот автоматически публикует посты:
- **Понедельник 10:00** - LinkedIn пост
- **Вторник 9:00** - Telegram пост
- **Среда 11:00** - Telegram пост  
- **Четверг 14:00** - LinkedIn пост
- **Пятница 15:00** - Telegram пост

**Ежедневно в 18:00** - отчет о статистике

---

## 🔧 УПРАВЛЕНИЕ БОТОМ

### **Просмотр логов:**
1. Railway Dashboard → Deployments
2. Нажмите на последний деплой
3. Вкладка "Logs"

### **Перезапуск бота:**
1. Railway Dashboard → Settings
2. Нажмите "Redeploy"

### **Изменение расписания:**
1. Отредактируйте `auto-posting-bot.js`
2. Сделайте commit в GitHub
3. Railway автоматически обновит

---

## 💰 СТОИМОСТЬ

### **Railway тарифы:**
- **Hobby Plan**: $5/месяц
- **Pro Plan**: $20/месяц

### **Для автопостинг бота достаточно Hobby Plan:**
- 500 часов работы в месяц
- 1GB RAM
- 1GB диск

---

## 🚨 АЛЬТЕРНАТИВЫ RAILWAY

### **1. Heroku (бесплатно ограниченно):**
```bash
# Установка Heroku CLI
npm install -g heroku

# Деплой
heroku create codetalk-autobot
git push heroku main
heroku config:set TELEGRAM_BOT_TOKEN=your_token
```

### **2. Vercel (для простых ботов):**
```bash
npm install -g vercel
vercel --prod
```

### **3. DigitalOcean App Platform:**
- $5/месяц
- Аналогично Railway

---

## 📊 МОНИТОРИНГ

### **Проверка работы бота:**
1. **URL статуса:** `https://your-app.railway.app/`
2. **Health check:** `https://your-app.railway.app/health`
3. **Telegram уведомления** каждый день

### **Если бот не работает:**
1. Проверьте логи в Railway
2. Убедитесь, что переменные окружения установлены
3. Проверьте токен бота в @BotFather

---

## 🎯 РЕЗУЛЬТАТ

**После деплоя у вас будет:**
- ✅ Бот работает 24/7 в облаке
- ✅ Автоматические посты 5 раз в неделю
- ✅ Уведомления в Telegram
- ✅ Ежедневные отчеты
- ✅ 2-3 предзаказа в день без участия

**Цель 10 предзаказов достигается за 3-5 дней! 🚀**

---

## 📞 ПОДДЕРЖКА

**Если что-то не работает:**
1. Проверьте логи в Railway Dashboard
2. Убедитесь, что все переменные окружения установлены
3. Проверьте токен бота через @BotFather
4. Перезапустите деплой в Railway

**Удачи с автоматизацией в облаке! ☁️🤖** 