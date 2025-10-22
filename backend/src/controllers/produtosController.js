const Produto = require('../models/Produto');
const { HttpError } = require('../middlewares/errorHandler');

class ProdutosController {
  /**
   * Criar novo produto
   * POST /api/produtos
   */
  static async create(req, res, next) {
    try {
      console.log('📦 [PRODUTOS] Criando novo produto');
      console.log('📦 [PRODUTOS] Dados recebidos:', req.body);

      const { cdProduto, nome, precoUnitario, idCategoria } = req.body;

      // Validações
      if (!cdProduto || !nome || precoUnitario === undefined || !idCategoria) {
        throw new HttpError(400, 'Dados incompletos', [{
          message: 'Código do produto, nome, preço unitário e categoria são obrigatórios'
        }]);
      }

      if (precoUnitario < 0) {
        throw new HttpError(400, 'Preço inválido', [{
          field: 'precoUnitario',
          message: 'Preço unitário deve ser maior ou igual a zero'
        }]);
      }

      // Verificar se categoria existe
      const Categoria = require('../models/Categoria');
      const categoriaExists = await Categoria.exists(idCategoria);
      
      if (!categoriaExists) {
        throw new HttpError(400, 'Categoria não encontrada', [{
          field: 'idCategoria',
          message: 'A categoria informada não existe'
        }]);
      }

      console.log('💾 [PRODUTOS] Criando produto no banco...');
      const produto = await Produto.create({
        cdProduto,
        nome,
        precoUnitario: parseFloat(precoUnitario),
        idCategoria: parseInt(idCategoria)
      });

      console.log('✅ [PRODUTOS] Produto criado:', produto);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso!',
        data: produto
      });
    } catch (error) {
      console.error('❌ [PRODUTOS] Erro ao criar produto:', error);
      next(error);
    }
  }

  /**
   * Listar produtos
   * GET /api/produtos
   */
  static async index(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        idCategoria: req.query.idCategoria ? parseInt(req.query.idCategoria) : undefined,
        precoMin: req.query.precoMin ? parseFloat(req.query.precoMin) : undefined,
        precoMax: req.query.precoMax ? parseFloat(req.query.precoMax) : undefined,
      };
      
      const produtos = await Produto.findAll(filters);
      
      res.json({
        success: true,
        data: produtos,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Obter detalhes de um produto
   * GET /api/produtos/:id
   */
  static async show(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const produto = await Produto.findById(id);
      
      if (!produto) {
        throw new HttpError(404, 'Produto não encontrado');
      }
      
      res.json({
        success: true,
        data: produto,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProdutosController;

