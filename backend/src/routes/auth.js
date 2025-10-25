const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validate, Joi } = require('../middlewares/validation');

// Schema de validação para registro
const registerSchema = Joi.object({
  nome: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),
  senha: Joi.string().min(6).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
  }),
});

// Schema de validação para login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),
  senha: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória',
  }),
});

// Rotas
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.me);

module.exports = router;

