const express = require('express');
const router = express.Router();
const db = require('../database');

// Estatísticas públicas (DEVE VIR ANTES DE /:id)
router.get('/stats/public', async (req, res) => {
  const hoje = new Date().toISOString().split('T')[0];

  const query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Aberto' THEN 1 ELSE 0 END) as abertos,
      SUM(CASE WHEN status = 'Finalizado' THEN 1 ELSE 0 END) as finalizados,
      SUM(CASE WHEN DATE(created_at) = $1 THEN 1 ELSE 0 END) as hoje
    FROM equipment_requests
  `;

  try {
    const result = await db.query(query, [hoje]);
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Listar todas as solicitações
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM equipment_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Buscar solicitação por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM equipment_requests WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Criar nova solicitação
router.post('/', async (req, res) => {
  const { employee_name, employee_code, equipment, team, observation } = req.body;

  if (!employee_name || !employee_code || !equipment || !team) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  // Gerar ID sequencial de 13 dígitos
  const timestamp = Date.now().toString(); // 13 dígitos
  const id = `REQ-${timestamp}`;

  const query = `
    INSERT INTO equipment_requests (
      id, employee_name, employee_code, equipment, team, observation,
      status, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, 'Aberto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;

  try {
    const result = await db.query(query, [
      id,
      employee_name,
      employee_code.toUpperCase(),
      equipment,
      team,
      observation || ''
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Atualizar solicitação (mudar status, atribuir analista, etc)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, analyst_code, analyst_name } = req.body;

  const updates = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    updates.push(`status = $${paramIndex++}`);
    params.push(status);
  }

  if (analyst_code !== undefined) {
    updates.push(`analyst_code = $${paramIndex++}`);
    params.push(analyst_code);
  }

  if (analyst_name !== undefined) {
    updates.push(`analyst_name = $${paramIndex++}`);
    params.push(analyst_name);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');

  const query = `UPDATE equipment_requests SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  params.push(id);

  try {
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Deletar solicitação
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM equipment_requests WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json({ message: 'Solicitação excluída com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Estatísticas
router.get('/stats/summary', async (req, res) => {
  const query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Aberto' THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'Finalizado' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'Aguardando retirada' THEN 1 ELSE 0 END) as waiting
    FROM equipment_requests
  `;

  try {
    const result = await db.query(query);
    res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
