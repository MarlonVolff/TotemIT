const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const usersRoutes = require('./routes/users');
const requestsRoutes = require('./routes/requests');
const colaboradoresRoutes = require('./routes/colaboradores');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/users', usersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);

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
app.listen(PORT, () => {
  console.log('===========================================');
  console.log(`🚀 Servidor Backend rodando`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
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
  console.log('   GET    /api/colaboradores/:employeeNumber');
  console.log('   GET    /api/colaboradores');
  console.log('===========================================');
});

module.exports = app;
