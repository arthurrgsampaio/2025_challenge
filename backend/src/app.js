const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
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

// CORS - Permitir frontend local em múltiplas portas com cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Importante para sessões
}));

console.log('✅ CORS configurado para aceitar requisições de:');
console.log('   - http://localhost:5173');
console.log('   - http://localhost:3000');
console.log('   - http://127.0.0.1:5173');
console.log('   - http://127.0.0.1:3000');

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'starsales-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Logging
app.use(morgan('combined'));

// Log de todas as requisições
app.use((req, res, next) => {
  console.log('');
  console.log('📨 ============================================');
  console.log('📨 NOVA REQUISIÇÃO');
  console.log('📨 ============================================');
  console.log('📨 Método:', req.method);
  console.log('📨 URL:', req.originalUrl);
  console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyLog = { ...req.body };
    if (bodyLog.password) bodyLog.password = '***';
    console.log('📨 Body:', JSON.stringify(bodyLog, null, 2));
  }
  console.log('📨 ============================================');
  console.log('');
  next();
});

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

