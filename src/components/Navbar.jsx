import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, BarChart3 } from 'lucide-react'
import '../styles/Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <BarChart3 size={28} />
          <span>StarSales</span>
        </div>

        <div className="navbar-actions">
          <div className="navbar-user">
            <User size={20} />
            <span>{user?.nome || 'Usuário'}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

