import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
    // Verificar se há um usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const register = (userData) => {
    // Pegar usuários existentes
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Verificar se email já existe
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Email já cadastrado' }
    }

    // Adicionar novo usuário
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { success: true, message: 'Cadastro realizado com sucesso!' }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    
    return { success: false, message: 'Email ou senha incorretos' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
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

