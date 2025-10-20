const { execute } = require('../config/database');

class Categoria {
  /**
   * Listar todas as categorias com estatísticas
   */
  static async findAll() {
    const sql = `
      SELECT 
        c.id_categoria as "idCategoria",
        c.nome_categoria as "nomeCategoria",
        COUNT(DISTINCT p.id_produto) as "totalProdutos",
        NVL(SUM(vp.subtotal), 0) as "totalVendido"
      FROM categorias c
      LEFT JOIN produtos p ON c.id_categoria = p.id_categoria
      LEFT JOIN venda_produtos vp ON p.id_produto = vp.id_produto
      GROUP BY c.id_categoria, c.nome_categoria
      ORDER BY c.nome_categoria
    `;
    
    const result = await execute(sql);
    return result.rows;
  }
  
  /**
   * Buscar categoria por ID
   */
  static async findById(id) {
    const sql = `
      SELECT 
        id_categoria as "idCategoria",
        nome_categoria as "nomeCategoria"
      FROM categorias
      WHERE id_categoria = :id
    `;
    
    const result = await execute(sql, { id });
    return result.rows[0] || null;
  }
  
  /**
   * Verificar se categoria existe
   */
  static async exists(id) {
    const sql = `
      SELECT COUNT(*) as count
      FROM categorias
      WHERE id_categoria = :id
    `;
    
    const result = await execute(sql, { id });
    return result.rows[0].COUNT > 0;
  }
}

module.exports = Categoria;

