# 📊 Interview Tracker - Автоматизация исследования

Система автоматизации для отслеживания интервью в нише **"Soft Skills for Tech Professionals"**.

## 🚀 Что это?

Веб-приложение для структурированного сбора и анализа данных интервью с программистами. Помогает:

- ✅ Отслеживать контакты и их статусы
- ✅ Записывать результаты интервью
- ✅ Анализировать метрики и конверсии
- ✅ Собирать инсайты для создания MVP

## 🛠️ Технологии

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase Firestore
- **Аналитика**: Firebase Analytics
- **Хостинг**: Firebase Hosting (опционально)

## 📦 Установка

### 1. Клонирование проекта
```bash
git clone <repository-url>
cd interview-tracker
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка Firebase

1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Создайте новый проект или используйте существующий
3. Включите **Firestore Database**
4. Включите **Analytics** (опционально)
5. Скопируйте конфигурацию в `firebase-config.js`

### 4. Запуск приложения
```bash
npm start
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 📋 Структура данных Firebase

### Коллекции:

#### `contacts` - Контакты
```javascript
{
  name: "Иван Петров",
  platform: "telegram", // telegram, linkedin, discord
  username: "@ivan_dev",
  role: "Frontend Developer",
  experience: 5,
  company: "Tech Corp",
  technologies: ["React", "TypeScript"],
  status: "found", // found, contacted, responded, interviewed
  source: "@frontend_ru",
  notes: "Активный участник сообщества",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `interviews` - Интервью
```javascript
{
  contactId: "contact_id",
  date: "2024-01-15",
  duration: 18,
  format: "zoom",
  answers: {
    role: "Frontend Developer",
    experience: 5,
    presentationFrequency: "weekly",
    willingToPay: true,
    priceRange: "$49"
  },
  keyInsights: ["Нужны шаблоны", "Сложно объяснять техническое"],
  painPoints: ["Страх выступлений", "Нет структуры"],
  quotes: ["Презентации - это боль"],
  quality: "excellent",
  createdAt: timestamp
}
```

#### `daily_metrics` - Ежедневные метрики
```javascript
{
  date: "2024-01-15",
  groupsFound: 5,
  contactsFound: 8,
  messagesSent: 10,
  responsesReceived: 3,
  interviewsScheduled: 2,
  interviewsCompleted: 1,
  timeSpent: 45,
  notes: "Хороший день",
  createdAt: timestamp
}
```

#### `sent_messages` - Отправленные сообщения
```javascript
{
  contactId: "contact_id",
  platform: "telegram",
  template: "direct",
  messageText: "Привет! Создаю курс...",
  sentAt: timestamp,
  status: "sent" // sent, delivered, read, responded
}
```

## 🎯 Использование

- **Modern design** with gradients and animations
- **Fully responsive layout** for all devices
- **Interactive elements** and smooth transitions
- **Counter animations** for planned metrics
- **Dark theme** with toggle
- **SEO-optimized** structure
- **Accessibility-friendly** design
- **Future-oriented** - everything in plans and intentions

## 📁 Project Structure

```
├── index.html                 # Main page
├── assets/
│   ├── css/
│   │   └── style.css         # Additional styles
│   └── js/
│       └── portfolio.js      # Interactivity
├── research/                 # Research folder
├── product-owner-portfolio.md # Original project plan
├── research-plan.md          # Research plan
└── README.md                 # This file
```

## 🎯 Main Sections

### 1. Hero Section
- Compelling headline about planned project
- Planned key metrics
- Animated counters

### 2. Planned Project
- Future role and responsibilities
- Description of planned product
- Timeline
- Expected results

### 3. Planned Product Owner Competencies
- Market research and data analysis
- User research and personas
- Product vision and strategy
- Feature prioritization
- Stakeholder management
- Product validation

### 4. Planned Development Process
- Timeline with key stages
- Month 1: Research & Discovery
- Month 2: Strategy & Planning
- Month 3: Validation & Pitch

### 5. Planned Results
- Expected quantitative indicators
- Visualization of planned achievements
- Animated metrics

## 🛠 Technologies

- **HTML5** - semantic markup
- **CSS3** - modern styles with Grid and Flexbox
- **JavaScript ES6+** - interactivity
- **Font Awesome** - icons
- **Google Fonts** - typography (Inter)

## 📱 Responsiveness

Portfolio is fully adapted for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥 Large screens (1200px+)

## ⚡ Performance

- Optimized images
- Minimal external dependencies
- Lazy loading for animations
- Debounced scroll events
- CSS animations instead of JavaScript

## 🎨 Color Scheme

```css
Primary blue: #2563EB
Accent orange: #F59E0B
Dark gray: #1F2937
Light gray: #6B7280
Background: #F9FAFB
```

## 🚀 Project Launch

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd product-owner-portfolio
   ```

2. **Open index.html in browser:**
   - Double click on file
   - Or via Live Server in VS Code
   - Or via local server

3. **For development (optional):**
   ```bash
   # Install Live Server globally
   npm install -g live-server
   
   # Start local server
   live-server
   ```

## 📝 Customization

### Content Changes
Edit `index.html` to change:
- Texts and descriptions
- Metrics and numbers
- Links and contacts

### Style Changes
Edit CSS variables in `index.html` or `assets/css/style.css`:
```css
:root {
    --primary-color: #2563EB;
    --accent-color: #F59E0B;
    --text-color: #1F2937;
}
```

### Adding New Sections
1. Add HTML markup
2. Add corresponding styles
3. Update navigation
4. Add animations if needed

## 🔧 Additional Features

### Dark Theme
- Automatic switching
- Preferences saved in localStorage
- Smooth transitions between themes

### Modal Windows
- Ready modal window system
- Keyboard navigation (ESC to close)
- Backdrop blur effect

### Animations
- Intersection Observer API for scroll animations
- CSS transitions and keyframes
- Staggered animations for grid elements

## 📊 SEO & Accessibility

### SEO Optimization
- Semantic HTML markup
- Meta tags for social networks
- Structured data (can be added)
- Optimized headings

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Screen reader friendly
- High contrast mode support

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 11 (limited support)

## 📈 Metrics to Track

Recommended to add Google Analytics for tracking:
- Time on page
- Scroll depth
- CTA button clicks
- Contact conversion

## 🔄 Updates & Support

### Planned Improvements
- [ ] Adding blog section
- [ ] CMS integration
- [ ] Multi-language support
- [ ] PWA functionality
- [ ] Google Analytics integration

### Known Limitations
- Static content (requires manual updates)
- No backend integration
- Limited customization without code knowledge

## 📞 Support

If you have questions or suggestions for portfolio improvement:

1. Create an Issue in the repository
2. Send a Pull Request with improvements
3. Contact directly through portfolio contacts

## 📄 License

This project is distributed under the MIT license. You can freely use, modify and distribute the code.

---

**Created with ❤️ to demonstrate Product Owner skills** 