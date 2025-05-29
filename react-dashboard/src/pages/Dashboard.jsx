import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material'
import {
  TrendingUp,
  People,
  SmartToy,
  AttachMoney,
  Schedule,
  CheckCircle,
  Warning,
  Notifications,
  Refresh,
} from '@mui/icons-material'
import { useDashboardOverview } from '../hooks/useFirebase.js'

// Компонент статистической карточки
function StatsCard({ title, value, change, color, icon, subtitle, loading = false }) {
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          </Box>
          <Avatar sx={{ backgroundColor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
        {change !== undefined && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${change > 0 ? '+' : ''}${change}%`}
              color={change > 0 ? 'success' : 'error'}
              size="small"
            />
            <Typography variant="body2" color="textSecondary">
              прогресс к цели
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Компонент прогресса проекта
function ProjectProgress({ data, loading }) {
  const milestones = [
    { name: 'Автопостинг бот', completed: true, progress: 100 },
    { name: 'Лендинг страница', completed: true, progress: 100 },
    { name: 'Firebase интеграция', completed: true, progress: 100 },
    { name: 'Interview tracker', completed: true, progress: 100 },
    { name: 'React Dashboard', completed: false, progress: 85 }, // Обновлено!
    { name: 'Railway Deploy', completed: false, progress: 0 },
  ]

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} />
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} sx={{ py: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={6} sx={{ mt: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📋 Прогресс проекта
        </Typography>
        <List>
          {milestones.map((milestone, index) => (
            <ListItem key={index} disablePadding sx={{ py: 1 }}>
              <ListItemIcon>
                {milestone.completed ? (
                  <CheckCircle color="success" />
                ) : (
                  <Schedule color="action" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={milestone.name}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={milestone.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                      color={milestone.completed ? 'success' : 'primary'}
                    />
                    <Box component="span" sx={{ mt: 0.5, display: 'block', fontSize: '0.875rem', color: 'text.secondary' }}>
                      {milestone.progress}%
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

// Компонент последних активностей
function RecentActivity({ data, loading }) {
  // Реальные активности на основе данных
  const getRecentActivities = (data) => {
    if (!data) return []

    const activities = []

    // Последние предзаказы
    if (data.preorders?.count > 0) {
      activities.push({
        type: 'preorder',
        message: `Текущий прогресс: ${data.preorders.count} предзаказов на $${data.preorders.revenue}`,
        time: 'актуально',
        status: 'success',
      })
    }

    // Автопостинг статистика
    if (data.automation?.postsThisWeek > 0) {
      activities.push({
        type: 'post',
        message: `${data.automation.postsThisWeek} постов опубликовано на этой неделе`,
        time: 'на ${data.automation.platforms} платформах',
        status: 'success',
      })
    }

    // Интервью
    if (data.interviews?.completed > 0) {
      activities.push({
        type: 'interview',
        message: `Завершено ${data.interviews.completed} интервью`,
        time: `рейтинг ${data.interviews.rating}/5`,
        status: 'info',
      })
    }

    // Цель достижения
    const targetProgress = Math.round((data.preorders?.count || 0) / (data.preorders?.target || 10) * 100)
    if (targetProgress >= 100) {
      activities.push({
        type: 'success',
        message: '🎉 Цель в 10 предзаказов достигнута!',
        time: 'превышена на ${targetProgress - 100}%',
        status: 'success',
      })
    }

    return activities.slice(0, 4) // показываем максимум 4
  }

  const getIcon = (type) => {
    switch (type) {
      case 'post':
        return <SmartToy color="primary" />
      case 'preorder':
        return <AttachMoney color="success" />
      case 'interview':
        return <People color="info" />
      case 'warning':
        return <Warning color="warning" />
      case 'success':
        return <CheckCircle color="success" />
      default:
        return <Notifications />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} />
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  const activities = getRecentActivities(data)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔔 Текущий статус
        </Typography>
        {activities.length > 0 ? (
          <List>
            {activities.map((activity, index) => (
              <ListItem key={index} disablePadding sx={{ py: 1 }}>
                <ListItemIcon>{getIcon(activity.type)}</ListItemIcon>
                <ListItemText
                  primary={activity.message}
                  secondary={activity.time}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
            Нет данных для отображения
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

function Dashboard() {
  const { data, loading, error, refresh } = useDashboardOverview()

  // Обработка ошибки
  if (error && !loading) {
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            📊 Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Обзор всех метрик и активности проекта DigoClasses
          </Typography>
        </Box>
        <Button 
          onClick={refresh} 
          variant="outlined" 
          startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="💰 Предзаказы"
            value={loading ? '...' : data?.preorders?.count || 0}
            change={data?.preorders?.progress}
            color="#4caf50"
            icon={<AttachMoney />}
            subtitle={loading ? 'Загрузка...' : `$${data?.preorders?.revenue || 0} выручка`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="🤖 Автопостинг"
            value={loading ? '...' : data?.automation?.postsThisWeek || 0}
            color="#2196f3"
            icon={<SmartToy />}
            subtitle={loading ? 'Загрузка...' : `${data?.automation?.platforms || 0} платформ`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="👥 Интервью"
            value={loading ? '...' : data?.interviews?.completed || 0}
            color="#ff9800"
            icon={<People />}
            subtitle={loading ? 'Загрузка...' : `${data?.interviews?.rating || 0}/5 рейтинг`}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="📈 Конверсия"
            value={loading ? '...' : `${data?.metrics?.conversion || 0}%`}
            color="#9c27b0"
            icon={<TrendingUp />}
            subtitle={loading ? 'Загрузка...' : 'пост → предзаказ'}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProjectProgress data={data} loading={loading} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity data={data} loading={loading} />
        </Grid>
      </Grid>

      {/* Status Info */}
      {data && !loading && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            🎯 <strong>Цель проекта:</strong> {data.preorders?.target || 10} предзаказов. 
            Текущий прогресс: <strong>{data.preorders?.progress || 0}%</strong>
            {data.preorders?.progress >= 100 && ' - Цель достигнута! 🎉'}
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default Dashboard 