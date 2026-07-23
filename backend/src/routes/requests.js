const express = require('express');
const router = express.Router();
const db = require('../database');

// Listar todas as solicitações
router.get('/', (req, res) => {
  db.all('SELECT * FROM equipment_requests ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Buscar solicitação por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM equipment_requests WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json(row);
  });
});

// Criar nova solicitação
router.post('/', (req, res) => {
  const { employee_name, employee_code, equipment, team, observation } = req.body;

  if (!employee_name || !employee_code || !equipment || !team) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  // Gerar ID sequencial de 13 dígitos
  const timestamp = Date.now().toString(); // 13 dígitos
  const id = `REQ-${timestamp}`;

  const stmt = db.prepare(`
    INSERT INTO equipment_requests (
      id, employee_name, employee_code, equipment, team, observation,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'Aberto', datetime('now'), datetime('now'))
  `);

  stmt.run(
    id,
    employee_name,
    employee_code.toUpperCase(),
    equipment,
    team,
    observation || ''
  , function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT * FROM equipment_requests WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });

  stmt.finalize();
});

// Atualizar solicitação (mudar status, atribuir analista, etc)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status, analyst_code, analyst_name } = req.body;

  const updates = [];
  const params = [];

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (analyst_code !== undefined) {
    updates.push('analyst_code = ?');
    params.push(analyst_code);
  }

  if (analyst_name !== undefined) {
    updates.push('analyst_name = ?');
    params.push(analyst_name);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  updates.push('updated_at = datetime(\'now\')');

  const query = `UPDATE equipment_requests SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    db.get('SELECT * FROM equipment_requests WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Deletar solicitação
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM equipment_requests WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    res.json({ message: 'Solicitação excluída com sucesso' });
  });
});

// Estatísticas
router.get('/stats/summary', (req, res) => {
  const query = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Aberto' THEN 1 ELSE 0 END) as open,
      SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'Finalizado' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'Aguardando retirada' THEN 1 ELSE 0 END) as waiting
    FROM equipment_requests
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

module.exports = router;
