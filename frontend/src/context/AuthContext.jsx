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
    try {
      const response = await authAPI.register(userData)
      return { success: true, message: response.message || 'Cadastro realizado com sucesso!' }
    } catch (error) {
      return { success: false, message: error.message || 'Erro ao realizar cadastro' }
    }
  }

  const login = async (email, senha) => {
    try {
      const response = await authAPI.login(email, senha)
      
      if (response.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.usuario)
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Erro ao fazer login' }
    } catch (error) {
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

