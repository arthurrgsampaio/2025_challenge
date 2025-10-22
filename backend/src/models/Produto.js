const { execute } = require('../config/database');

class Produto {
  /**
   * Criar novo produto
   */
  static async create({ cdProduto, nome, precoUnitario, idCategoria }) {
    const sql = `
      INSERT INTO produtos (cd_produto, nome, preco_unitario, id_categoria)
      VALUES (:cdProduto, :nome, :precoUnitario, :idCategoria)
      RETURNING id_produto INTO :idProduto
    `;
    
    const binds = {
      cdProduto,
      nome,
      precoUnitario,
      idCategoria,
      idProduto: { dir: require('../config/database').oracledb.BIND_OUT, type: require('../config/database').oracledb.NUMBER },
    };
    
    const result = await require('../config/database').executeTransaction(async (connection) => {
      const res = await connection.execute(sql, binds);
      await connection.commit();
      return res;
    });
    
    return {
      idProduto: result.outBinds.idProduto[0],
      cdProduto,
      nome,
      precoUnitario,
      idCategoria,
    };
  }

  /**
   * Listar todos os produtos com filtros
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        p.id_produto as "idProduto",
        p.cd_produto as "cdProduto",
        p.nome as "nome",
        p.preco_unitario as "precoUnitario",
        p.id_categoria as "idCategoria",
        c.nome_categoria as "nomeCategoria",
        NVL(SUM(vp.quantidade), 0) as "quantidadeVendida",
        NVL(SUM(vp.subtotal), 0) as "totalVendido"
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN venda_produtos vp ON p.id_produto = vp.id_produto
      WHERE 1=1
    `;
    
    const binds = {};
    
    // Filtro por busca de nome
    if (filters.search) {
      sql += ` AND UPPER(p.nome) LIKE UPPER(:search)`;
      binds.search = `%${filters.search}%`;
    }
    
    // Filtro por categoria
    if (filters.idCategoria) {
      sql += ` AND p.id_categoria = :idCategoria`;
      binds.idCategoria = filters.idCategoria;
    }
    
    // Filtro por preço mínimo
    if (filters.precoMin) {
      sql += ` AND p.preco_unitario >= :precoMin`;
      binds.precoMin = filters.precoMin;
    }
    
    // Filtro por preço máximo
    if (filters.precoMax) {
      sql += ` AND p.preco_unitario <= :precoMax`;
      binds.precoMax = filters.precoMax;
    }
    
    sql += `
      GROUP BY p.id_produto, p.cd_produto, p.nome, p.preco_unitario, 
               p.id_categoria, c.nome_categoria
      ORDER BY p.nome
    `;
    
    const result = await execute(sql, binds);
    return result.rows;
  }
  
  /**
   * Buscar produto por ID com estatísticas
   */
  static async findById(id) {
    const sql = `
      SELECT 
        p.id_produto as "idProduto",
        p.cd_produto as "cdProduto",
        p.nome as "nome",
        p.preco_unitario as "precoUnitario",
        p.id_categoria as "idCategoria",
        c.nome_categoria as "nomeCategoria",
        NVL(SUM(vp.quantidade), 0) as "quantidadeVendida",
        NVL(SUM(vp.subtotal), 0) as "totalVendido"
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN venda_produtos vp ON p.id_produto = vp.id_produto
      WHERE p.id_produto = :id
      GROUP BY p.id_produto, p.cd_produto, p.nome, p.preco_unitario,
               p.id_categoria, c.nome_categoria
    `;
    
    const result = await execute(sql, { id });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const produto = result.rows[0];
    
    // Buscar vendas recentes deste produto
    const vendasSql = `
      SELECT 
        v.id_venda as "idVenda",
        v.data_venda as "dataVenda",
        vp.quantidade,
        vp.subtotal
      FROM venda_produtos vp
      JOIN vendas v ON vp.id_venda = v.id_venda
      WHERE vp.id_produto = :id
      ORDER BY v.data_venda DESC
      FETCH FIRST 10 ROWS ONLY
    `;
    
    const vendasResult = await execute(vendasSql, { id });
    produto.vendas = vendasResult.rows;
    
    return produto;
  }
  
  /**
   * Verificar se produto existe
   */
  static async exists(id) {
    const sql = `
      SELECT COUNT(*) as count
      FROM produtos
      WHERE id_produto = :id
    `;
    
    const result = await execute(sql, { id });
    return result.rows[0].COUNT > 0;
  }
  
  /**
   * Buscar múltiplos produtos por IDs
   */
  static async findByIds(ids) {
    if (ids.length === 0) return [];
    
    const placeholders = ids.map((_, i) => `:id${i}`).join(',');
    const binds = {};
    ids.forEach((id, i) => {
      binds[`id${i}`] = id;
    });
    
    const sql = `
      SELECT 
        id_produto as "idProduto",
        cd_produto as "cdProduto",
        nome as "nome",
        preco_unitario as "precoUnitario",
        id_categoria as "idCategoria"
      FROM produtos
      WHERE id_produto IN (${placeholders})
    `;
    
    const result = await execute(sql, binds);
    return result.rows;
  }
}

module.exports = Produto;

