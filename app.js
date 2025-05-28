import InterviewTracker from './interview-tracker.js';

// 🚀 ГЛАВНОЕ ПРИЛОЖЕНИЕ
class App {
  constructor() {
    this.tracker = new InterviewTracker();
    this.currentTab = 'dashboard';
    this.init();
  }

  async init() {
    console.log('🚀 Инициализация приложения...');
    
    // Устанавливаем сегодняшнюю дату по умолчанию
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('interviewDate').value = today;
    document.getElementById('metricsDate').value = today;

    // Привязываем обработчики событий
    this.bindEvents();
    
    // Загружаем данные
    await this.loadDashboard();
    await this.loadContacts();
    await this.loadContactsForInterview();
  }

  bindEvents() {
    // Форма добавления контакта
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addContact();
    });

    // Форма записи интервью
    document.getElementById('interviewForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.recordInterview();
    });

    // Форма метрик
    document.getElementById('metricsForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.recordMetrics();
    });
  }

  // 📊 ЗАГРУЗКА ДАШБОРДА
  async loadDashboard() {
    try {
      const stats = await this.tracker.getStats();
      
      document.getElementById('totalContacts').textContent = stats.contacts.total;
      document.getElementById('totalInterviews').textContent = stats.interviews.total;
      document.getElementById('responseRate').textContent = stats.messages.responseRate;
      document.getElementById('conversionRate').textContent = stats.conversion.contactToInterview;

      // Показываем последние действия
      this.showRecentActivity(stats);
    } catch (error) {
      console.error('❌ Ошибка загрузки дашборда:', error);
      this.showError('Ошибка загрузки данных дашборда');
    }
  }

  showRecentActivity(stats) {
    const container = document.getElementById('recentActivity');
    
    if (stats.contacts.total === 0) {
      container.innerHTML = '<p style="text-align: center; color: #6c757d;">Пока нет данных. Добавьте первый контакт!</p>';
      return;
    }

    let html = '<h4>📈 Статистика по статусам:</h4>';
    
    Object.entries(stats.contacts.byStatus).forEach(([status, count]) => {
      const statusText = {
        'found': 'Найдено',
        'contacted': 'Связались',
        'responded': 'Ответили',
        'interviewed': 'Интервью проведено'
      };
      
      html += `
        <div class="contact-item">
          <div class="contact-info">
            <h4>${statusText[status] || status}</h4>
            <p>${count} контактов</p>
          </div>
          <span class="status-badge status-${status}">${count}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // 👥 ДОБАВЛЕНИЕ КОНТАКТА
  async addContact() {
    try {
      const contactData = {
        name: document.getElementById('contactName').value,
        platform: document.getElementById('contactPlatform').value,
        username: document.getElementById('contactUsername').value,
        role: document.getElementById('contactRole').value,
        experience: parseInt(document.getElementById('contactExperience').value) || 0,
        company: document.getElementById('contactCompany').value,
        source: document.getElementById('contactSource').value,
        notes: document.getElementById('contactNotes').value,
        technologies: [] // Можно добавить поле для технологий
      };

      const contactId = await this.tracker.addContact(contactData);
      
      this.showSuccess('✅ Контакт успешно добавлен!');
      document.getElementById('contactForm').reset();
      
      // Обновляем списки
      await this.loadContacts();
      await this.loadContactsForInterview();
      await this.loadDashboard();
      
    } catch (error) {
      console.error('❌ Ошибка добавления контакта:', error);
      this.showError('Ошибка добавления контакта');
    }
  }

  // 📋 ЗАГРУЗКА СПИСКА КОНТАКТОВ
  async loadContacts() {
    try {
      const stats = await this.tracker.getStats();
      const container = document.getElementById('contactsList');
      
      if (stats.contacts.total === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d;">Контакты не найдены</p>';
        return;
      }

      // Получаем полный список контактов (упрощенная версия)
      // В реальном приложении нужно добавить метод getContacts() в tracker
      container.innerHTML = '<div class="loading">Загрузка контактов...</div>';
      
      // Показываем статистику по контактам
      let html = '';
      Object.entries(stats.contacts.byStatus).forEach(([status, count]) => {
        const statusText = {
          'found': 'Найдено',
          'contacted': 'Связались', 
          'responded': 'Ответили',
          'interviewed': 'Интервью проведено'
        };
        
        html += `
          <div class="contact-item">
            <div class="contact-info">
              <h4>${statusText[status] || status}</h4>
              <p>${count} контактов в этом статусе</p>
            </div>
            <span class="status-badge status-${status}">${status}</span>
          </div>
        `;
      });
      
      container.innerHTML = html;
      
    } catch (error) {
      console.error('❌ Ошибка загрузки контактов:', error);
      document.getElementById('contactsList').innerHTML = '<p style="color: red;">Ошибка загрузки контактов</p>';
    }
  }

  // 🎤 ЗАГРУЗКА КОНТАКТОВ ДЛЯ ИНТЕРВЬЮ
  async loadContactsForInterview() {
    try {
      // В реальном приложении здесь должен быть запрос к Firebase
      // Пока оставляем заглушку
      const select = document.getElementById('interviewContact');
      select.innerHTML = '<option value="">Выберите контакт</option>';
      
      // Добавим несколько примеров для демонстрации
      const exampleContacts = [
        { id: 'example1', name: 'Иван Петров (@ivan_dev)' },
        { id: 'example2', name: 'Мария Сидорова (LinkedIn)' },
        { id: 'example3', name: 'Алексей Козлов (Discord)' }
      ];
      
      exampleContacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.id;
        option.textContent = contact.name;
        select.appendChild(option);
      });
      
    } catch (error) {
      console.error('❌ Ошибка загрузки контактов для интервью:', error);
    }
  }

  // 🎤 ЗАПИСЬ ИНТЕРВЬЮ
  async recordInterview() {
    try {
      const contactId = document.getElementById('interviewContact').value;
      
      if (!contactId) {
        this.showError('Выберите контакт для интервью');
        return;
      }

      const interviewData = {
        date: document.getElementById('interviewDate').value,
        duration: parseInt(document.getElementById('interviewDuration').value) || 15,
        format: document.getElementById('interviewFormat').value,
        answers: {
          presentationFrequency: document.getElementById('presentationFreq').value,
          willingToPay: document.getElementById('willingToPay').value === 'true',
          priceRange: document.getElementById('priceRange').value,
          preferredFormat: 'online' // можно добавить поле
        },
        keyInsights: document.getElementById('keyInsights').value.split(',').map(s => s.trim()).filter(s => s),
        painPoints: document.getElementById('painPoints').value.split(',').map(s => s.trim()).filter(s => s),
        quotes: document.getElementById('quotes').value.split('\n').filter(s => s.trim()),
        quality: document.getElementById('interviewQuality').value
      };

      const interviewId = await this.tracker.recordInterview(contactId, interviewData);
      
      this.showSuccess('✅ Интервью успешно записано!');
      document.getElementById('interviewForm').reset();
      
      // Обновляем дашборд
      await this.loadDashboard();
      
    } catch (error) {
      console.error('❌ Ошибка записи интервью:', error);
      this.showError('Ошибка записи интервью');
    }
  }

  // 📊 ЗАПИСЬ МЕТРИК
  async recordMetrics() {
    try {
      const date = document.getElementById('metricsDate').value;
      
      const metrics = {
        groupsFound: parseInt(document.getElementById('groupsFound').value) || 0,
        contactsFound: parseInt(document.getElementById('contactsFound').value) || 0,
        messagesSent: parseInt(document.getElementById('messagesSent').value) || 0,
        responsesReceived: parseInt(document.getElementById('responsesReceived').value) || 0,
        interviewsScheduled: parseInt(document.getElementById('interviewsScheduled').value) || 0,
        interviewsCompleted: parseInt(document.getElementById('interviewsCompleted').value) || 0,
        timeSpent: parseInt(document.getElementById('timeSpent').value) || 0,
        notes: document.getElementById('metricsNotes').value
      };

      const metricsId = await this.tracker.recordDailyMetrics(date, metrics);
      
      this.showSuccess('✅ Метрики успешно сохранены!');
      document.getElementById('metricsForm').reset();
      
      // Устанавливаем завтрашнюю дату
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('metricsDate').value = tomorrow.toISOString().split('T')[0];
      
    } catch (error) {
      console.error('❌ Ошибка записи метрик:', error);
      this.showError('Ошибка записи метрик');
    }
  }

  // 🎨 ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    // Удаляем предыдущие сообщения
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Создаем новое сообщение
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Вставляем в начало активной вкладки
    const activeTab = document.querySelector('.tab-content.active');
    activeTab.insertBefore(messageDiv, activeTab.firstChild);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// 🔄 ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
window.showTab = function(tabName) {
  // Скрываем все вкладки
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Убираем активный класс с кнопок
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Показываем выбранную вкладку
  document.getElementById(tabName).classList.add('active');
  
  // Активируем соответствующую кнопку
  event.target.classList.add('active');
};

// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// 📱 ЭКСПОРТ ДЛЯ ОТЛАДКИ
export default App;

// Простой Express сервер для Firebase Dashboard
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Главная страница - Firebase Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'firebase-dashboard.html'));
});

// API для получения информации о проекте
app.get('/api/project-info', (req, res) => {
    res.json({
        name: 'Startup Firebase Manager',
        description: 'Система управления данными стартапа "Soft Skills for Tech Professionals"',
        version: '1.0.0',
        collections: [
            'interviews',
            'product_concepts', 
            'mvp_modules',
            'blog_posts',
            'daily_metrics'
        ],
        status: 'ready'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Firebase Dashboard запущен на http://localhost:${PORT}`);
    console.log(`📊 Откройте браузер и перейдите по ссылке выше`);
    console.log(`🔥 Настройте Firebase конфигурацию в интерфейсе`);
});

module.exports = app; 