const Categoria = require('../models/Categoria');

class CategoriasController {
  /**
   * Listar categorias
   * GET /api/categorias
   */
  static async index(req, res, next) {
    try {
      const categorias = await Categoria.findAll();
      
      res.json({
        success: true,
        data: categorias,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriasController;

