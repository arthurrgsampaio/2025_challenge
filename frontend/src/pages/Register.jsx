import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus } from 'lucide-react'
import '../styles/Auth.css'

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    console.log('📝 Iniciando cadastro...', { nome: formData.nome, email: formData.email })

    // Validações
    if (!formData.nome || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    try {
      console.log('🚀 Enviando dados para o backend...')
      const result = await register({
        nome: formData.nome,
        email: formData.email,
        password: formData.password
      })

      console.log('✅ Resposta do backend:', result)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        console.error('❌ Erro no cadastro:', result.message)
        setError(result.message || 'Erro ao realizar cadastro')
      }
    } catch (error) {
      console.error('❌ Erro crítico no cadastro:', error)
      setError('Erro ao conectar com o servidor. Tente novamente.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <UserPlus size={32} />
          </div>
          <h1>Criar Conta</h1>
          <p>Cadastre-se para acessar o dashboard de vendas</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Cadastrar
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

