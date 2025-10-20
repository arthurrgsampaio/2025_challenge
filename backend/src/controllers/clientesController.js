const Cliente = require('../models/Cliente');
const { HttpError } = require('../middlewares/errorHandler');

class ClientesController {
  /**
   * Listar clientes
   * GET /api/clientes
   */
  static async index(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        sexo: req.query.sexo,
        idadeMin: req.query.idadeMin ? parseInt(req.query.idadeMin) : undefined,
        idadeMax: req.query.idadeMax ? parseInt(req.query.idadeMax) : undefined,
      };
      
      const clientes = await Cliente.findAll(filters);
      
      res.json({
        success: true,
        data: clientes,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Obter detalhes de um cliente
   * GET /api/clientes/:id
   */
  static async show(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await Cliente.findById(id);
      
      if (!cliente) {
        throw new HttpError(404, 'Cliente não encontrado');
      }
      
      res.json({
        success: true,
        data: cliente,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClientesController;

