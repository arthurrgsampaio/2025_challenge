require('dotenv').config();
const app = require('./app');
const database = require('./config/database');

const PORT = process.env.PORT || 3000;

/**
 * Inicializar servidor
 */
async function startServer() {
  try {
    // Conectar ao banco de dados
    await database.initialize();
    
    // Testar conexão
    const connected = await database.testConnection();
    
    if (!connected) {
      throw new Error('Falha ao conectar com o banco de dados');
    }
    
    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log('==============================================');
      console.log('🚀 StarSales API');
      console.log('==============================================');
      console.log(`📡 Servidor rodando em: http://localhost:${PORT}`);
      console.log(`💾 Banco: Oracle Database`);
      console.log('==============================================');
      console.log('');
      console.log('Endpoints disponíveis:');
      console.log(`  GET  /health - Health check`);
      console.log(`  POST /api/v1/auth/register - Cadastrar usuário`);
      console.log(`  POST /api/v1/auth/login - Login`);
      console.log(`  GET  /api/v1/auth/me - Validar token`);
      console.log(`  GET  /api/v1/vendas - Listar vendas`);
      console.log(`  POST /api/v1/vendas - Criar venda`);
      console.log(`  GET  /api/v1/clientes - Listar clientes`);
      console.log(`  GET  /api/v1/produtos - Listar produtos`);
      console.log(`  GET  /api/v1/categorias - Listar categorias`);
      console.log(`  GET  /api/v1/analytics/overview - Estatísticas gerais`);
      console.log('');
      console.log('==============================================');
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('');
      console.log('⚠️  SIGTERM recebido, encerrando servidor...');
      
      server.close(async () => {
        console.log('📴 Servidor HTTP encerrado');
        
        try {
          await database.close();
          console.log('✅ Pool de conexões fechado');
          process.exit(0);
        } catch (err) {
          console.error('❌ Erro ao fechar pool:', err);
          process.exit(1);
        }
      });
    });
    
    process.on('SIGINT', () => {
      console.log('');
      console.log('⚠️  SIGINT recebido, encerrando servidor...');
      
      server.close(async () => {
        console.log('📴 Servidor HTTP encerrado');
        
        try {
          await database.close();
          console.log('✅ Pool de conexões fechado');
          process.exit(0);
        } catch (err) {
          console.error('❌ Erro ao fechar pool:', err);
          process.exit(1);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

