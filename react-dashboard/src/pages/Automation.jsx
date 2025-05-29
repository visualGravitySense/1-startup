import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  TextField,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  FormControlLabel,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from '@mui/material'
import {
  PlayArrow,
  Stop,
  Science,
  Telegram,
  LinkedIn,
  Schedule,
  Analytics,
  Edit,
  Add,
  Warning,
  Pause,
  GetApp,
  Settings,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useAutomation, useNotification } from '../hooks/useFirebase.js'

// Компонент статистики
function StatCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: `${color}.main`, mx: 'auto', mb: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h4" component="div" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Компонент настроек бота
function BotSettings({ config, onSave, onTest }) {
  const [localConfig, setLocalConfig] = useState(config)
  const [testing, setTesting] = useState(false)

  const handleSave = () => {
    onSave(localConfig)
  }

  const handleTest = async () => {
    setTesting(true)
    await onTest(localConfig)
    setTesting(false)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🤖 Настройки Telegram бота
        </Typography>
        
        <TextField
          fullWidth
          label="Bot Token"
          value={localConfig.token || ''}
          onChange={(e) => setLocalConfig({...localConfig, token: e.target.value})}
          margin="normal"
          placeholder="Токен от @BotFather"
          type="password"
        />
        
        <TextField
          fullWidth
          label="Chat ID"
          value={localConfig.chatId || ''}
          onChange={(e) => setLocalConfig({...localConfig, chatId: e.target.value})}
          margin="normal"
          placeholder="Ваш Chat ID для уведомлений"
        />
        
        <TextField
          fullWidth
          label="Channel ID"
          value={localConfig.channelId || ''}
          onChange={(e) => setLocalConfig({...localConfig, channelId: e.target.value})}
          margin="normal"
          placeholder="@your_channel (опционально)"
        />
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ mr: 2 }}
            startIcon={<Settings />}
          >
            Сохранить
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleTest}
            disabled={testing || !localConfig.token}
            startIcon={testing ? <CircularProgress size={16} /> : <CheckCircle />}
          >
            Проверить
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

// Компонент расписания постов
function PostSchedule({ schedule, onEdit, onAdd }) {
  const telegramPosts = schedule.filter(p => p.platform === 'telegram')
  const linkedinPosts = schedule.filter(p => p.platform === 'linkedin')

  const ScheduleCard = ({ title, posts, platform }) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {platform === 'telegram' ? <Telegram sx={{ mr: 1 }} /> : <LinkedIn sx={{ mr: 1 }} />}
          {title}
        </Typography>
        
        <List dense>
          {posts.map((post, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText
                primary={post.title}
                secondary={`${post.day} ${post.time}`}
              />
              <IconButton onClick={() => onEdit(post)}>
                <Edit />
              </IconButton>
            </ListItem>
          ))}
        </List>
        
        <Button 
          fullWidth 
          startIcon={<Add />} 
          onClick={() => onAdd(platform)}
          sx={{ mt: 2 }}
        >
          Добавить пост
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ScheduleCard 
          title="Telegram посты" 
          posts={telegramPosts} 
          platform="telegram" 
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ScheduleCard 
          title="LinkedIn посты" 
          posts={linkedinPosts} 
          platform="linkedin" 
        />
      </Grid>
    </Grid>
  )
}

