const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const usersRoutes = require('./routes/users');
const requestsRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS para permitir Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  /\.vercel\.app$/  // Permite qualquer domínio .vercel.app
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    // Verifica se a origin está na lista permitida
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/users', usersRoutes);
app.use('/api/requests', requestsRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend da Central de Equipamentos TI funcionando',
    timestamp: new Date().toISOString()
  });
});

// Servir arquivos estáticos do React em produção
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// Todas as outras rotas retornam o index.html do React (para React Router funcionar)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('===========================================');
  console.log(`🚀 Servidor Backend rodando`);
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health: /api/health`);
  console.log('===========================================');
  console.log('📚 Endpoints disponíveis:');
  console.log('   POST   /api/users/login');
  console.log('   GET    /api/users');
  console.log('   POST   /api/users');
  console.log('   PUT    /api/users/:id');
  console.log('   DELETE /api/users/:id');
  console.log('   GET    /api/requests');
  console.log('   POST   /api/requests');
  console.log('   PUT    /api/requests/:id');
  console.log('   GET    /api/requests/stats/summary');
  console.log('===========================================');
});

module.exports = app;
