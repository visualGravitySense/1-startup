import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider,
} from '@mui/material'
import {
  People,
  PersonAdd,
  Assignment,
  Analytics,
  CheckCircle,
  Schedule,
  Phone,
  VideoCall,
  Message,
  Business,
  Work,
  Star,
  TrendingUp,
  TrendingDown,
  Refresh,
  Add,
  Edit,
  Delete,
  AttachMoney,
  AccessTime,
  Group,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useInterviews } from '../hooks/useFirebase.js'

// Компонент для статистической карточки
function StatCard({ title, value, change, changeType, icon, color = 'primary' }) {
  const isPositive = changeType === 'positive' || change > 0
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                <Typography variant="body2" color={isPositive ? "success.main" : "error.main"}>
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  vs прошлый период
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

// Компонент дашборда интервью
function InterviewDashboard({ interviews, stats, loading }) {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка данных...</Typography>
      </Box>
    )
  }

  // Группировка интервью по статусам
  const interviewsByStatus = interviews.reduce((acc, interview) => {
    const status = interview.status || 'scheduled'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const statusLabels = {
    scheduled: 'Запланировано',
    completed: 'Завершено',
    cancelled: 'Отменено'
  }

  const recentInterviews = interviews.slice(0, 5)

  return (
    <Box>
      {/* Статистические карточки */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Всего интервью"
            value={stats.total || 0}
            change={12.5}
            changeType="positive"
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Завершено"
            value={stats.completed || 0}
            change={8.3}
            changeType="positive"
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Средняя оценка"
            value={`${stats.avgRating || 0}/5`}
            change={5.2}
            changeType="positive"
            icon={<Star />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Процент ответов"
            value="67%"
            change={-2.1}
            changeType="negative"
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Статистика по статусам */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Распределение по статусам
              </Typography>
              
              {Object.keys(statusLabels).length === 0 ? (
                <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                  Нет данных для отображения
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {Object.entries(statusLabels).map(([status, label]) => {
                    const count = interviewsByStatus[status] || 0
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                    
                    return (
                      <Box key={status} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{label}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {count} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Последние интервью */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Последние интервью
              </Typography>
              
              {recentInterviews.length === 0 ? (
                <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                  Интервью не найдены. Добавьте первое интервью!
                </Typography>
              ) : (
                <List>
                  {recentInterviews.map((interview, index) => (
                    <ListItem key={interview.id || index} divider={index < recentInterviews.length - 1}>
                      <ListItemIcon>
                        {interview.format === 'zoom' ? <VideoCall /> : 
                         interview.format === 'telegram' ? <Message /> : <Phone />}
                      </ListItemIcon>
                      <ListItemText
                        primary={interview.contactName || `Интервью #${index + 1}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {interview.date} • {interview.duration || 30} мин
                            </Typography>
                            <Chip 
                              size="small" 
                              label={statusLabels[interview.status] || interview.status}
                              color={interview.status === 'completed' ? 'success' : 'default'}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// Компонент управления контактами (упрощенная версия, так как основной функционал в интервью)
function ContactsManager() {
  const [contactName, setContactName] = useState('')
  const [platform, setPlatform] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [experience, setExperience] = useState('')
  const [source, setSource] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // В реальном приложении здесь был бы вызов Firebase
    console.log('Contact data:', {
      contactName, platform, username, role, company, experience, source, notes
    })
    
    // Сброс формы
    setContactName('')
    setPlatform('')
    setUsername('')
    setRole('')
    setCompany('')
    setExperience('')
    setSource('')
    setNotes('')
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          👤 Добавить новый контакт
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Имя"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Платформа</InputLabel>
                <Select
                  value={platform}
                  label="Платформа"
                  onChange={(e) => setPlatform(e.target.value)}
                  required
                >
                  <MenuItem value="telegram">Telegram</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="discord">Discord</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Роль"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Frontend Developer"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Компания"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Опыт (лет)"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                inputProps={{ min: 0, max: 30 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Источник"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="@frontend_ru"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заметки"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<PersonAdd />}>
                Добавить контакт
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Список контактов (заглушка) */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Список контактов
          </Typography>
          <Typography color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
            Функция в разработке. Пока что контакты управляются через Firebase console.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

// Компонент записи интервью
function InterviewRecorder({ addInterview, refresh }) {
  const [formData, setFormData] = useState({
    contactName: '',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    format: 'zoom',
    presentationFreq: '',
    willingToPay: '',
    priceRange: '',
    keyInsights: '',
    painPoints: '',
    quotes: '',
    quality: 'good'
  })
  
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const interviewData = {
        contactName: formData.contactName,
        date: formData.date,
        duration: parseInt(formData.duration),
        format: formData.format,
        status: 'completed',
        answers: {
          presentationFrequency: formData.presentationFreq,
          willingToPay: formData.willingToPay === 'true',
          priceRange: formData.priceRange
        },
        keyInsights: formData.keyInsights.split(',').map(s => s.trim()).filter(s => s),
        painPoints: formData.painPoints.split(',').map(s => s.trim()).filter(s => s),
        quotes: formData.quotes.split('\n').filter(s => s.trim()),
        quality: formData.quality,
        rating: formData.quality === 'excellent' ? 5 : 
                formData.quality === 'good' ? 4 : 
                formData.quality === 'average' ? 3 : 2
      }

      await addInterview(interviewData)
      
      setSnackbar({ 
        open: true, 
        message: '✅ Интервью успешно записано!', 
        severity: 'success' 
      })
      
      // Сброс формы
      setFormData({
        contactName: '',
        date: new Date().toISOString().split('T')[0],
        duration: 30,
        format: 'zoom',
        presentationFreq: '',
        willingToPay: '',
        priceRange: '',
        keyInsights: '',
        painPoints: '',
        quotes: '',
        quality: 'good'
      })
      
      // Обновляем данные
      await refresh()
      
    } catch (error) {
      console.error('Error recording interview:', error)
      setSnackbar({ 
        open: true, 
        message: '❌ Ошибка записи интервью', 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎤 Запись нового интервью
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Имя собеседника"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата интервью"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Длительность (минут)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                inputProps={{ min: 1, max: 120 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Формат</InputLabel>
                <Select
                  value={formData.format}
                  label="Формат"
                  onChange={(e) => handleChange('format', e.target.value)}
                >
                  <MenuItem value="zoom">Zoom</MenuItem>
                  <MenuItem value="telegram">Telegram</MenuItem>
                  <MenuItem value="discord">Discord</MenuItem>
                  <MenuItem value="written">Письменно</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            📋 Ответы на ключевые вопросы
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Частота презентаций</InputLabel>
                <Select
                  value={formData.presentationFreq}
                  label="Частота презентаций"
                  onChange={(e) => handleChange('presentationFreq', e.target.value)}
                >
                  <MenuItem value="never">Никогда</MenuItem>
                  <MenuItem value="rarely">Редко</MenuItem>
                  <MenuItem value="monthly">Раз в месяц</MenuItem>
                  <MenuItem value="weekly">Еженедельно</MenuItem>
                  <MenuItem value="daily">Ежедневно</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Готовность платить</InputLabel>
                <Select
                  value={formData.willingToPay}
                  label="Готовность платить"
                  onChange={(e) => handleChange('willingToPay', e.target.value)}
                >
                  <MenuItem value="true">Да</MenuItem>
                  <MenuItem value="false">Нет</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ценовой диапазон"
                value={formData.priceRange}
                onChange={(e) => handleChange('priceRange', e.target.value)}
                placeholder="$20-50"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Качество интервью</InputLabel>
                <Select
                  value={formData.quality}
                  label="Качество интервью"
                  onChange={(e) => handleChange('quality', e.target.value)}
                >
                  <MenuItem value="excellent">Отлично</MenuItem>
                  <MenuItem value="good">Хорошо</MenuItem>
                  <MenuItem value="average">Средне</MenuItem>
                  <MenuItem value="poor">Плохо</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ключевые инсайты (через запятую)"
                value={formData.keyInsights}
                onChange={(e) => handleChange('keyInsights', e.target.value)}
                placeholder="боится выступать, нужна структура, отсутствуют навыки"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Болевые точки (через запятую)"
                value={formData.painPoints}
                onChange={(e) => handleChange('painPoints', e.target.value)}
                placeholder="техническая речь, нет понимания аудитории, стресс"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Цитаты (каждая с новой строки)"
                multiline
                rows={3}
                value={formData.quotes}
                onChange={(e) => handleChange('quotes', e.target.value)}
                placeholder={`"Не знаю как объяснить менеджеру зачем нужен рефакторинг"\n"Всегда боюсь что меня не поймут"`}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={16} /> : <Assignment />}
                disabled={loading}
                size="large"
              >
                {loading ? 'Сохранение...' : 'Сохранить интервью'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Компонент дневных метрик
function DailyMetrics() {
  const [metricsData, setMetricsData] = useState({
    date: new Date().toISOString().split('T')[0],
    groupsFound: '',
    contactsFound: '',
    messagesSent: '',
    responsesReceived: '',
    interviewsScheduled: '',
    interviewsCompleted: '',
    timeSpent: '',
    notes: ''
  })

  const handleChange = (field, value) => {
    setMetricsData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Daily metrics:', metricsData)
    
    // Сброс формы и установка завтрашней даты
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setMetricsData({
      date: tomorrow.toISOString().split('T')[0],
      groupsFound: '',
      contactsFound: '',
      messagesSent: '',
      responsesReceived: '',
      interviewsScheduled: '',
      interviewsCompleted: '',
      timeSpent: '',
      notes: ''
    })
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📈 Дневные метрики
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата"
                type="date"
                value={metricsData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Найдено групп"
                type="number"
                value={metricsData.groupsFound}
                onChange={(e) => handleChange('groupsFound', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Найдено контактов"
                type="number"
                value={metricsData.contactsFound}
                onChange={(e) => handleChange('contactsFound', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Отправлено сообщений"
                type="number"
                value={metricsData.messagesSent}
                onChange={(e) => handleChange('messagesSent', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Получено ответов"
                type="number"
                value={metricsData.responsesReceived}
                onChange={(e) => handleChange('responsesReceived', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Запланировано интервью"
                type="number"
                value={metricsData.interviewsScheduled}
                onChange={(e) => handleChange('interviewsScheduled', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Проведено интервью"
                type="number"
                value={metricsData.interviewsCompleted}
                onChange={(e) => handleChange('interviewsCompleted', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Время потрачено (минут)"
                type="number"
                value={metricsData.timeSpent}
                onChange={(e) => handleChange('timeSpent', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заметки"
                multiline
                rows={3}
                value={metricsData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<Analytics />}>
                📈 Сохранить метрики
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

// Основной компонент Interviews
function Interviews() {
  const { interviews, stats, loading, error, addInterview, refresh } = useInterviews()
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки данных: {error}
        </Alert>
        <Button onClick={refresh} variant="contained" startIcon={<Refresh />}>
          Попробовать снова
        </Button>
      </Box>
    )
  }

  const tabsContent = [
    { label: '📈 Дашборд', icon: <Analytics /> },
    { label: '👥 Контакты', icon: <People /> },
    { label: '🎤 Интервью', icon: <Assignment /> },
    { label: '📊 Метрики', icon: <TrendingUp /> },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          📊 Interview CRM
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Система отслеживания интервью для ниши "Soft Skills for Tech Professionals"
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabsContent.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {tabValue === 0 && (
          <InterviewDashboard 
            interviews={interviews} 
            stats={stats} 
            loading={loading} 
          />
        )}
        
        {tabValue === 1 && (
          <ContactsManager />
        )}
        
        {tabValue === 2 && (
          <InterviewRecorder 
            addInterview={addInterview}
            refresh={refresh}
          />
        )}
        
        {tabValue === 3 && (
          <DailyMetrics />
        )}
      </Box>
    </Box>
  )
}

export default Interviews 