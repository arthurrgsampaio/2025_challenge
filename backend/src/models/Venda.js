const { execute, executeTransaction, oracledb } = require('../config/database');

class Venda {
  static async create(vendaData, idUsuario) {
    return executeTransaction(async (connection) => {
      const vendaSql = `
        INSERT INTO vendas (
          id_usuario, id_cliente, nome_cliente, sexo_cliente, idade_cliente,
          regiao_venda, data_venda, total
        ) VALUES (
          :idUsuario, :idCliente, :nomeCliente, :sexoCliente, :idadeCliente,
          :regiaoVenda, :dataVenda, :total
        ) RETURNING id_venda INTO :idVenda
      `;
      
      const vendaBinds = {
        idUsuario,
        idCliente: vendaData.idCliente,
        nomeCliente: vendaData.nomeCliente,
        sexoCliente: vendaData.sexoCliente,
        idadeCliente: vendaData.idadeCliente,
        regiaoVenda: vendaData.regiaoVenda,
        dataVenda: vendaData.dataVenda,
        total: vendaData.total,
        idVenda: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      };
      
      const vendaResult = await connection.execute(vendaSql, vendaBinds);
      const idVenda = vendaResult.outBinds.idVenda[0];
      
      const produtoSql = `
        INSERT INTO venda_produtos (
          id_venda, id_produto, nome_produto, quantidade,
          preco_unitario, id_categoria, subtotal
        ) VALUES (
          :idVenda, :idProduto, :nomeProduto, :quantidade,
          :precoUnitario, :idCategoria, :subtotal
        )
      `;
      
      for (const produto of vendaData.produtos) {
        const produtoBinds = {
          idVenda,
          idProduto: produto.idProduto,
          nomeProduto: produto.nomeProduto,
          quantidade: produto.quantidade,
          precoUnitario: produto.precoUnitario,
          idCategoria: produto.idCategoria,
          subtotal: produto.quantidade * produto.precoUnitario,
        };
        
        await connection.execute(produtoSql, produtoBinds);
      }
      
      return { idVenda, total: vendaData.total };
    });
  }
  
