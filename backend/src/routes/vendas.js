const express = require('express');
const router = express.Router();
const VendasController = require('../controllers/vendasController');
const authMiddleware = require('../middlewares/auth');
const { validate, validateParams, Joi, schemas } = require('../middlewares/validation');

// Schema de validação para criar venda
const createVendaSchema = Joi.object({
  idCliente: Joi.number().integer().positive().required(),
  regiaoVenda: schemas.regiao.required(),
  dataVenda: Joi.date().iso().required(),
  produtos: Joi.array().items(
    Joi.object({
      idProduto: Joi.number().integer().positive().required(),
      quantidade: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});

// Schema de validação para importar vendas
const importVendasSchema = Joi.object({
  vendas: Joi.array().items(
    Joi.object({
      idCliente: Joi.number().integer().positive().required(),
      regiaoVenda: schemas.regiao.required(),
      dataVenda: Joi.date().iso().required(),
      produtos: Joi.array().items(
        Joi.object({
          idProduto: Joi.number().integer().positive().required(),
          quantidade: Joi.number().integer().min(1).required(),
        })
      ).min(1).required(),
    })
  ).min(1).required(),
});

// Rotas
router.get('/', authMiddleware, VendasController.index);
router.get('/:id', authMiddleware, validateParams(schemas.id), VendasController.show);
router.post('/', authMiddleware, validate(createVendaSchema), VendasController.create);
router.post('/import', authMiddleware, validate(importVendasSchema), VendasController.import);

module.exports = router;

