const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/auth');

// Rotas
router.get('/overview', authMiddleware, AnalyticsController.overview);
router.get('/vendas-por-mes', authMiddleware, AnalyticsController.vendasPorMes);
router.get('/vendas-por-regiao', authMiddleware, AnalyticsController.vendasPorRegiao);
router.get('/vendas-por-categoria', authMiddleware, AnalyticsController.vendasPorCategoria);
router.get('/vendas-por-genero', authMiddleware, AnalyticsController.vendasPorGenero);
router.get('/top-produtos', authMiddleware, AnalyticsController.topProdutos);

module.exports = router;

