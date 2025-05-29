import { Box, Typography, Card, CardContent } from '@mui/material'

function Settings() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        ⚙️ Настройки
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
        Firebase, API токены и конфигурация системы
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Скоро здесь будет...
          </Typography>
          <Typography variant="body1" color="textSecondary">
            • Управление Firebase базой данных<br/>
            • Настройка API токенов (Telegram, LinkedIn)<br/>
            • Конфигурация автопостинга<br/>
            • Бэкапы и восстановление данных<br/>
            • Системные настройки
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Settings 