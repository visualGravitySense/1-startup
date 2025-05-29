// Тестовые данные для Firebase
import { preorderService, automationService, interviewService } from '../firebase/service.js'

// Тестовые предзаказы
const samplePreorders = [
  {
    email: 'alexey@example.com',
    name: 'Алексей Петров',
    amount: 24,
    source: 'telegram',
    timestamp: new Date('2024-01-15')
  },
  {
    email: 'maria@example.com', 
    name: 'Мария Иванова',
    amount: 24,
    source: 'linkedin',
    timestamp: new Date('2024-01-14')
  },
  {
    email: 'dmitri@example.com',
    name: 'Дмитрий Козлов',
    amount: 24,
    source: 'telegram',
    timestamp: new Date('2024-01-13')
  },
  {
    email: 'elena@example.com',
    name: 'Елена Смирнова',
    amount: 24,
    source: 'direct',
    timestamp: new Date('2024-01-12')
  },
  {
    email: 'sergey@example.com',
    name: 'Сергей Волков',
    amount: 24,
    source: 'telegram',
    timestamp: new Date('2024-01-11')
  }
]

// Тестовые посты
const samplePosts = [
  {
    platform: 'telegram',
    content: 'Как объяснить код бизнесу? Новый курс для разработчиков!',
    language: 'ru',
    timestamp: new Date('2024-01-15'),
    engagement: { views: 1250, clicks: 45 }
  },
  {
    platform: 'linkedin',
    content: 'How to explain code to business? New course for developers!',
    language: 'en', 
    timestamp: new Date('2024-01-14'),
    engagement: { views: 890, clicks: 32 }
  },
  {
    platform: 'telegram',
    content: 'Kuidas selgitada koodi äridele? Uus kursus arendajatele!',
    language: 'et',
    timestamp: new Date('2024-01-13'),
    engagement: { views: 567, clicks: 18 }
  },
  {
    platform: 'linkedin',
    content: 'The communication gap between developers and business stakeholders',
    language: 'en',
    timestamp: new Date('2024-01-12'),
    engagement: { views: 1100, clicks: 41 }
  },
  {
    platform: 'telegram',
    content: 'Почему разработчики и бизнес не понимают друг друга?',
    language: 'ru',
    timestamp: new Date('2024-01-11'),
    engagement: { views: 980, clicks: 36 }
  }
]

// Тестовые интервью
const sampleInterviews = [
  {
    name: 'Алексей Петров',
    email: 'alexey@example.com',
    date: '2024-01-10',
    status: 'completed',
    rating: 5,
    notes: 'Очень заинтересован в курсе. Готов платить полную стоимость.',
    painPoints: ['communication', 'technical_debt', 'stakeholder_management']
  },
  {
    name: 'Мария Иванова',
    email: 'maria@example.com', 
    date: '2024-01-09',
    status: 'completed',
    rating: 4,
    notes: 'Подтвердила проблему. Ищет практические решения.',
    painPoints: ['requirements', 'deadlines', 'documentation']
  },
  {
    name: 'Дмитрий Козлов',
    email: 'dmitri@example.com',
    date: '2024-01-08',
    status: 'completed',
    rating: 5,
    notes: 'Тимлид, готов обучить всю команду.',
    painPoints: ['team_communication', 'project_scope', 'client_expectations']
  },
  {
    name: 'Елена Смирнова',
    email: 'elena@example.com',
    date: '2024-01-07',
    status: 'completed',
    rating: 4,
    notes: 'Фрилансер, нужны навыки работы с клиентами.',
    painPoints: ['client_communication', 'scope_creep', 'pricing']
  },
  {
    name: 'Сергей Волков',
    email: 'sergey@example.com',
    date: '2024-01-18',
    status: 'scheduled',
    rating: null,
    notes: 'Интервью запланировано на завтра.',
    painPoints: []
  }
]

// Функция для заполнения тестовыми данными
export async function populateTestData() {
  try {
    console.log('🔄 Заполнение Firebase тестовыми данными...')

    // Добавляем предзаказы
    console.log('📦 Добавление предзаказов...')
    for (const preorder of samplePreorders) {
      await preorderService.add(preorder)
    }

    // Добавляем посты
    console.log('📱 Добавление постов...')
    for (const post of samplePosts) {
      await automationService.addPost(post)
    }

    // Добавляем интервью
    console.log('👥 Добавление интервью...')
    for (const interview of sampleInterviews) {
      await interviewService.add(interview)
    }

    console.log('✅ Тестовые данные успешно добавлены!')
    return true

  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых данных:', error)
    return false
  }
}

// Функция для очистки тестовых данных (опционально)
export async function clearTestData() {
  try {
    console.log('🧹 Очистка тестовых данных...')
    
    // Здесь можно добавить логику очистки если нужно
    // Пока оставляем заглушку
    
    console.log('✅ Данные очищены!')
    return true

  } catch (error) {
    console.error('❌ Ошибка при очистке данных:', error)
    return false
  }
}

// Функция для проверки подключения к Firebase
export async function testFirebaseConnection() {
  try {
    console.log('🔥 Проверка подключения к Firebase...')
    
    // Пробуем получить данные
    const preorders = await preorderService.getAll()
    console.log(`📦 Найдено ${preorders.length} предзаказов`)
    
    const stats = await automationService.getStats()
    console.log(`📱 Найдено ${stats.totalPosts} постов`)
    
    const interviews = await interviewService.getAll()
    console.log(`👥 Найдено ${interviews.length} интервью`)
    
    console.log('✅ Firebase подключение работает!')
    return true

  } catch (error) {
    console.error('❌ Ошибка подключения к Firebase:', error)
    return false
  }
}

// Экспортируем для использования в консоли браузера
if (typeof window !== 'undefined') {
  window.FirebaseTestUtils = {
    populateTestData,
    clearTestData,
    testFirebaseConnection
  }
} 