const Cliente = require('../models/Cliente');
const { HttpError } = require('../middlewares/errorHandler');

class ClientesController {
  /**
   * Criar novo cliente
   * POST /api/clientes
   */
  static async create(req, res, next) {
    try {
      console.log('👤 [CLIENTES] Criando novo cliente');
      console.log('👤 [CLIENTES] Dados recebidos:', req.body);

      const { nome, sexo, idade } = req.body;

      // Validações
      if (!nome || !sexo || idade === undefined) {
        throw new HttpError(400, 'Dados incompletos', [{
          message: 'Nome, sexo e idade são obrigatórios'
        }]);
      }

      if (!['M', 'F', 'm', 'f'].includes(sexo)) {
        throw new HttpError(400, 'Sexo inválido', [{
          field: 'sexo',
          message: 'Sexo deve ser M (Masculino) ou F (Feminino)'
        }]);
      }

      if (idade < 0 || idade > 150) {
        throw new HttpError(400, 'Idade inválida', [{
          field: 'idade',
          message: 'Idade deve estar entre 0 e 150 anos'
        }]);
      }

      console.log('💾 [CLIENTES] Criando cliente no banco...');
      const cliente = await Cliente.create({
        nome,
        sexo,
        idade: parseInt(idade)
      });

      console.log('✅ [CLIENTES] Cliente criado:', cliente);

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso!',
        data: cliente
      });
    } catch (error) {
      console.error('❌ [CLIENTES] Erro ao criar cliente:', error);
      next(error);
    }
  }

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

