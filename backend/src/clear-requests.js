const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🧹 Iniciando limpeza de chamados...');

db.run('DELETE FROM equipment_requests', function(err) {
  if (err) {
    console.error('❌ Erro ao limpar chamados:', err.message);
    process.exit(1);
  }

  console.log(`✅ ${this.changes} chamado(s) removido(s) com sucesso!`);
  console.log('✅ Banco de dados limpo!');

  db.close();
});
