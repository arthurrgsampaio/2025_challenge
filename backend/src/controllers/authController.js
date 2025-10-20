const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { generateToken } = require('../config/jwt');
const { HttpError } = require('../middlewares/errorHandler');

class AuthController {
  /**
   * Registrar novo usuário
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { nome, email, password } = req.body;
      
      // Verificar se email já existe
      const emailExists = await Usuario.existsByEmail(email);
      if (emailExists) {
        throw new HttpError(400, 'Email já cadastrado', [{
          field: 'email',
          message: 'Este email já está em uso',
        }]);
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar usuário
      const usuario = await Usuario.create({
        nome,
        email,
        password: hashedPassword,
      });
      
      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso!',
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
   * Login
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Buscar usuário
      const usuario = await Usuario.findByEmail(email);
      
      if (!usuario) {
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      // Verificar senha
      const senhaValida = await bcrypt.compare(password, usuario.PASSWORD);
      
      if (!senhaValida) {
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      // Gerar token JWT
      const token = generateToken({
        userId: usuario.ID,
        email: usuario.EMAIL,
      });
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          expiresIn: 604800, // 7 dias em segundos
          user: {
            id: usuario.ID,
            nome: usuario.NOME,
            email: usuario.EMAIL,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Validar token e obter dados do usuário
   * GET /api/auth/me
   */
  static async me(req, res, next) {
    try {
      const usuario = await Usuario.findById(req.user.id);
      
      if (!usuario) {
        throw new HttpError(404, 'Usuário não encontrado');
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: usuario.ID,
            nome: usuario.NOME,
            email: usuario.EMAIL,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

