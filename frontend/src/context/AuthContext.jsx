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
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    // Só verifica autenticação se não estiver em páginas públicas
    const isPublicPage = window.location.pathname === '/login' || 
                         window.location.pathname === '/register' ||
                         window.location.pathname === '/'
    
    if (isPublicPage) {
      // Em páginas públicas, apenas marca como carregado
      setLoading(false)
      setInitialCheckDone(true)
    } else if (!initialCheckDone) {
      // Em páginas privadas, verifica se há sessão ativa
      checkAuth()
    }
  }, [initialCheckDone])

  const checkAuth = async () => {
    try {
      const response = await authAPI.me()
      if (response.success) {
        setUser(response.data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      // Silenciosamente define como não autenticado
      setUser(null)
    } finally {
      setLoading(false)
      setInitialCheckDone(true)
    }
  }

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
        setUser(response.data.user)
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Erro ao fazer login' }
    } catch (error) {
      return { success: false, message: error.message || 'Email ou senha incorretos' }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    loading
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Carregando...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

