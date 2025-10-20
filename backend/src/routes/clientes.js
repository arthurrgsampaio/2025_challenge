const express = require('express');
const router = express.Router();
const ClientesController = require('../controllers/clientesController');
const authMiddleware = require('../middlewares/auth');
const { validateParams, schemas } = require('../middlewares/validation');

// Rotas
router.get('/', authMiddleware, ClientesController.index);
router.get('/:id', authMiddleware, validateParams(schemas.id), ClientesController.show);

module.exports = router;

