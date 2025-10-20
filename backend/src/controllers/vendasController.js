const Venda = require('../models/Venda');
const Cliente = require('../models/Cliente');
const Produto = require('../models/Produto');
const { HttpError } = require('../middlewares/errorHandler');

class VendasController {
  /**
   * Listar vendas
   * GET /api/vendas
   */
  static async index(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const filters = {
        dataInicio: req.query.dataInicio,
        dataFim: req.query.dataFim,
        regiao: req.query.regiao,
        idCliente: req.query.idCliente,
        idCategoria: req.query.idCategoria,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50,
      };
      
      const result = await Venda.findAll(idUsuario, filters);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Obter detalhes de uma venda
   * GET /api/vendas/:id
   */
  static async show(req, res, next) {
    try {
      const idVenda = parseInt(req.params.id);
      const idUsuario = req.user.id;
      
      const venda = await Venda.findById(idVenda, idUsuario);
      
      if (!venda) {
        throw new HttpError(404, 'Venda não encontrada');
      }
      
      res.json({
        success: true,
        data: venda,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Criar nova venda
   * POST /api/vendas
   */
  static async create(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { idCliente, regiaoVenda, dataVenda, produtos } = req.body;
      
      // Validar que há pelo menos um produto
      if (!produtos || produtos.length === 0) {
        throw new HttpError(400, 'Adicione pelo menos um produto', [{
          field: 'produtos',
          message: 'A venda deve ter pelo menos um produto',
        }]);
      }
      
      // Verificar se cliente existe
      const clienteExists = await Cliente.exists(idCliente);
      if (!clienteExists) {
        throw new HttpError(400, 'Cliente não encontrado', [{
          field: 'idCliente',
          message: 'O cliente informado não existe',
        }]);
      }
      
      // Buscar dados completos do cliente
      const cliente = await Cliente.findById(idCliente);
      
      // Buscar dados completos dos produtos
      const produtoIds = produtos.map(p => p.idProduto);
      const produtosCompletos = await Produto.findByIds(produtoIds);
      
      // Verificar se todos os produtos existem
      if (produtosCompletos.length !== produtoIds.length) {
        const produtosEncontrados = produtosCompletos.map(p => p.idProduto);
        const produtosNaoEncontrados = produtoIds.filter(id => !produtosEncontrados.includes(id));
        throw new HttpError(400, 'Produto(s) não encontrado(s)', [{
          field: 'produtos',
          message: `Produto(s) com ID ${produtosNaoEncontrados.join(', ')} não existe(m)`,
        }]);
      }
      
      // Verificar produtos duplicados
      const produtosUnicos = new Set(produtoIds);
      if (produtosUnicos.size !== produtoIds.length) {
        throw new HttpError(400, 'Produtos duplicados', [{
          field: 'produtos',
          message: 'Não é permitido adicionar o mesmo produto mais de uma vez',
        }]);
      }
      
      // Montar dados completos dos produtos para a venda
      const produtosParaVenda = produtos.map(p => {
        const produtoCompleto = produtosCompletos.find(pc => pc.idProduto === p.idProduto);
        return {
          idProduto: produtoCompleto.idProduto,
          nomeProduto: produtoCompleto.nome,
          quantidade: p.quantidade,
          precoUnitario: produtoCompleto.precoUnitario,
          idCategoria: produtoCompleto.idCategoria,
        };
      });
      
      // Calcular total (SEMPRE no backend)
      const total = produtosParaVenda.reduce(
        (sum, p) => sum + (p.quantidade * p.precoUnitario),
        0
      );
      
      // Criar venda
      const vendaData = {
        idCliente: cliente.idCliente,
        nomeCliente: cliente.nome,
        sexoCliente: cliente.sexo,
        idadeCliente: cliente.idade,
        regiaoVenda,
        dataVenda: new Date(dataVenda),
        total,
        produtos: produtosParaVenda,
      };
      
      const result = await Venda.create(vendaData, idUsuario);
      
      res.status(201).json({
        success: true,
        message: 'Venda adicionada com sucesso!',
        data: {
          idVenda: result.idVenda,
          total: result.total,
          dataVenda: vendaData.dataVenda,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Importar vendas em lote
   * POST /api/vendas/import
   */
  static async import(req, res, next) {
    try {
      const idUsuario = req.user.id;
      const { vendas } = req.body;
      
      if (!vendas || vendas.length === 0) {
        throw new HttpError(400, 'Nenhuma venda para importar');
      }
      
      // Processar cada venda
      const vendasProcessadas = [];
      
      for (const vendaInput of vendas) {
        // Buscar cliente
        const cliente = await Cliente.findById(vendaInput.idCliente);
        if (!cliente) {
          throw new HttpError(400, `Cliente ${vendaInput.idCliente} não encontrado`);
        }
        
        // Buscar produtos
        const produtoIds = vendaInput.produtos.map(p => p.idProduto);
        const produtosCompletos = await Produto.findByIds(produtoIds);
        
        const produtosParaVenda = vendaInput.produtos.map(p => {
          const produtoCompleto = produtosCompletos.find(pc => pc.idProduto === p.idProduto);
          if (!produtoCompleto) {
            throw new HttpError(400, `Produto ${p.idProduto} não encontrado`);
          }
          return {
            idProduto: produtoCompleto.idProduto,
            nomeProduto: produtoCompleto.nome,
            quantidade: p.quantidade,
            precoUnitario: produtoCompleto.precoUnitario,
            idCategoria: produtoCompleto.idCategoria,
          };
        });
        
        const total = produtosParaVenda.reduce(
          (sum, p) => sum + (p.quantidade * p.precoUnitario),
          0
        );
        
        vendasProcessadas.push({
          idCliente: cliente.idCliente,
          nomeCliente: cliente.nome,
          sexoCliente: cliente.sexo,
          idadeCliente: cliente.idade,
          regiaoVenda: vendaInput.regiaoVenda,
          dataVenda: new Date(vendaInput.dataVenda),
          total,
          produtos: produtosParaVenda,
        });
      }
      
      // Importar vendas
      const result = await Venda.importMany(vendasProcessadas, idUsuario);
      
      if (result.erros.length > 0) {
        return res.status(207).json({
          success: true,
          message: `${result.quantidade} de ${vendas.length} vendas importadas com sucesso`,
          data: result,
        });
      }
      
      res.status(201).json({
        success: true,
        message: `${result.quantidade} vendas importadas com sucesso!`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VendasController;

