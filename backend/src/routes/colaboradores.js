const express = require('express');
const db = require('../database');

const router = express.Router();

// Buscar colaborador pelas 4 letras (Employee Number)
router.get('/:employeeNumber', (req, res) => {
  const { employeeNumber } = req.params;

  // Validar que tem 4 caracteres
  if (!employeeNumber || employeeNumber.length !== 4) {
    return res.status(400).json({
      error: 'Employee number deve ter 4 caracteres'
    });
  }

  db.get(
    `SELECT
      employee_number,
      full_name,
      first_name,
      last_name,
      organization_name,
      status,
      city,
      location_name,
      email,
      phone,
      function
    FROM colaboradores
    WHERE UPPER(employee_number) = UPPER(?)
    AND status = 'Active'`,
    [employeeNumber],
    (err, colaborador) => {
      if (err) {
        console.error('Erro ao buscar colaborador:', err);
        return res.status(500).json({ error: 'Erro ao buscar colaborador' });
      }

      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }

      res.json(colaborador);
    }
  );
});

// Listar todos os colaboradores ativos (opcional, para debug)
router.get('/', (req, res) => {
  db.all(
    `SELECT
      employee_number,
      full_name,
      function,
      organization_name
    FROM colaboradores
    WHERE status = 'Active'
    ORDER BY full_name`,
    [],
    (err, colaboradores) => {
      if (err) {
        console.error('Erro ao listar colaboradores:', err);
        return res.status(500).json({ error: 'Erro ao listar colaboradores' });
      }

      res.json(colaboradores);
    }
  );
});

module.exports = router;
