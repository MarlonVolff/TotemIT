const express = require('express');
const db = require('../database');

const router = express.Router();

// Buscar colaborador pelas 4 letras (Employee Number)
router.get('/:employeeNumber', async (req, res) => {
  const { employeeNumber } = req.params;

  // Validar que tem 4 caracteres
  if (!employeeNumber || employeeNumber.length !== 4) {
    return res.status(400).json({
      error: 'Employee number deve ter 4 caracteres'
    });
  }

  try {
    const result = await db.query(
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
      WHERE UPPER(employee_number) = UPPER($1)
      AND status = 'Active'`,
      [employeeNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar colaborador:', err);
    return res.status(500).json({ error: 'Erro ao buscar colaborador' });
  }
});

// Listar todos os colaboradores ativos (opcional, para debug)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        employee_number,
        full_name,
        function,
        organization_name
      FROM colaboradores
      WHERE status = 'Active'
      ORDER BY full_name`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar colaboradores:', err);
    return res.status(500).json({ error: 'Erro ao listar colaboradores' });
  }
});

module.exports = router;
