import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn } from 'lucide-react'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      const result = await login(email, password)

      if (result.success) {
        navigate('/dashboard')
      } else {
        console.error('❌ Erro no login:', result.message)
        setError(result.message || 'Email ou senha incorretos')
      }
    } catch (error) {
      console.error('❌ Erro crítico no login:', error)
      setError('Erro ao conectar com o servidor. Tente novamente.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn size={32} />
          </div>
          <h1>StarSales</h1>
          <h2>Dashboard Inteligente de Vendas</h2>
          <p>Faça login para acessar sua plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register">Cadastre-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

