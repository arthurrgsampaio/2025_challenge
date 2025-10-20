const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Importar rotas
const authRoutes = require('./routes/auth');
const vendasRoutes = require('./routes/vendas');
const clientesRoutes = require('./routes/clientes');
const produtosRoutes = require('./routes/produtos');
const categoriasRoutes = require('./routes/categorias');
const analyticsRoutes = require('./routes/analytics');

// Criar aplicação Express
const app = express();

// =====================================================
// Middlewares Globais
// =====================================================

// Helmet - Segurança
app.use(helmet());

// CORS - Permitir apenas frontend local
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Rate limit mais restritivo para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
  skipSuccessfulRequests: true,
});

// =====================================================
// Rotas
// =====================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API StarSales está rodando!',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/vendas', vendasRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/produtos', produtosRoutes);
app.use('/api/v1/categorias', categoriasRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API StarSales Dashboard',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      vendas: '/api/v1/vendas',
      clientes: '/api/v1/clientes',
      produtos: '/api/v1/produtos',
      categorias: '/api/v1/categorias',
      analytics: '/api/v1/analytics',
    },
  });
});

// =====================================================
// Tratamento de Erros
// =====================================================

// Rota não encontrada
app.use(notFoundHandler);

// Handler global de erros
app.use(errorHandler);

module.exports = app;

