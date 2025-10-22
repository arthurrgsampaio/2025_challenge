import React, { useState } from 'react'
import { X } from 'lucide-react'
import { clientesAPI } from '../config/api'
import '../styles/AddClienteProduto.css'

const AddCliente = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sexo: 'M',
    idade: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!formData.nome || !formData.sexo || !formData.idade) {
      setError('Preencha todos os campos')
      return
    }

    if (formData.idade < 0 || formData.idade > 150) {
      setError('Idade deve estar entre 0 e 150 anos')
      return
    }

    setLoading(true)

    try {
      const response = await clientesAPI.criar({
        nome: formData.nome,
        sexo: formData.sexo,
        idade: parseInt(formData.idade)
      })
      
      if (response.success) {
        onSuccess && onSuccess(response.data)
        onClose()
      }
    } catch (err) {
      console.error('❌ Erro ao criar cliente:', err)
      setError(err.message || 'Erro ao criar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Novo Cliente</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo *</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade *</label>
            <input
              type="number"
              id="idade"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
              placeholder="Ex: 25"
              min="0"
              max="150"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCliente

