require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usar SQLite local para desenvolvimento
const dbPath = path.join(__dirname, '../database.sqlite');
const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao SQLite:', err.message);
    return;
  }
  console.log('✅ Conectado ao SQLite (local):', dbPath);
});

// Exportar o banco SQLite diretamente
module.exports = sqliteDb;