  static async findAll(idUsuario, filters = {}) {
    let sql = `
      SELECT 
        v.id_venda as "idVenda",
        v.id_cliente as "idCliente",
        v.nome_cliente as "nomeCliente",
        v.sexo_cliente as "sexoCliente",
        v.idade_cliente as "idadeCliente",
        v.regiao_venda as "regiaoVenda",
        v.data_venda as "dataVenda",
        v.total as "total",
        v.created_at as "createdAt"
      FROM vendas v
      WHERE v.id_usuario = :idUsuario
    `;
    
    const binds = { idUsuario };
    
    if (filters.dataInicio) {
      sql += ` AND v.data_venda >= :dataInicio`;
      binds.dataInicio = filters.dataInicio;
    }
    
    if (filters.dataFim) {
      sql += ` AND v.data_venda <= :dataFim`;
      binds.dataFim = filters.dataFim;
    }
    
    if (filters.regiao) {
      sql += ` AND v.regiao_venda = :regiao`;
      binds.regiao = filters.regiao;
    }
    
    if (filters.idCliente) {
      sql += ` AND v.id_cliente = :idCliente`;
      binds.idCliente = filters.idCliente;
    }
    
    if (filters.idCategoria) {
      sql += ` AND EXISTS (
        SELECT 1 FROM venda_produtos vp
        WHERE vp.id_venda = v.id_venda
        AND vp.id_categoria = :idCategoria
      )`;
      binds.idCategoria = filters.idCategoria;
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;
    
    sql += ` ORDER BY v.data_venda DESC`;
    sql += ` OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
    
    binds.offset = offset;
    binds.limit = limit;
    
    const result = await execute(sql, binds);
    const vendas = result.rows;
    
    if (vendas.length > 0) {
      const vendasIds = vendas.map(v => v.idVenda);
      const produtosSql = `
        SELECT 
          id_venda as "idVenda",
          id_produto as "idProduto",
          nome_produto as "nomeProduto",
          quantidade as "quantidade",
          preco_unitario as "precoUnitario",
          id_categoria as "idCategoria",
          subtotal as "subtotal"
        FROM venda_produtos
        WHERE id_venda IN (${vendasIds.map((_, i) => `:id${i}`).join(',')})
        ORDER BY id_venda, id_produto
      `;
      
      const produtosBinds = {};
      vendasIds.forEach((id, i) => {
        produtosBinds[`id${i}`] = id;
      });
      
      const produtosResult = await execute(produtosSql, produtosBinds);
      const produtosPorVenda = {};
      
      produtosResult.rows.forEach(produto => {
        if (!produtosPorVenda[produto.idVenda]) {
          produtosPorVenda[produto.idVenda] = [];
        }
        produtosPorVenda[produto.idVenda].push({
          idProduto: produto.idProduto,
          nomeProduto: produto.nomeProduto,
          quantidade: produto.quantidade,
          precoUnitario: produto.precoUnitario,
          idCategoria: produto.idCategoria,
          subtotal: produto.subtotal,
        });
      });
      
      vendas.forEach(venda => {
        venda.produtos = produtosPorVenda[venda.idVenda] || [];
      });
    }
    
    let countSql = `
      SELECT COUNT(*) as count
      FROM vendas v
      WHERE v.id_usuario = :idUsuario
    `;
    
    const countBinds = { idUsuario };
    
    if (filters.dataInicio) {
      countSql += ` AND v.data_venda >= :dataInicio`;
      countBinds.dataInicio = filters.dataInicio;
    }
    if (filters.dataFim) {
      countSql += ` AND v.data_venda <= :dataFim`;
      countBinds.dataFim = filters.dataFim;
    }
    if (filters.regiao) {
      countSql += ` AND v.regiao_venda = :regiao`;
      countBinds.regiao = filters.regiao;
    }
    if (filters.idCliente) {
      countSql += ` AND v.id_cliente = :idCliente`;
      countBinds.idCliente = filters.idCliente;
    }
    if (filters.idCategoria) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM venda_produtos vp
        WHERE vp.id_venda = v.id_venda
        AND vp.id_categoria = :idCategoria
      )`;
      countBinds.idCategoria = filters.idCategoria;
    }
    
    const countResult = await execute(countSql, countBinds);
    const total = countResult.rows[0].COUNT;
    
    return {
      vendas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  static async findById(idVenda, idUsuario) {
    const sql = `
      SELECT 
        v.id_venda as "idVenda",
        v.id_cliente as "idCliente",
        v.nome_cliente as "nomeCliente",
        v.sexo_cliente as "sexoCliente",
        v.idade_cliente as "idadeCliente",
        v.regiao_venda as "regiaoVenda",
        v.data_venda as "dataVenda",
        v.total as "total",
        v.created_at as "createdAt",
        v.updated_at as "updatedAt"
      FROM vendas v
      WHERE v.id_venda = :idVenda
        AND v.id_usuario = :idUsuario
    `;
    
    const result = await execute(sql, { idVenda, idUsuario });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const venda = result.rows[0];
    
    const produtosSql = `
      SELECT 
        id_produto as "idProduto",
        nome_produto as "nomeProduto",
        quantidade as "quantidade",
        preco_unitario as "precoUnitario",
        id_categoria as "idCategoria",
        subtotal as "subtotal"
      FROM venda_produtos
      WHERE id_venda = :idVenda
      ORDER BY id_produto
    `;
    
    const produtosResult = await execute(produtosSql, { idVenda });
    venda.produtos = produtosResult.rows;
    
    return venda;
  }
  
  static async importMany(vendasData, idUsuario) {
    const vendasImportadas = [];
    const erros = [];
    
    for (let i = 0; i < vendasData.length; i++) {
      try {
        const venda = vendasData[i];
        const result = await this.create(venda, idUsuario);
        vendasImportadas.push(result.idVenda);
      } catch (error) {
        erros.push({
          linha: i + 1,
          venda: vendasData[i],
          erro: error.message,
        });
      }
    }
    
    return {
      quantidade: vendasImportadas.length,
      vendasImportadas,
      erros,
    };
  }
}

module.exports = Venda;

