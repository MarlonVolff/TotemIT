require('dotenv').config();
const { Pool } = require('pg');

// Configurar conexão com PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
    return;
  }
  console.log('✅ Conectado ao PostgreSQL (Supabase)');
  release();
});

// Função para converter ? para $1, $2, $3 (compatibilidade SQLite -> PostgreSQL)
function convertQuery(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

// Wrapper para manter compatibilidade com código SQLite
const db = {
  // Query genérica
  query: (text, params, callback) => {
    const pgSql = convertQuery(text);
    return pool.query(pgSql, params, callback);
  },

  // get - buscar uma linha (SQLite style)
  get: (sql, params, callback) => {
    const pgSql = convertQuery(sql);
    pool.query(pgSql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows[0]); // Retorna primeira linha ou undefined
    });
  },

  // all - buscar todas as linhas (SQLite style)
  all: (sql, params, callback) => {
    const pgSql = convertQuery(sql);
    pool.query(pgSql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result.rows); // Retorna array de linhas
    });
  },

  // run - executar comando (INSERT, UPDATE, DELETE) (SQLite style)
  run: (sql, params, callback) => {
    const pgSql = convertQuery(sql);

    pool.query(pgSql, params, (err, result) => {
      if (err) return callback(err);

      // Simular objeto 'this' do SQLite
      const context = {
        lastID: result.rows[0]?.id || null,
        changes: result.rowCount || 0
      };

      callback.call(context, null);
    });
  },

  // prepare - simular prepared statement (SQLite style)
  prepare: (sql) => {
    return {
      run: (...args) => {
        const callback = args.pop();
        const params = args;
        db.run(sql, params, callback);
      },
      finalize: () => {
        // No-op para PostgreSQL
      }
    };
  }
};

module.exports = db;
