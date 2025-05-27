import { db } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';

// 📊 СИСТЕМА ОТСЛЕЖИВАНИЯ ИНТЕРВЬЮ

class InterviewTracker {
  constructor() {
    this.contactsCollection = collection(db, 'contacts');
    this.interviewsCollection = collection(db, 'interviews');
    this.metricsCollection = collection(db, 'daily_metrics');
    this.messagesCollection = collection(db, 'sent_messages');
  }

  // 📱 ДОБАВЛЕНИЕ КОНТАКТА
  async addContact(contactData) {
    try {
      const contact = {
        name: contactData.name,
        platform: contactData.platform, // 'telegram', 'linkedin', 'discord'
        username: contactData.username,
        role: contactData.role,
        experience: contactData.experience,
        company: contactData.company,
        technologies: contactData.technologies || [],
        status: 'found', // 'found', 'contacted', 'responded', 'interviewed'
        source: contactData.source, // группа/канал где нашли
        notes: contactData.notes || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.contactsCollection, contact);
      console.log('✅ Контакт добавлен:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Ошибка добавления контакта:', error);
      throw error;
    }
  }

  // 📤 ОТПРАВКА СООБЩЕНИЯ
  async sendMessage(contactId, messageData) {
    try {
      const message = {
        contactId: contactId,
        platform: messageData.platform,
        template: messageData.template, // 'direct', 'value', 'group'
        messageText: messageData.messageText,
        sentAt: serverTimestamp(),
        status: 'sent' // 'sent', 'delivered', 'read', 'responded'
      };

      // Добавляем сообщение
      const messageRef = await addDoc(this.messagesCollection, message);

      // Обновляем статус контакта
      await this.updateContactStatus(contactId, 'contacted');

      console.log('✅ Сообщение отправлено:', messageRef.id);
      return messageRef.id;
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения:', error);
      throw error;
    }
  }

