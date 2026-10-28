require('dotenv').config();
const { Pool } = require('pg');
const readline = require('readline');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'totem_equipamentos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('');
console.log('===========================================');
console.log('🔐 Criar Usuário Administrador');
console.log('===========================================');
console.log('');

// Perguntar dados do usuário
rl.question('Nome completo: ', (name) => {
  rl.question('Código (4 letras em maiúsculo, ex: ADMN): ', (code) => {
    rl.question('Email: ', (email) => {
      rl.question('Senha: ', async (password) => {

        // Validações
        if (!name || !code || !email || !password) {
          console.log('❌ Todos os campos são obrigatórios!');
          rl.close();
          await pool.end();
          return;
        }

        if (code.length !== 4) {
          console.log('❌ O código deve ter exatamente 4 caracteres!');
          rl.close();
          await pool.end();
          return;
        }

        const upperCode = code.toUpperCase();

        try {
          // Verificar se já existe
          const checkResult = await pool.query('SELECT * FROM users WHERE code = $1', [upperCode]);

          if (checkResult.rows.length > 0) {
            console.log('❌ Já existe um usuário com este código!');
            rl.close();
            await pool.end();
            return;
          }

          // Criar usuário
          const id = `admin-${Date.now()}`;
          const query = `
            INSERT INTO users (id, name, code, email, role, password, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
          `;

          await pool.query(query, [id, name, upperCode, email, 'Administrador', password]);

          console.log('');
          console.log('===========================================');
          console.log('✅ Usuário administrador criado com sucesso!');
          console.log('===========================================');
          console.log('');
          console.log('📋 Dados de acesso:');
          console.log(`   Código: ${upperCode}`);
          console.log(`   Senha: ${password}`);
          console.log('');
          console.log('⚠️  IMPORTANTE: Guarde estes dados em local seguro!');
          console.log('');

          rl.close();
          await pool.end();
        } catch (err) {
          console.error('❌ Erro:', err.message);
          rl.close();
          await pool.end();
          process.exit(1);
        }
      });
    });
  });
});
