const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('');
console.log('===========================================');
console.log('🔐 Criando Usuário Administrador Padrão');
console.log('===========================================');
console.log('');

// Criar usuário padrão
const id = 'admin-default';
const name = 'Administrador';
const code = 'ADMIN';
const email = 'admin@empresa.com';
const role = 'Administrador';
const password = 'admin123';

// Verificar se já existe
db.get('SELECT * FROM users WHERE code = ?', [code], (err, row) => {
  if (err) {
    console.error('❌ Erro ao verificar usuário:', err);
    db.close();
    return;
  }

  if (row) {
    console.log('ℹ️  Usuário admin padrão já existe!');
    console.log('');
    console.log('📋 Dados de acesso:');
    console.log(`   Código: ${code}`);
    console.log(`   Senha: ${password}`);
    console.log('');
    db.close();
    return;
  }

  // Criar usuário
  const stmt = db.prepare(`
    INSERT INTO users (id, name, code, email, role, password, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  stmt.run(id, name, code, email, role, password, (err) => {
    if (err) {
      console.error('❌ Erro ao criar usuário:', err);
    } else {
      console.log('✅ Usuário administrador criado com sucesso!');
      console.log('');
      console.log('📋 Dados de acesso:');
      console.log(`   Código: ${code}`);
      console.log(`   Senha: ${password}`);
      console.log('');
      console.log('💡 Use estes dados para fazer login no Painel TI');
      console.log('   URL: http://localhost:3000/painel-ti');
      console.log('');
    }

    stmt.finalize();
    db.close();
  });
});