  // 🎤 ЗАПИСЬ ИНТЕРВЬЮ
  async recordInterview(contactId, interviewData) {
    try {
      const interview = {
        contactId: contactId,
        date: interviewData.date,
        duration: interviewData.duration, // в минутах
        format: interviewData.format, // 'zoom', 'telegram', 'discord', 'written'
        
        // Ответы на основные вопросы
        answers: {
          role: interviewData.answers.role,
          experience: interviewData.answers.experience,
          teamSize: interviewData.answers.teamSize,
          presentationFrequency: interviewData.answers.presentationFrequency,
          presentationTypes: interviewData.answers.presentationTypes || [],
          audience: interviewData.answers.audience || [],
          challenges: interviewData.answers.challenges || [],
          importantSkills: interviewData.answers.importantSkills || [],
          communicationProblems: interviewData.answers.communicationProblems || [],
          learningExperience: interviewData.answers.learningExperience,
          willingToPay: interviewData.answers.willingToPay,
          priceRange: interviewData.answers.priceRange,
          preferredFormat: interviewData.answers.preferredFormat
        },

        // Анализ
        keyInsights: interviewData.keyInsights || [],
        painPoints: interviewData.painPoints || [],
        quotes: interviewData.quotes || [],
        
        // Оценка качества интервью
        quality: interviewData.quality, // 'excellent', 'good', 'average', 'poor'
        followUpNeeded: interviewData.followUpNeeded || false,
        
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(this.interviewsCollection, interview);
      
      // Обновляем статус контакта
      await this.updateContactStatus(contactId, 'interviewed');

      console.log('✅ Интервью записано:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Ошибка записи интервью:', error);
      throw error;
    }
  }

  // 📊 ЕЖЕДНЕВНЫЕ МЕТРИКИ
  async recordDailyMetrics(date, metrics) {
    try {
      const dailyMetrics = {
        date: date,
        groupsFound: metrics.groupsFound || 0,
        contactsFound: metrics.contactsFound || 0,
        messagesSent: metrics.messagesSent || 0,
        responsesReceived: metrics.responsesReceived || 0,
        interviewsScheduled: metrics.interviewsScheduled || 0,
        interviewsCompleted: metrics.interviewsCompleted || 0,
        timeSpent: metrics.timeSpent || 0, // в минутах
        notes: metrics.notes || '',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(this.metricsCollection, dailyMetrics);
      console.log('✅ Метрики записаны:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Ошибка записи метрик:', error);
      throw error;
    }
  }

  // 🔄 ОБНОВЛЕНИЕ СТАТУСА КОНТАКТА
  async updateContactStatus(contactId, newStatus) {
    try {
      const contactRef = doc(db, 'contacts', contactId);
      await updateDoc(contactRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      console.log('✅ Статус обновлен:', contactId, '->', newStatus);
    } catch (error) {
      console.error('❌ Ошибка обновления статуса:', error);
      throw error;
    }
  }

  // 📈 ПОЛУЧЕНИЕ СТАТИСТИКИ
  async getStats() {
    try {
      // Статистика контактов
      const contactsSnapshot = await getDocs(this.contactsCollection);
      const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Статистика интервью
      const interviewsSnapshot = await getDocs(this.interviewsCollection);
      const interviews = interviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Статистика сообщений
      const messagesSnapshot = await getDocs(this.messagesCollection);
      const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const stats = {
        contacts: {
          total: contacts.length,
          byStatus: this.groupBy(contacts, 'status'),
          byPlatform: this.groupBy(contacts, 'platform')
        },
        interviews: {
          total: interviews.length,
          byQuality: this.groupBy(interviews, 'quality'),
          averageDuration: this.calculateAverage(interviews, 'duration')
        },
        messages: {
          total: messages.length,
          byPlatform: this.groupBy(messages, 'platform'),
          responseRate: this.calculateResponseRate(contacts, messages)
        },
        conversion: {
          contactToResponse: this.calculateConversion(contacts, 'responded'),
          contactToInterview: this.calculateConversion(contacts, 'interviewed')
        }
      };

      return stats;
    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error);
      throw error;
    }
  }

  // 🔍 АНАЛИЗ ИНТЕРВЬЮ
  async analyzeInterviews() {
    try {
      const interviewsSnapshot = await getDocs(this.interviewsCollection);
      const interviews = interviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const analysis = {
        commonPainPoints: this.extractCommonItems(interviews, 'painPoints'),
        popularSkills: this.extractCommonItems(interviews, 'answers.importantSkills'),
        pricePreferences: this.analyzePricing(interviews),
        formatPreferences: this.groupBy(interviews, 'answers.preferredFormat'),
        presentationFrequency: this.groupBy(interviews, 'answers.presentationFrequency'),
        segments: {
          byExperience: this.segmentByExperience(interviews),
          byRole: this.groupBy(interviews, 'answers.role')
        }
      };

      return analysis;
    } catch (error) {
      console.error('❌ Ошибка анализа интервью:', error);
      throw error;
    }
  }

  // 🛠️ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = this.getNestedValue(item, key) || 'unknown';
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  calculateAverage(array, key) {
    const values = array.map(item => this.getNestedValue(item, key)).filter(v => v);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  calculateConversion(contacts, targetStatus) {
    const total = contacts.length;
    const converted = contacts.filter(c => c.status === targetStatus).length;
    return total > 0 ? (converted / total * 100).toFixed(2) + '%' : '0%';
  }

  calculateResponseRate(contacts, messages) {
    const contacted = contacts.filter(c => c.status !== 'found').length;
    const responded = contacts.filter(c => ['responded', 'interviewed'].includes(c.status)).length;
    return contacted > 0 ? (responded / contacted * 100).toFixed(2) + '%' : '0%';
  }

  extractCommonItems(interviews, path) {
    const allItems = interviews.flatMap(interview => 
      this.getNestedValue(interview, path) || []
    );
    return this.groupBy(allItems.map(item => ({ [path]: item })), path);
  }

  analyzePricing(interviews) {
    const prices = interviews
      .map(i => i.answers?.priceRange)
      .filter(p => p && p !== 'not_willing');
    
    return {
      willingToPay: interviews.filter(i => i.answers?.willingToPay === true).length,
      notWilling: interviews.filter(i => i.answers?.willingToPay === false).length,
      priceRanges: this.groupBy(prices.map(p => ({ priceRange: p })), 'priceRange')
    };
  }

  segmentByExperience(interviews) {
    return {
      junior: interviews.filter(i => (i.answers?.experience || 0) < 3).length,
      middle: interviews.filter(i => {
        const exp = i.answers?.experience || 0;
        return exp >= 3 && exp < 7;
      }).length,
      senior: interviews.filter(i => (i.answers?.experience || 0) >= 7).length
    };
  }
}

// 🚀 ЭКСПОРТ
export default InterviewTracker;

// 📱 ПРИМЕР ИСПОЛЬЗОВАНИЯ
/*
const tracker = new InterviewTracker();

// Добавление контакта
await tracker.addContact({
  name: 'Иван Петров',
  platform: 'telegram',
  username: '@ivan_dev',
  role: 'Frontend Developer',
  experience: 5,
  company: 'Tech Corp',
  technologies: ['React', 'TypeScript'],
  source: '@frontend_ru'
});

// Отправка сообщения
await tracker.sendMessage(contactId, {
  platform: 'telegram',
  template: 'direct',
  messageText: 'Привет! Создаю курс...'
});

// Запись интервью
await tracker.recordInterview(contactId, {
  date: '2024-01-15',
  duration: 18,
  format: 'zoom',
  answers: {
    role: 'Frontend Developer',
    experience: 5,
    presentationFrequency: 'weekly',
    willingToPay: true,
    priceRange: '$49'
  },
  quality: 'excellent'
});

// Получение статистики
const stats = await tracker.getStats();
console.log(stats);
*/ 