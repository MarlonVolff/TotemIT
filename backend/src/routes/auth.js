const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authMiddleware, SECRET_KEY } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM usuarios_ti WHERE usuario = ?',
    [usuario],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const senhaValida = bcrypt.compareSync(senha, user.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const token = jwt.sign(
        { id: user.id, usuario: user.usuario },
        SECRET_KEY,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        usuario: user.usuario
      });
    }
  );
});

// Verificar token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valido: true, usuario: req.usuario });
});

module.exports = router;
