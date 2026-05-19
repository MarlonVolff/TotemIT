const jwt = require('jsonwebtoken');

const SECRET_KEY = 'totem-secret-key-2024'; // Em produção, usar variável de ambiente

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { authMiddleware, SECRET_KEY };
