const { execute, executeAndCommit } = require('../config/database');

class Usuario {
  /**
   * Criar novo usuário
   */
  static async create({ nome, email, senha }) {
    const sql = `
      INSERT INTO usuarios (id, nome, email, password, created_at, updated_at)
      VALUES (SYS_GUID(), :nome, :email, :senha, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    await executeAndCommit(sql, { nome, email, senha });
    
    return { nome, email };
  }
  
  /**
   * Buscar usuário por email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT 
        id as "id",
        nome as "nome",
        email as "email",
        password as "senha"
      FROM usuarios
      WHERE email = :email
    `;
    
    const result = await execute(sql, { email });
    
    return result.rows[0] || null;
  }
  
  /**
   * Buscar usuário por ID
   */
  static async findById(id) {
    const sql = `
      SELECT 
        id as "id",
        nome as "nome",
        email as "email"
      FROM usuarios
      WHERE id = :id
    `;
    
    const result = await execute(sql, { id });
    
    return result.rows[0] || null;
  }
  
  /**
   * Verificar se email já existe
   */
  static async existsByEmail(email) {
    const sql = `
      SELECT COUNT(*) as count
      FROM usuarios
      WHERE email = :email
    `;
    
    const result = await execute(sql, { email });
    
    return result.rows[0].COUNT > 0;
  }
}

module.exports = Usuario;

