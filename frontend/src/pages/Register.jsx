import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BarChart3 } from 'lucide-react'
import '../styles/Auth.css'

const Register = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    console.log('📝 Enviando cadastro:', { nome, email, senha: '***' })
    
    const result = await register({ nome, email, senha })
    
    console.log('📝 Resultado do cadastro:', result)
    
    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Redirecionando...')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setError(result.message || 'Erro ao realizar cadastro')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <BarChart3 size={48} />
          <h1>StarSales</h1>
          <p>Crie sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome completo"
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
            />
            <small>Mínimo de 6 caracteres</small>
          </div>

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Já tem uma conta? <Link to="/login">Fazer login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register

