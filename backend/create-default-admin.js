require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'totem_equipamentos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

console.log('');
console.log('===========================================');
console.log('🔐 Criando Usuário Administrador Padrão');
console.log('===========================================');
console.log('');

// Criar usuário padrão
const id = 'admin-default';
const name = 'Administrador';
const code = 'ADMN';
const email = 'admin@empresa.com';
const role = 'Administrador';
const password = 'admin123';

async function createDefaultAdmin() {
  try {
    // Verificar se já existe
    const checkResult = await pool.query('SELECT * FROM users WHERE code = $1', [code]);

    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Usuário admin padrão já existe!');
      console.log('');
      console.log('📋 Dados de acesso:');
      console.log(`   Código: ${code}`);
      console.log(`   Senha: ${password}`);
      console.log('');
      await pool.end();
      return;
    }

    // Criar usuário
    const query = `
      INSERT INTO users (id, name, code, email, role, password, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    `;

    await pool.query(query, [id, name, code, email, role, password]);

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('');
    console.log('📋 Dados de acesso:');
    console.log(`   Código: ${code}`);
    console.log(`   Senha: ${password}`);
    console.log('');
    console.log('💡 Use estes dados para fazer login no Painel TI');
    console.log('   URL: http://localhost:3000/painel-ti');
    console.log('');

    await pool.end();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    await pool.end();
    process.exit(1);
  }
}

createDefaultAdmin();
