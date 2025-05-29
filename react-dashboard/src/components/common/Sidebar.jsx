import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  SmartToy as AutomationIcon,
  Analytics as AnalyticsIcon,
  People as InterviewsIcon,
  Settings as SettingsIcon,
  Timeline as TrendingIcon,
  Message as MessageIcon,
} from '@mui/icons-material'

const menuItems = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: <DashboardIcon />,
    description: 'Обзор всех метрик',
  },
  {
    id: 'automation',
    text: 'Автоматизация',
    icon: <AutomationIcon />,
    description: 'Управление ботами',
  },
  {
    id: 'analytics',
    text: 'Аналитика',
    icon: <AnalyticsIcon />,
    description: 'Предзаказы и метрики',
  },
  {
    id: 'interviews',
    text: 'Интервью',
    icon: <InterviewsIcon />,
    description: 'CRM и контакты',
  },
  {
    id: 'settings',
    text: 'Настройки',
    icon: <SettingsIcon />,
    description: 'Firebase и конфиг',
  },
]

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <Box sx={{ height: '100%', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: '2rem',
          }}
        >
          🚀
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
          DigoClasses
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
          Control Center
        </Typography>
      </Box>

      <Divider />

      {/* Quick Stats */}
      <Box sx={{ p: 2, mt: 2 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            p: 2,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            24
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Предзаказов
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => setCurrentPage(item.id)}
              selected={currentPage === item.id}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.id ? 'white' : '#667eea',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={currentPage === item.id ? null : item.description}
                secondaryTypographyProps={{
                  sx: { fontSize: '0.75rem', color: '#999' },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* Quick Actions */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
          Быстрые действия
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <MessageIcon sx={{ fontSize: 16, color: '#999' }} />
              </ListItemIcon>
              <ListItemText
                primary="Новый пост"
                primaryTypographyProps={{ fontSize: '0.8rem' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TrendingIcon sx={{ fontSize: 16, color: '#999' }} />
              </ListItemIcon>
              <ListItemText
                primary="Экспорт данных"
                primaryTypographyProps={{ fontSize: '0.8rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Status Indicator */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: '#e8f5e8',
            border: '1px solid #c3e6cb',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              animation: 'pulse 2s infinite',
            }}
          />
          <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
            Бот активен
          </Typography>
        </Box>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  )
}

export default Sidebar 