import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
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
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  SmartToy,
  GetApp,
  Refresh,
  DateRange,
  Analytics as AnalyticsIcon,
  PieChart,
  BarChart,
  Timeline,
  Message,
} from '@mui/icons-material'
import { useState, useEffect, useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts'
import { useDashboardOverview, usePreorders } from '../hooks/useFirebase.js'

// Цветовая палитра для графиков
const COLORS = ['#667eea', '#764ba2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#2196f3']

// Компонент метрики с трендом
function MetricCard({ title, value, change, changeType, icon, color = 'primary' }) {
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

// Компонент графика предзаказов по времени
function PreordersChart({ data, period }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📈 Динамика предзаказов
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              Нет данных для отображения
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📈 Динамика предзаказов
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'count' ? `${value} предзаказов` : `$${value}`,
                name === 'count' ? 'Количество' : 'Выручка'
              ]}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#667eea" 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Выручка ($)"
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#4caf50" 
              strokeWidth={3}
              name="Количество"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Компонент распределения источников трафика
function TrafficSourcesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Источники трафика
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              Нет данных для отображения
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎯 Источники трафика
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Компонент конверсионной воронки
function ConversionFunnel({ data }) {
  const funnelData = [
    { step: 'Просмотры постов', value: data?.views || 0, color: '#2196f3' },
    { step: 'Переходы на лендинг', value: data?.clicks || 0, color: '#ff9800' },
    { step: 'Заполнение формы', value: data?.leads || 0, color: '#4caf50' },
    { step: 'Предзаказы', value: data?.orders || 0, color: '#667eea' },
  ]

  const maxValue = Math.max(...funnelData.map(item => item.value))

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔄 Воронка конверсии
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          {funnelData.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
            const conversionRate = index > 0 ? 
              (funnelData[index - 1].value > 0 ? (item.value / funnelData[index - 1].value) * 100 : 0) : 100
            
            return (
              <Box key={item.step} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {item.step}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {item.value}
                    </Typography>
                    {index > 0 && (
                      <Chip 
                        size="small" 
                        label={`${conversionRate.toFixed(1)}%`}
                        color={conversionRate >= 10 ? "success" : "warning"}
                      />
                    )}
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

// Компонент таблицы топ постов
function TopPostsTable({ posts }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🏆 Топ посты по эффективности
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Пост</TableCell>
                <TableCell align="right">Просмотры</TableCell>
                <TableCell align="right">Клики</TableCell>
                <TableCell align="right">CTR</TableCell>
                <TableCell align="right">Лиды</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.platform === 'telegram' ? <Message color="primary" /> : <SmartToy color="info" />}
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {post.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{post.views?.toLocaleString()}</TableCell>
                  <TableCell align="right">{post.clicks}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      size="small"
                      label={`${post.ctr}%`}
                      color={post.ctr >= 5 ? "success" : post.ctr >= 2 ? "warning" : "error"}
                    />
                  </TableCell>
                  <TableCell align="right">{post.leads}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

// Основной компонент Analytics
function Analytics() {
  const { data: overviewData, loading, error, refresh } = useDashboardOverview()
  const { preorders, loading: preordersLoading } = usePreorders()
  
  const [period, setPeriod] = useState('7d')

  // Обрабатываем данные для графиков
  const chartData = useMemo(() => {
    if (!preorders || preorders.length === 0) return []
    
    // Группируем предзаказы по дням
    const groupedByDate = preorders.reduce((acc, order) => {
      const date = order.timestamp?.toDate ? 
        order.timestamp.toDate().toISOString().split('T')[0] :
        new Date(order.timestamp).toISOString().split('T')[0]
      
      if (!acc[date]) {
        acc[date] = { date, count: 0, revenue: 0 }
      }
      acc[date].count += 1
      acc[date].revenue += order.amount || 24
      
      return acc
    }, {})
    
    // Сортируем по датам
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [preorders])

  // Данные источников трафика
  const trafficSources = useMemo(() => {
    if (!preorders || preorders.length === 0) return []
    
    const sources = preorders.reduce((acc, order) => {
      const source = order.source || 'direct'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(sources).map(([name, value]) => ({ name, value }))
  }, [preorders])

  // Данные конверсии (моковые, в реальном проекте из Firebase)
  const conversionData = {
    views: 12500,
    clicks: 890,
    leads: 156,
    orders: preorders?.length || 0
  }

  // Топ посты (моковые данные)
  const topPosts = [
    { 
      title: 'Опрос для разработчиков', 
      platform: 'telegram', 
      views: 1250, 
      clicks: 45, 
      ctr: 3.6, 
      leads: 8 
    },
    { 
      title: 'Реальная история из практики', 
      platform: 'linkedin', 
      views: 890, 
      clicks: 32, 
      ctr: 3.6, 
      leads: 6 
    },
    { 
      title: 'Секрет карьерного роста', 
      platform: 'linkedin', 
      views: 1100, 
      clicks: 28, 
      ctr: 2.5, 
      leads: 4 
    },
    { 
      title: 'Техника объяснения кода', 
      platform: 'telegram', 
      views: 980, 
      clicks: 25, 
      ctr: 2.6, 
      leads: 5 
    },
  ]

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            📊 Analytics
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Аналитика продаж, трафика и эффективности маркетинга
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Период</InputLabel>
            <Select
              value={period}
              label="Период"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="7d">7 дней</MenuItem>
              <MenuItem value="30d">30 дней</MenuItem>
              <MenuItem value="90d">90 дней</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            onClick={refresh} 
            variant="outlined" 
            startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
            disabled={loading}
          >
            Обновить
          </Button>
          
          <Button 
            variant="contained" 
            startIcon={<GetApp />}
          >
            Экспорт
          </Button>
        </Box>
      </Box>

      {/* Ключевые метрики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Общая выручка"
            value={`$${overviewData?.preorders?.revenue || 0}`}
            change={23.5}
            changeType="positive"
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Предзаказы"
            value={overviewData?.preorders?.count || 0}
            change={15.8}
            changeType="positive"
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Конверсия"
            value={`${overviewData?.metrics?.conversion || 0}%`}
            change={-2.1}
            changeType="negative"
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Средний чек"
            value="$24"
            change={0}
            icon={<AnalyticsIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Графики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <PreordersChart data={chartData} period={period} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TrafficSourcesChart data={trafficSources} />
        </Grid>
      </Grid>

      {/* Воронка и топ посты */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ConversionFunnel data={conversionData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopPostsTable posts={topPosts} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics 