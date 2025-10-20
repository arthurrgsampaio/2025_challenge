const { execute } = require('../config/database');

class Cliente {
  /**
   * Listar todos os clientes com filtros
   */
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        c.id_cliente as "idCliente",
        c.nome,
        c.sexo,
        c.idade,
        COUNT(v.id_venda) as "numeroVendas",
        NVL(SUM(v.total), 0) as "totalCompras"
      FROM clientes c
      LEFT JOIN vendas v ON c.id_cliente = v.id_cliente
      WHERE 1=1
    `;
    
    const binds = {};
    
    // Filtro por busca de nome
    if (filters.search) {
      sql += ` AND UPPER(c.nome) LIKE UPPER(:search)`;
      binds.search = `%${filters.search}%`;
    }
    
    // Filtro por sexo
    if (filters.sexo) {
      sql += ` AND c.sexo = :sexo`;
      binds.sexo = filters.sexo;
    }
    
    // Filtro por idade mínima
    if (filters.idadeMin) {
      sql += ` AND c.idade >= :idadeMin`;
      binds.idadeMin = filters.idadeMin;
    }
    
    // Filtro por idade máxima
    if (filters.idadeMax) {
      sql += ` AND c.idade <= :idadeMax`;
      binds.idadeMax = filters.idadeMax;
    }
    
    sql += `
      GROUP BY c.id_cliente, c.nome, c.sexo, c.idade
      ORDER BY c.nome
    `;
    
    const result = await execute(sql, binds);
    return result.rows;
  }
  
  /**
   * Buscar cliente por ID com estatísticas
   */
  static async findById(id) {
    const sql = `
      SELECT 
        c.id_cliente as "idCliente",
        c.nome,
        c.sexo,
        c.idade,
        COUNT(v.id_venda) as "numeroVendas",
        NVL(SUM(v.total), 0) as "totalCompras",
        NVL(AVG(v.total), 0) as "ticketMedio",
        MAX(v.data_venda) as "ultimaCompra"
      FROM clientes c
      LEFT JOIN vendas v ON c.id_cliente = v.id_cliente
      WHERE c.id_cliente = :id
      GROUP BY c.id_cliente, c.nome, c.sexo, c.idade
    `;
    
    const result = await execute(sql, { id });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const cliente = result.rows[0];
    
    // Buscar últimas vendas do cliente
    const vendasSql = `
      SELECT 
        id_venda as "idVenda",
        data_venda as "dataVenda",
        total,
        regiao_venda as "regiaoVenda"
      FROM vendas
      WHERE id_cliente = :id
      ORDER BY data_venda DESC
      FETCH FIRST 10 ROWS ONLY
    `;
    
    const vendasResult = await execute(vendasSql, { id });
    cliente.vendas = vendasResult.rows;
    
    return cliente;
  }
  
  /**
   * Verificar se cliente existe
   */
  static async exists(id) {
    const sql = `
      SELECT COUNT(*) as count
      FROM clientes
      WHERE id_cliente = :id
    `;
    
    const result = await execute(sql, { id });
    return result.rows[0].COUNT > 0;
  }
}

module.exports = Cliente;

