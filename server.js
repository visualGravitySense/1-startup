const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Routes for our main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/free-lesson', (req, res) => {
    res.sendFile(path.join(__dirname, 'free-lesson.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'preorders-dashboard.html'));
});

app.get('/firebase-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'firebase-dashboard.html'));
});

// API endpoint for pre-orders (if needed for testing)
app.post('/api/preorder', (req, res) => {
    console.log('Pre-order received:', req.body);
    res.json({ success: true, message: 'Pre-order received' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📄 Лендинг: http://localhost:${PORT}/landing`);
    console.log(`🎓 Бесплатный урок: http://localhost:${PORT}/free-lesson`);
    console.log(`📊 Дашборд предзаказов: http://localhost:${PORT}/dashboard`);
}); 