const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Tabela de usuários (Administradores e Analistas)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Administrador', 'Analista')),
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de solicitações de equipamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS equipment_requests (
      id TEXT PRIMARY KEY,
      employee_name TEXT NOT NULL,
      employee_code TEXT NOT NULL,
      equipment TEXT NOT NULL,
      team TEXT NOT NULL,
      observation TEXT,
      status TEXT NOT NULL CHECK(status IN ('Aberto', 'Em andamento', 'Aguardando retirada', 'Finalizado')),
      analyst_code TEXT,
      analyst_name TEXT,
      notified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Adicionar coluna notified se não existir (migration)
  db.run(`
    ALTER TABLE equipment_requests ADD COLUMN notified INTEGER DEFAULT 0
  `, (err) => {
    // Ignora erro se coluna já existe
    if (err && !err.message.includes('duplicate column')) {
      console.error('Erro ao adicionar coluna notified:', err);
    }
  });

  // Verificar se usuário admin padrão existe
  db.get('SELECT * FROM users WHERE code = ?', ['ADMN'], (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar usuário admin:', err);
      return;
    }

    if (!row) {
      // Criar usuário administrador padrão
      const stmt = db.prepare(`
        INSERT INTO users (id, name, code, email, role, password, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `);

      stmt.run(
        'admin-default',
        'Administrador',
        'ADMN',
        'admin@empresa.com',
        'Administrador',
        'admin123'
      );

      stmt.finalize();
      console.log('✅ Banco de dados inicializado');
      console.log('✅ Usuário padrão criado: ADMN / admin123');
    } else {
      console.log('✅ Banco de dados conectado');
    }
  });
});

module.exports = db;