// Компонент предпросмотра постов
function PostPreview({ nextPosts, onEdit }) {
  return (
    <Grid container spacing={3}>
      {nextPosts.map((post, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {post.platform === 'telegram' ? <Telegram /> : <LinkedIn />}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Следующий {post.platform} пост
                </Typography>
              </Box>
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                  {post.content}
                </Typography>
              </Paper>
              
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                onClick={() => onEdit(post)}
              >
                Редактировать
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

// Компонент экстренных действий
function EmergencyActions({ onEmergencyPost, onPauseAll, onResumeAll, isPaused }) {
  const [emergencyText, setEmergencyText] = useState('')

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🚨 Экстренные действия
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Текст экстренного поста"
          value={emergencyText}
          onChange={(e) => setEmergencyText(e.target.value)}
          margin="normal"
        />
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button 
            variant="contained" 
            color="warning"
            startIcon={<Telegram />}
            onClick={() => onEmergencyPost('telegram', emergencyText)}
            disabled={!emergencyText.trim()}
            sx={{ mr: 2, mb: 1 }}
          >
            Telegram
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            startIcon={<LinkedIn />}
            onClick={() => onEmergencyPost('linkedin', emergencyText)}
            disabled={!emergencyText.trim()}
            sx={{ mb: 1 }}
          >
            LinkedIn
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Button 
            variant={isPaused ? "outlined" : "contained"}
            color="error"
            startIcon={<Pause />}
            onClick={onPauseAll}
            disabled={isPaused}
            sx={{ mr: 2 }}
          >
            Приостановить все
          </Button>
          <Button 
            variant={isPaused ? "contained" : "outlined"}
            color="success"
            startIcon={<PlayArrow />}
            onClick={onResumeAll}
            disabled={!isPaused}
          >
            Возобновить все
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

// Основной компонент
function Automation() {
  const { stats, loading, error, refresh } = useAutomation()
  const { notification, showSuccess, showError, hideNotification } = useNotification()
  
  const [automationRunning, setAutomationRunning] = useState(false)
  const [botConfig, setBotConfig] = useState({
    token: '',
    chatId: '',
    channelId: ''
  })
  const [isPaused, setIsPaused] = useState(false)
  
  // Моковые данные для демонстрации (в реальном проекте будут из Firebase)
  const [schedule] = useState([
    { platform: 'telegram', day: 'Вторник', time: '9:00', title: 'Опрос для разработчиков' },
    { platform: 'telegram', day: 'Среда', time: '11:00', title: 'Лайфхак: техника → бизнес' },
    { platform: 'telegram', day: 'Пятница', time: '15:00', title: 'Результаты курса' },
    { platform: 'linkedin', day: 'Понедельник', time: '10:00', title: 'Реальная история' },
    { platform: 'linkedin', day: 'Четверг', time: '14:00', title: 'Секрет карьерного роста' },
  ])
  
  const [nextPosts] = useState([
    {
      platform: 'telegram',
      content: `🎯 Опрос для разработчиков:

Как часто вам приходится объяснять техническое решение нетехническим людям?

🔹 Каждый день
🔹 Несколько раз в неделю  
🔹 Раз в месяц
🔹 Почти никогда

Если выбрали первые два варианта - вам точно нужен курс "Как объяснять код бизнесу"`
    },
    {
      platform: 'linkedin',
      content: `🚀 Реальная история из моей практики:

Разработчик: "Нужно отрефакторить legacy код"
Менеджер: "Зачем тратить время на то, что работает?"

Знакомо? 

Проблема не в коде, а в коммуникации...`
    }
  ])

  // Обработчики событий
  const handleStartAutomation = () => {
    if (!botConfig.token || !botConfig.chatId) {
      showError('Заполните настройки бота перед запуском')
      return
    }
    setAutomationRunning(true)
    showSuccess('Автоматизация запущена!')
  }

  const handleStopAutomation = () => {
    setAutomationRunning(false)
    showSuccess('Автоматизация остановлена')
  }

  const handleTestPost = () => {
    showSuccess('Тестовый пост отправлен!')
  }

  const handleSaveBotConfig = (config) => {
    setBotConfig(config)
    showSuccess('Настройки сохранены')
  }

  const handleTestBot = async (config) => {
    // Имитация тестирования
    await new Promise(resolve => setTimeout(resolve, 2000))
    showSuccess('Бот работает корректно!')
  }

  const handleEmergencyPost = (platform, text) => {
    showSuccess(`Экстренный пост отправлен в ${platform}`)
  }

  const handlePauseAll = () => {
    setIsPaused(true)
    showSuccess('Все посты приостановлены')
  }

  const handleResumeAll = () => {
    setIsPaused(false)
    showSuccess('Посты возобновлены')
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки данных: {error}
        </Alert>
        <Button onClick={refresh} variant="contained">
          Попробовать снова
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          🤖 Автоматизация
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Управление автопостингом и мониторинг системы
        </Typography>
      </Box>

      {/* Статус системы */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Статус автоматизации
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <StatCard 
                title="Статус бота"
                value={automationRunning ? "🟢" : "⏹️"}
                icon={automationRunning ? <PlayArrow /> : <Stop />}
                color={automationRunning ? "success" : "grey"}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard 
                title="Постов за неделю"
                value={loading ? "..." : stats?.thisWeek || 0}
                icon={<Schedule />}
                color="primary"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard 
                title="Всего постов"
                value={loading ? "..." : stats?.totalPosts || 0}
                icon={<Analytics />}
                color="info"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard 
                title="Платформы"
                value={loading ? "..." : Object.keys(stats?.platforms || {}).length}
                icon={<LinkedIn />}
                color="warning"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="success"
              startIcon={<PlayArrow />}
              onClick={handleStartAutomation}
              disabled={automationRunning}
            >
              Запустить
            </Button>
            <Button 
              variant="contained" 
              color="error"
              startIcon={<Stop />}
              onClick={handleStopAutomation}
              disabled={!automationRunning}
            >
              Остановить
            </Button>
            <Button 
              variant="outlined"
              startIcon={<Science />}
              onClick={handleTestPost}
            >
              Тестовый пост
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Настройки бота */}
      <Box sx={{ mb: 4 }}>
        <BotSettings 
          config={botConfig}
          onSave={handleSaveBotConfig}
          onTest={handleTestBot}
        />
      </Box>

      {/* Расписание постов */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          📅 Расписание постов
        </Typography>
        <PostSchedule 
          schedule={schedule}
          onEdit={(post) => showSuccess(`Редактирование: ${post.title}`)}
          onAdd={(platform) => showSuccess(`Добавление поста для ${platform}`)}
        />
      </Box>

      {/* Предпросмотр постов */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          👀 Предпросмотр контента
        </Typography>
        <PostPreview 
          nextPosts={nextPosts}
          onEdit={(post) => showSuccess(`Редактирование ${post.platform} поста`)}
        />
      </Box>

      {/* Экстренные действия */}
      <Box sx={{ mb: 4 }}>
        <EmergencyActions 
          onEmergencyPost={handleEmergencyPost}
          onPauseAll={handlePauseAll}
          onResumeAll={handleResumeAll}
          isPaused={isPaused}
        />
      </Box>

      {/* Снэкбар для уведомлений */}
      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert 
            onClose={hideNotification} 
            severity={notification.type}
            variant="filled"
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  )
}

export default Automation 