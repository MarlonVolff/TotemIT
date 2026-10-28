const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { code, password } = req.body;

  if (!code || !password) {
    return res.status(400).json({ error: 'Código e senha são obrigatórios' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE UPPER(code) = UPPER($1) AND password = $2',
      [code, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Código ou senha incorretos' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  const { name, code, email, role, password } = req.body;

  if (!name || !code || !email || !role || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const query = `
    INSERT INTO users (id, name, code, email, role, password, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    RETURNING *
  `;

  try {
    const result = await db.query(query, [id, name, code.toUpperCase(), email, role, password]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Código PostgreSQL para UNIQUE constraint violation
      return res.status(409).json({ error: 'Já existe um usuário com este código' });
    }
    return res.status(500).json({ error: err.message });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  const params = [];
  const updates = [];
  let paramIndex = 1;

  if (name) {
    updates.push(`name = $${paramIndex++}`);
    params.push(name);
  }
  if (email) {
    updates.push(`email = $${paramIndex++}`);
    params.push(email);
  }
  if (role) {
    updates.push(`role = $${paramIndex++}`);
    params.push(role);
  }
  if (password) {
    updates.push(`password = $${paramIndex++}`);
    params.push(password);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  params.push(id);

  try {
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (id === 'admin-default') {
    return res.status(403).json({ error: 'Não é possível excluir o usuário administrador padrão' });
  }

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
