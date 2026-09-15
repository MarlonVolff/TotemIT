const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

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
      rl.question('Senha: ', (password) => {

        // Validações
        if (!name || !code || !email || !password) {
          console.log('❌ Todos os campos são obrigatórios!');
          rl.close();
          db.close();
          return;
        }

        if (code.length !== 4) {
          console.log('❌ O código deve ter exatamente 4 caracteres!');
          rl.close();
          db.close();
          return;
        }

        const upperCode = code.toUpperCase();

        // Verificar se já existe
        db.get('SELECT * FROM users WHERE code = ?', [upperCode], (err, row) => {
          if (err) {
            console.error('❌ Erro ao verificar usuário:', err);
            rl.close();
            db.close();
            return;
          }

          if (row) {
            console.log('❌ Já existe um usuário com este código!');
            rl.close();
            db.close();
            return;
          }

          // Criar usuário
          const id = `admin-${Date.now()}`;
          const stmt = db.prepare(`
            INSERT INTO users (id, name, code, email, role, password, created_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `);

          stmt.run(id, name, upperCode, email, 'Administrador', password, (err) => {
            if (err) {
              console.error('❌ Erro ao criar usuário:', err);
            } else {
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
            }

            stmt.finalize();
            rl.close();
            db.close();
          });
        });
      });
    });
  });
});
