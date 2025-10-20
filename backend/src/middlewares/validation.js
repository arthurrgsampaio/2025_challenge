const Joi = require('joi');

/**
 * Middleware de validação usando Joi
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Retornar todos os erros, não apenas o primeiro
      stripUnknown: true, // Remover campos não especificados no schema
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    
    // Substituir req.body pelo value validado
    req.body = value;
    next();
  };
}

/**
 * Validar query parameters
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação nos parâmetros',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    
    req.query = value;
    next();
  };
}

/**
 * Validar params da URL
 */
function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Erro de validação nos parâmetros da URL',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    
    req.params = value;
    next();
  };
}

// Schemas de validação reutilizáveis
const schemas = {
  // Validação de ID numérico
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
  
  // Validação de paginação
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
  }),
  
  // Validação de filtro de data
  dateFilter: Joi.object({
    dataInicio: Joi.date().iso(),
    dataFim: Joi.date().iso().min(Joi.ref('dataInicio')),
  }),
  
  // Regiões válidas
  regiao: Joi.string().valid('Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'),
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas,
  Joi,
};

