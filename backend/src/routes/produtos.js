const express = require('express');
const router = express.Router();
const ProdutosController = require('../controllers/produtosController');
const authMiddleware = require('../middlewares/auth');
const { validate, validateParams, schemas, Joi } = require('../middlewares/validation');

// Schema de validação para criar produto
const createProdutoSchema = Joi.object({
  cdProduto: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Código do produto é obrigatório',
    'string.max': 'Código do produto deve ter no máximo 50 caracteres',
  }),
  nome: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
  }),
  precoUnitario: Joi.number().min(0).required().messages({
    'number.base': 'Preço unitário deve ser um número',
    'number.min': 'Preço unitário deve ser maior ou igual a 0',
  }),
  idCategoria: Joi.number().integer().positive().required().messages({
    'number.base': 'Categoria deve ser um número',
    'number.positive': 'Categoria inválida',
  }),
});

// Rotas
router.get('/', authMiddleware, ProdutosController.index);
router.get('/:id', authMiddleware, validateParams(schemas.id), ProdutosController.show);
router.post('/', authMiddleware, validate(createProdutoSchema), ProdutosController.create);

module.exports = router;

