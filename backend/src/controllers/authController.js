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
      console.log('📝 [AUTH] Iniciando registro de usuário');
      console.log('📝 [AUTH] Dados recebidos:', { 
        nome: req.body.nome, 
        email: req.body.email,
        hasPassword: !!req.body.password 
      });
      
      const { nome, email, password } = req.body;
      
      // Verificar se email já existe
      console.log('🔍 [AUTH] Verificando se email já existe...');
      const emailExists = await Usuario.existsByEmail(email);
      
      if (emailExists) {
        console.warn('⚠️ [AUTH] Email já cadastrado:', email);
        throw new HttpError(400, 'Email já cadastrado', [{
          field: 'email',
          message: 'Este email já está em uso',
        }]);
      }
      
      console.log('✅ [AUTH] Email disponível');
      
      // Hash da senha
      console.log('🔒 [AUTH] Gerando hash da senha...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ [AUTH] Hash da senha gerado');
      
      // Criar usuário
      console.log('💾 [AUTH] Criando usuário no banco de dados...');
      const usuario = await Usuario.create({
        nome,
        email,
        password: hashedPassword,
      });
      
      console.log('✅ [AUTH] Usuário criado com sucesso:', { 
        id: usuario.id, 
        nome: usuario.nome, 
        email: usuario.email 
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
      console.error('❌ [AUTH] Erro no registro:', error.message);
      console.error('❌ [AUTH] Stack:', error.stack);
      next(error);
    }
  }
  
  /**
   * Login
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      console.log('🔐 [AUTH] Iniciando login');
      console.log('🔐 [AUTH] Email recebido:', req.body.email);
      
      const { email, password } = req.body;
      
      // Buscar usuário
      console.log('🔍 [AUTH] Buscando usuário no banco...');
      const usuario = await Usuario.findByEmail(email);
      
      if (!usuario) {
        console.warn('⚠️ [AUTH] Usuário não encontrado:', email);
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      console.log('✅ [AUTH] Usuário encontrado:', { id: usuario.ID, nome: usuario.NOME });
      
      // Verificar senha
      console.log('🔒 [AUTH] Verificando senha...');
      const senhaValida = await bcrypt.compare(password, usuario.PASSWORD);
      
      if (!senhaValida) {
        console.warn('⚠️ [AUTH] Senha incorreta para:', email);
        throw new HttpError(401, 'Email ou senha incorretos');
      }
      
      console.log('✅ [AUTH] Senha válida');
      
      // Gerar token JWT
      console.log('🎟️ [AUTH] Gerando token JWT...');
      const token = generateToken({
        userId: usuario.ID,
        email: usuario.EMAIL,
      });
      
      console.log('✅ [AUTH] Login bem-sucedido para:', email);
      
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
      console.error('❌ [AUTH] Erro no login:', error.message);
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

