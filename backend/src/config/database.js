const oracledb = require('oracledb');

// Configuração do Oracle Client
// Para usar Thick mode (recomendado para produção), descomente a linha abaixo
// e configure o caminho para o Oracle Instant Client
// oracledb.initOracleClient({ libDir: '/path/to/instantclient' });

// Configuração do pool de conexões
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionString: process.env.DB_CONNECTION_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
};

let pool;

/**
 * Inicializar pool de conexões
 */
async function initialize() {
  try {
    console.log('🔄 Conectando ao Oracle Database...');
    pool = await oracledb.createPool(dbConfig);
    console.log('✅ Pool de conexões criado com sucesso!');
    console.log(`📊 Pool: Min=${dbConfig.poolMin}, Max=${dbConfig.poolMax}`);
  } catch (err) {
    console.error('❌ Erro ao criar pool de conexões:', err);
    throw err;
  }
}

/**
 * Obter conexão do pool
 */
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error('Erro ao obter conexão:', err);
    throw err;
  }
}

/**
 * Executar query com bind parameters
 */
async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    
    const defaultOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: false,
    };
    
    const result = await connection.execute(
      sql,
      binds,
      { ...defaultOptions, ...options }
    );
    
    return result;
  } catch (err) {
    console.error('Erro ao executar query:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar conexão:', err);
      }
    }
  }
}

/**
 * Executar query com auto-commit
 */
async function executeAndCommit(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      sql,
      binds,
      { 
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        ...options 
      }
    );
    
    return result;
  } catch (err) {
    console.error('Erro ao executar query:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar conexão:', err);
      }
    }
  }
}

/**
 * Executar múltiplas queries em transação
 */
async function executeTransaction(callback) {
  let connection;
  try {
    connection = await getConnection();
    
    // Executar callback com a conexão
    const result = await callback(connection);
    
    // Commit da transação
    await connection.commit();
    
    return result;
  } catch (err) {
    // Rollback em caso de erro
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Erro ao fazer rollback:', rollbackErr);
      }
    }
    console.error('Erro na transação:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar conexão:', err);
      }
    }
  }
}

/**
 * Fechar pool de conexões
 */
async function close() {
  try {
    if (pool) {
      await pool.close(10);
      console.log('✅ Pool de conexões fechado');
    }
  } catch (err) {
    console.error('❌ Erro ao fechar pool:', err);
    throw err;
  }
}

/**
 * Verificar conexão com o banco
 */
async function testConnection() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT 1 FROM DUAL');
    console.log('✅ Conexão com o banco testada com sucesso');
    return true;
  } catch (err) {
    console.error('❌ Erro ao testar conexão:', err);
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Erro ao fechar conexão de teste:', err);
      }
    }
  }
}

module.exports = {
  initialize,
  getConnection,
  execute,
  executeAndCommit,
  executeTransaction,
  close,
  testConnection,
  oracledb, // Exportar para uso de constantes
};

