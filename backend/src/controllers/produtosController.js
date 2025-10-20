const Produto = require('../models/Produto');
const { HttpError } = require('../middlewares/errorHandler');

class ProdutosController {
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

