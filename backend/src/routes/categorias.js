const express = require('express');
const router = express.Router();
const CategoriasController = require('../controllers/categoriasController');
const authMiddleware = require('../middlewares/auth');

// Rotas
router.get('/', authMiddleware, CategoriasController.index);

module.exports = router;

