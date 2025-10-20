const { execute } = require('../config/database');

class AnalyticsController {
  /**
   * Visão geral do dashboard
   * GET /api/analytics/overview
   */
  static async overview(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { dataInicio, dataFim } = req.query;
      
      let sql = `
        SELECT 
          NVL(SUM(total), 0) as "totalVendas",
          COUNT(*) as "totalTransacoes",
          NVL(AVG(total), 0) as "ticketMedio",
          COUNT(DISTINCT id_cliente) as "totalClientes"
        FROM vendas
        WHERE id_usuario = :idUsuario
      `;
      
      const binds = { idUsuario };
      
      if (dataInicio) {
        sql += ` AND data_venda >= :dataInicio`;
        binds.dataInicio = dataInicio;
      }
      
      if (dataFim) {
        sql += ` AND data_venda <= :dataFim`;
        binds.dataFim = dataFim;
      }
      
      const result = await execute(sql, binds);
      
      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Vendas por mês
   * GET /api/analytics/vendas-por-mes
   */
  static async vendasPorMes(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const meses = parseInt(req.query.meses) || 12;
      
      const sql = `
        SELECT 
          TO_CHAR(data_venda, 'MM/YYYY') as mes,
          TO_CHAR(data_venda, 'TMMonth', 'NLS_DATE_LANGUAGE=PORTUGUESE') as "mesNome",
          EXTRACT(YEAR FROM data_venda) as ano,
          NVL(SUM(total), 0) as total,
          COUNT(*) as quantidade,
          NVL(AVG(total), 0) as "ticketMedio"
        FROM vendas
        WHERE id_usuario = :idUsuario
          AND data_venda >= ADD_MONTHS(SYSDATE, -:meses)
        GROUP BY 
          TO_CHAR(data_venda, 'MM/YYYY'),
          TO_CHAR(data_venda, 'TMMonth', 'NLS_DATE_LANGUAGE=PORTUGUESE'),
          EXTRACT(YEAR FROM data_venda),
          TRUNC(data_venda, 'MM')
        ORDER BY TRUNC(data_venda, 'MM')
      `;
      
      const result = await execute(sql, { idUsuario, meses });
      
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Vendas por região
   * GET /api/analytics/vendas-por-regiao
   */
  static async vendasPorRegiao(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { dataInicio, dataFim } = req.query;
      
      let sql = `
        SELECT 
          regiao_venda as regiao,
          NVL(SUM(total), 0) as total,
          COUNT(*) as quantidade,
          ROUND(
            (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vendas WHERE id_usuario = :idUsuario)),
            2
          ) as percentual
        FROM vendas
        WHERE id_usuario = :idUsuario
      `;
      
      const binds = { idUsuario };
      
      if (dataInicio) {
        sql += ` AND data_venda >= :dataInicio`;
        binds.dataInicio = dataInicio;
      }
      
      if (dataFim) {
        sql += ` AND data_venda <= :dataFim`;
        binds.dataFim = dataFim;
      }
      
      sql += `
        GROUP BY regiao_venda
        ORDER BY total DESC
      `;
      
      const result = await execute(sql, binds);
      
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Vendas por categoria
   * GET /api/analytics/vendas-por-categoria
   */
  static async vendasPorCategoria(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { dataInicio, dataFim } = req.query;
      
      let sql = `
        SELECT 
          c.id_categoria as "idCategoria",
          c.nome_categoria as categoria,
          NVL(SUM(vp.subtotal), 0) as total,
          NVL(SUM(vp.quantidade), 0) as quantidade,
          ROUND(
            (NVL(SUM(vp.subtotal), 0) * 100.0 / 
             NULLIF((SELECT SUM(total) FROM vendas WHERE id_usuario = :idUsuario), 0)),
            2
          ) as percentual
        FROM categorias c
        LEFT JOIN venda_produtos vp ON c.id_categoria = vp.id_categoria
        LEFT JOIN vendas v ON vp.id_venda = v.id_venda AND v.id_usuario = :idUsuario
        WHERE 1=1
      `;
      
      const binds = { idUsuario };
      
      if (dataInicio) {
        sql += ` AND v.data_venda >= :dataInicio`;
        binds.dataInicio = dataInicio;
      }
      
      if (dataFim) {
        sql += ` AND v.data_venda <= :dataFim`;
        binds.dataFim = dataFim;
      }
      
      sql += `
        GROUP BY c.id_categoria, c.nome_categoria
        ORDER BY total DESC
      `;
      
      const result = await execute(sql, binds);
      
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Vendas por gênero
   * GET /api/analytics/vendas-por-genero
   */
  static async vendasPorGenero(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { dataInicio, dataFim } = req.query;
      
      let sql = `
        SELECT 
          CASE 
            WHEN sexo_cliente = 'M' THEN 'Masculino'
            WHEN sexo_cliente = 'F' THEN 'Feminino'
          END as genero,
          sexo_cliente as sexo,
          NVL(SUM(total), 0) as total,
          COUNT(*) as quantidade,
          NVL(AVG(total), 0) as "ticketMedio",
          ROUND(
            (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vendas WHERE id_usuario = :idUsuario)),
            2
          ) as percentual
        FROM vendas
        WHERE id_usuario = :idUsuario
      `;
      
      const binds = { idUsuario };
      
      if (dataInicio) {
        sql += ` AND data_venda >= :dataInicio`;
        binds.dataInicio = dataInicio;
      }
      
      if (dataFim) {
        sql += ` AND data_venda <= :dataFim`;
        binds.dataFim = dataFim;
      }
      
      sql += `
        GROUP BY sexo_cliente
        ORDER BY total DESC
      `;
      
      const result = await execute(sql, binds);
      
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Top produtos mais vendidos
   * GET /api/analytics/top-produtos
   */
  static async topProdutos(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const limite = parseInt(req.query.limite) || 10;
      const { dataInicio, dataFim } = req.query;
      
      let sql = `
        SELECT 
          p.id_produto as "idProduto",
          p.nome,
          c.nome_categoria as categoria,
          NVL(SUM(vp.quantidade), 0) as "quantidadeVendida",
          NVL(SUM(vp.subtotal), 0) as "totalVendido"
        FROM produtos p
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN venda_produtos vp ON p.id_produto = vp.id_produto
        LEFT JOIN vendas v ON vp.id_venda = v.id_venda AND v.id_usuario = :idUsuario
        WHERE 1=1
      `;
      
      const binds = { idUsuario, limite };
      
      if (dataInicio) {
        sql += ` AND v.data_venda >= :dataInicio`;
        binds.dataInicio = dataInicio;
      }
      
      if (dataFim) {
        sql += ` AND v.data_venda <= :dataFim`;
        binds.dataFim = dataFim;
      }
      
      sql += `
        GROUP BY p.id_produto, p.nome, c.nome_categoria
        ORDER BY "totalVendido" DESC
        FETCH FIRST :limite ROWS ONLY
      `;
      
      const result = await execute(sql, binds);
      
      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;

