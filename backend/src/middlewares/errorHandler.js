/**
 * Middleware global de tratamento de erros
 */
function errorHandler(err, req, res, next) {
  console.error('❌ ============================================');
  console.error('❌ ERRO CAPTURADO');
  console.error('❌ ============================================');
  console.error('❌ Rota:', req.method, req.originalUrl);
  console.error('❌ Tipo de erro:', err.name);
  console.error('❌ Mensagem:', err.message);
  console.error('❌ Stack:', err.stack);
  console.error('❌ ============================================');
  
  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }
  
  // Erro do Oracle Database
  if (err.errorNum) {
    // Violação de constraint única
    if (err.errorNum === 1) {
      return res.status(409).json({
        success: false,
        message: 'Registro duplicado',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
    
    // Violação de foreign key
    if (err.errorNum === 2291) {
      return res.status(400).json({
        success: false,
        message: 'Referência inválida',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    }
    
    // Erro genérico de banco de dados
    return res.status(500).json({
      success: false,
      message: 'Erro no banco de dados',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
  
  // Erro HTTP customizado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || undefined,
    });
  }
  
  // Erro genérico
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

/**
 * Criar erro HTTP customizado
 */
class HttpError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Middleware para rotas não encontradas
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`,
  });
}

module.exports = {
  errorHandler,
  HttpError,
  notFoundHandler,
};

