/**
 * Middleware de autenticação simples baseado em sessão
 */
function authMiddleware(req, res, next) {
  // Verificar se existe sessão com userId
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Você precisa estar autenticado para acessar este recurso',
    });
  }
  
  // Adicionar informações do usuário à requisição
  req.user = {
    id: req.session.userId,
    email: req.session.userEmail,
    nome: req.session.userName,
  };
  
  next();
}

module.exports = authMiddleware;

