const express = require('express');
const router = express.Router();
const ClientesController = require('../controllers/clientesController');
const authMiddleware = require('../middlewares/auth');
const { validate, validateParams, schemas, Joi } = require('../middlewares/validation');

// Schema de validação para criar cliente
const createClienteSchema = Joi.object({
  nome: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
  }),
  sexo: Joi.string().valid('M', 'F', 'm', 'f').required().messages({
    'string.empty': 'Sexo é obrigatório',
    'any.only': 'Sexo deve ser M (Masculino) ou F (Feminino)',
  }),
  idade: Joi.number().integer().min(0).max(150).required().messages({
    'number.base': 'Idade deve ser um número',
    'number.min': 'Idade deve ser maior ou igual a 0',
    'number.max': 'Idade deve ser menor ou igual a 150',
  }),
});

// Rotas
router.get('/', authMiddleware, ClientesController.index);
router.get('/:id', authMiddleware, validateParams(schemas.id), ClientesController.show);
router.post('/', authMiddleware, validate(createClienteSchema), ClientesController.create);

module.exports = router;

