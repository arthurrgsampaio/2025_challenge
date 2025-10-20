const express = require('express');
const router = express.Router();
const ProdutosController = require('../controllers/produtosController');
const authMiddleware = require('../middlewares/auth');
const { validateParams, schemas } = require('../middlewares/validation');

// Rotas
router.get('/', authMiddleware, ProdutosController.index);
router.get('/:id', authMiddleware, validateParams(schemas.id), ProdutosController.show);

module.exports = router;

