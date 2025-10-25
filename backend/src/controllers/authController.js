const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { HttpError } = require('../middlewares/errorHandler');

class AuthController {
  /**
   * Registrar novo usuário
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { nome, email, senha } = req.body;
      
      // Verificar se email já existe
      const emailExists = await Usuario.existsByEmail(email);
      
      if (emailExists) {
        throw new HttpError(400, 'Email já cadastrado');
      }
      
      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Criar usuário
      const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
      });
      
      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso!',
        data: {
          user: {
            nome: usuario.nome,
            email: usuario.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Login
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      
      // Buscar usuário
      const usuario = await Usuario.findByEmail(email);
      
      if (!usuario) {
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      // Criar sessão
      req.session.userId = usuario.id;
      req.session.userEmail = usuario.email;
      req.session.userName = usuario.nome;
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Logout
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw new HttpError(500, 'Erro ao fazer logout');
        }
        
        res.json({
          success: true,
          message: 'Logout realizado com sucesso',
        });
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Verificar se está autenticado
   * GET /api/auth/me
   */
  static async me(req, res, next) {
    try {
      if (!req.session.userId) {
        throw new HttpError(401, 'Não autenticado');
      }
      
      const usuario = await Usuario.findById(req.session.userId);
      
      if (!usuario) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

