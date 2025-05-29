import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Sidebar from './components/common/Sidebar'
import Dashboard from './pages/Dashboard'
import Automation from './pages/Automation'
import Analytics from './pages/Analytics'
import Interviews from './pages/Interviews'
import Settings from './pages/Settings'

// Импортируем тестовые утилиты Firebase в dev режиме
if (import.meta.env.DEV) {
  import('./utils/testData.js').then((module) => {
    // Делаем доступными в консоли браузера
    window.FirebaseTestUtils = {
      populateTestData: module.populateTestData,
      clearTestData: module.clearTestData,
      testFirebaseConnection: module.testFirebaseConnection
    }
    console.log('🔥 Firebase Test Utils загружены! Используйте:')
    console.log('- FirebaseTestUtils.testFirebaseConnection()')
    console.log('- FirebaseTestUtils.populateTestData()')
    console.log('- FirebaseTestUtils.clearTestData()')
  })
}

// Создаем тему в стиле ваших дашбордов
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

const drawerWidth = 280

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'automation':
        return <Automation />
      case 'analytics':
        return <Analytics />
      case 'interviews':
        return <Interviews />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              🚀 DigoClasses Control Center
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
          }}
        >
          {renderCurrentPage()}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
