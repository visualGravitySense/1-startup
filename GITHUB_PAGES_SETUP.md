# 🚀 Публикация на GitHub Pages

## 📋 Пошаговая инструкция

### Шаг 1: Создание репозитория на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository" (зеленая кнопка)
3. Заполните данные:
   - **Repository name:** `code-to-business-landing`
   - **Description:** `Landing page for "How to Explain Code to Business" course`
   - **Public** (обязательно для бесплатного GitHub Pages)
   - ✅ Add a README file
4. Нажмите "Create repository"

### Шаг 2: Загрузка файлов

Выполните команды в PowerShell в папке проекта:

```powershell
# Инициализация Git репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Landing page for code-to-business course"

# Подключение к GitHub (замените YOUR_USERNAME на ваш логин)
git remote add origin https://github.com/YOUR_USERNAME/code-to-business-landing.git

# Отправка на GitHub
git branch -M main
git push -u origin main
```

### Шаг 3: Настройка GitHub Pages

1. В вашем репозитории на GitHub зайдите в **Settings**
2. Прокрутите до раздела **Pages** (в левом меню)
3. В разделе **Source** выберите:
   - **Deploy from a branch**
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Нажмите **Save**

### Шаг 4: Получение ссылки

Через 2-3 минуты ваш сайт будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/code-to-business-landing/
```

## 🔗 Структура ссылок

После публикации у вас будут следующие страницы:

- **Главная (лендинг):** `https://YOUR_USERNAME.github.io/code-to-business-landing/`
- **Бесплатный урок:** `https://YOUR_USERNAME.github.io/code-to-business-landing/free-lesson.html`
- **Дашборд:** `https://YOUR_USERNAME.github.io/code-to-business-landing/preorders-dashboard.html`

## ✅ Проверка работоспособности

После деплоя проверьте:

1. **Лендинг открывается** и выглядит корректно
2. **Форма предзаказа работает** (отправляет данные в Firebase)
3. **Бесплатный урок** открывается и интерактивен
4. **Дашборд** показывает статистику предзаказов
5. **Мобильная версия** работает корректно

## 🎯 Готовые команды для копирования

Замените `YOUR_USERNAME` на ваш GitHub логин:

```powershell
# Перейти в папку проекта
cd "C:\Users\Dmitri\Documents\Development\1-startup"

# Инициализация и загрузка
git init
git add .
git commit -m "Initial commit: Landing page for code-to-business course"
git remote add origin https://github.com/YOUR_USERNAME/code-to-business-landing.git
git branch -M main
git push -u origin main
```

## 🚀 Преимущества GitHub Pages

✅ **Бесплатно** - навсегда
✅ **Быстро** - 5 минут настройки
✅ **Надежно** - инфраструктура GitHub
✅ **SSL** - автоматический HTTPS
✅ **CDN** - быстрая загрузка по всему миру
✅ **Кастомный домен** - можно подключить позже

## 📈 Следующие шаги

1. **Опубликовать проект** (сегодня)
2. **Протестировать все функции** 
3. **Начать продвижение** с GitHub Pages ссылкой
4. **При успехе** - купить домен и подключить к GitHub Pages

## 🔧 Обновление сайта

Для обновления сайта в будущем:

```powershell
git add .
git commit -m "Update: описание изменений"
git push
```

Изменения появятся на сайте через 1-2 минуты.

## 💡 Советы

- **Тестируйте локально** перед загрузкой: `npm start`
- **Проверяйте на мобильных** устройствах
- **Следите за статистикой** в дашборде предзаказов
- **Делайте бэкапы** важных изменений

**Готово! Теперь у вас есть профессиональный лендинг на бесплатном хостинге! 🎉** 