require('dotenv').config();
const { Pool } = require('pg');

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'totem_equipamentos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
    console.error('💡 Verifique se o PostgreSQL está rodando e as credenciais estão corretas');
    return;
  }
  console.log('✅ Conectado ao PostgreSQL:', {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'totem_equipamentos',
    port: process.env.DB_PORT || 5432
  });
  release();
});

// Tratamento de erros do pool
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
