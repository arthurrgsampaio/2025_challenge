const { execute, executeAndCommit } = require('../config/database');
const { v4: uuidv4 } = require('crypto').randomUUID ? require('crypto') : require('uuid');

class Usuario {
  /**
   * Criar novo usuário
   */
  static async create({ nome, email, password }) {
    const id = uuidv4();
    
    const sql = `
      INSERT INTO usuarios (id, nome, email, password)
      VALUES (:id, :nome, :email, :password)
    `;
    
    await executeAndCommit(sql, {
      id,
      nome,
      email: email.toLowerCase(),
      password, // Já deve vir hasheado do controller
    });
    
    return { id, nome, email: email.toLowerCase() };
  }
  
  /**
   * Buscar usuário por email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT id, nome, email, password, created_at, updated_at
      FROM usuarios
      WHERE LOWER(email) = LOWER(:email)
    `;
    
    const result = await execute(sql, { email });
    
    return result.rows[0] || null;
  }
  
  /**
   * Buscar usuário por ID
   */
  static async findById(id) {
    const sql = `
      SELECT id, nome, email, created_at, updated_at
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
      WHERE LOWER(email) = LOWER(:email)
    `;
    
    const result = await execute(sql, { email });
    
    return result.rows[0].COUNT > 0;
  }
  
  /**
   * Atualizar usuário
   */
  static async update(id, { nome, email }) {
    const sql = `
      UPDATE usuarios
      SET nome = :nome,
          email = :email,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
    `;
    
    await executeAndCommit(sql, {
      id,
      nome,
      email: email.toLowerCase(),
    });
    
    return this.findById(id);
  }
  
  /**
   * Deletar usuário
   */
  static async delete(id) {
    const sql = `DELETE FROM usuarios WHERE id = :id`;
    
    await executeAndCommit(sql, { id });
  }
}

module.exports = Usuario;

