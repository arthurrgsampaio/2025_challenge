import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import { VendasProvider } from './context/VendasContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <VendasProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </VendasProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

