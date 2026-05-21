const express = require('express');
const router = express.Router();
const db = require('../database');

// Endpoint para Power Automate consultar novos chamados (não notificados)
router.get('/pending', (req, res) => {
  const query = `
    SELECT * FROM equipment_requests
    WHERE notified = 0 AND status = 'Aberto'
    ORDER BY created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Formatar para o Power Automate
    const notifications = rows.map(row => ({
      id: row.id,
      employeeName: row.employee_name,
      employeeCode: row.employee_code,
      equipment: row.equipment,
      team: row.team,
      observation: row.observation,
      createdAt: row.created_at,
      // Mensagem formatada para o Teams
      message: `🔔 **Novo Chamado de Equipamento**\n\n` +
               `**Solicitado por:** ${row.employee_name} (${row.employee_code})\n` +
               `**Equipamento:** ${row.equipment}\n` +
               `**Equipe/Setor:** ${row.team}\n` +
               `**ID do Chamado:** ${row.id}\n` +
               `**Horário:** ${new Date(row.created_at).toLocaleString('pt-BR')}\n\n` +
               (row.observation ? `**Observação:** ${row.observation}\n\n` : '') +
               `[Acessar Painel Administrativo](http://localhost:5173/admin)`
    }));

    res.json({
      count: notifications.length,
      notifications: notifications
    });
  });
});

// Endpoint para marcar como notificado (Power Automate chama após enviar)
router.post('/mark-notified/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE equipment_requests SET notified = 1 WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      res.json({
        success: true,
        message: 'Chamado marcado como notificado',
        id: id
      });
    }
  );
});

// Marcar múltiplos como notificados de uma vez
router.post('/mark-notified-bulk', (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'IDs inválidos' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE equipment_requests SET notified = 1 WHERE id IN (${placeholders})`;

  db.run(query, ids, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      success: true,
      message: `${this.changes} chamados marcados como notificados`,
      count: this.changes
    });
  });
});

// Resetar notificações (útil para testes)
router.post('/reset-notifications', (req, res) => {
  db.run('UPDATE equipment_requests SET notified = 0', function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      success: true,
      message: `${this.changes} notificações resetadas`,
      count: this.changes
    });
  });
});

module.exports = router;
