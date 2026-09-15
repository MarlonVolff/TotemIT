const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar todos os usuários
router.get('/', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Login
router.post('/login', (req, res) => {
  const { code, password } = req.body;

  if (!code || !password) {
    return res.status(400).json({ error: 'Código e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM users WHERE UPPER(code) = UPPER(?) AND password = ?',
    [code, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(401).json({ error: 'Código ou senha incorretos' });
      }

      res.json(row);
    }
  );
});

// Criar usuário
router.post('/', (req, res) => {
  const { name, code, email, role, password } = req.body;

  if (!name || !code || !email || !role || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const stmt = db.prepare(`
    INSERT INTO users (id, name, code, email, role, password, created_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  stmt.run(id, name, code.toUpperCase(), email, role, password, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Já existe um usuário com este código' });
      }
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });

  stmt.finalize();
});

// Atualizar usuário
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  let query = 'UPDATE users SET ';
  const params = [];
  const updates = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (role) {
    updates.push('role = ?');
    params.push(role);
  }
  if (password) {
    updates.push('password = ?');
    params.push(password);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  query += updates.join(', ') + ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Deletar usuário
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'admin-default') {
    return res.status(403).json({ error: 'Não é possível excluir o usuário administrador padrão' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  });
});

module.exports = router;
