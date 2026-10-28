require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'totem_equipamentos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

console.log('🧹 Iniciando limpeza de chamados...');

async function clearRequests() {
  try {
    const result = await pool.query('DELETE FROM equipment_requests RETURNING *');

    console.log(`✅ ${result.rowCount} chamado(s) removido(s) com sucesso!`);
    console.log('✅ Banco de dados limpo!');

    await pool.end();
  } catch (err) {
    console.error('❌ Erro ao limpar chamados:', err.message);
    await pool.end();
    process.exit(1);
  }
}

clearRequests();
