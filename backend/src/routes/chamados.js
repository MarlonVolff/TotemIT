const express = require('express');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Criar chamado (público - usado pelo totem)
router.post('/', (req, res) => {
  const { colaborador_id, equipamento } = req.body;

  if (!colaborador_id || !equipamento) {
    return res.status(400).json({
      error: 'Colaborador ID e equipamento são obrigatórios'
    });
  }

  // Validar que colaborador_id tem 4 caracteres
  if (colaborador_id.length !== 4) {
    return res.status(400).json({
      error: 'ID do colaborador deve ter 4 letras'
    });
  }

  db.run(
    'INSERT INTO chamados (colaborador_id, equipamento, status) VALUES (?, ?, ?)',
    [colaborador_id.toUpperCase(), equipamento, 'aberto'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar chamado' });
      }

      res.status(201).json({
        id: this.lastID,
        colaborador_id: colaborador_id.toUpperCase(),
        equipamento,
        status: 'aberto'
      });
    }
  );
});

// Listar chamados (protegido - apenas TI)
router.get('/', authMiddleware, (req, res) => {
  const { status } = req.query;

  let query = 'SELECT * FROM chamados';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY data_criacao DESC';

  db.all(query, params, (err, chamados) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar chamados' });
    }

    res.json(chamados);
  });
});

// Fechar chamado (protegido - apenas TI)
router.patch('/:id/fechar', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { analista } = req.body;

  if (!analista) {
    return res.status(400).json({ error: 'Nome do analista é obrigatório' });
  }

  db.run(
    `UPDATE chamados
     SET status = ?, data_fechamento = CURRENT_TIMESTAMP, analista = ?
     WHERE id = ?`,
    ['fechado', analista, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao fechar chamado' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      res.json({
        mensagem: 'Chamado fechado com sucesso',
        id: parseInt(id)
      });
    }
  );
});

module.exports = router;
