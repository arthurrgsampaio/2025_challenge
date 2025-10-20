import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../config/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um token no localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // Validar token com o backend
      authAPI.me()
        .then(response => {
          if (response.success) {
            setUser(response.data.usuario)
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (userData) => {
    console.log('🔧 AuthContext: register chamado com:', userData)
    try {
      console.log('🔧 AuthContext: Chamando authAPI.register...')
      const response = await authAPI.register(userData)
      console.log('✅ AuthContext: Resposta recebida:', response)
      return { success: true, message: response.message || 'Cadastro realizado com sucesso!' }
    } catch (error) {
      console.error('❌ AuthContext: Erro no register:', error)
      return { success: false, message: error.message || 'Erro ao realizar cadastro' }
    }
  }

  const login = async (email, password) => {
    console.log('🔧 AuthContext: login chamado com:', { email })
    try {
      console.log('🔧 AuthContext: Chamando authAPI.login...')
      const response = await authAPI.login(email, password)
      console.log('✅ AuthContext: Resposta recebida:', response)
      
      if (response.success) {
        console.log('✅ AuthContext: Login bem-sucedido, salvando token e usuário')
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        return { success: true }
      }
      
      console.warn('⚠️ AuthContext: Login falhou:', response.message)
      return { success: false, message: response.message || 'Erro ao fazer login' }
    } catch (error) {
      console.error('❌ AuthContext: Erro no login:', error)
      return { success: false, message: error.message || 'Email ou senha incorretos' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user
  }

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>Carregando...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

