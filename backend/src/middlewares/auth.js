const { verifyToken } = require('../config/jwt');

/**
 * Middleware de autenticação JWT
 */
function authMiddleware(req, res, next) {
  try {
    // Obter token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
    }
    
    // Formato esperado: "Bearer {token}"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Use: Bearer {token}',
      });
    }
    
    const token = parts[1];
    
    // Verificar e decodificar token
    const decoded = verifyToken(token);
    
    // Adicionar informações do usuário à requisição
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente.',
      });
    }
    
    if (error.message === 'Token inválido') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Erro ao verificar token',
    });
  }
}

module.exports = authMiddleware;

