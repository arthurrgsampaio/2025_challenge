import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { produtosAPI, categoriasAPI } from '../config/api'
import '../styles/AddClienteProduto.css'

const AddProduto = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cdProduto: '',
    nome: '',
    precoUnitario: '',
    idCategoria: ''
  })
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    try {
      const response = await categoriasAPI.listar()
      setCategorias(response.data || [])
    } catch (err) {
      console.error('❌ Erro ao carregar categorias:', err)
      setError('Erro ao carregar categorias')
    } finally {
      setLoadingCategorias(false)
    }
  }

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
    if (!formData.cdProduto || !formData.nome || !formData.precoUnitario || !formData.idCategoria) {
      setError('Preencha todos os campos')
      return
    }

    if (formData.precoUnitario < 0) {
      setError('Preço deve ser maior ou igual a zero')
      return
    }

    setLoading(true)

    try {
      const response = await produtosAPI.criar({
        cdProduto: formData.cdProduto,
        nome: formData.nome,
        precoUnitario: parseFloat(formData.precoUnitario),
        idCategoria: parseInt(formData.idCategoria)
      })
      
      if (response.success) {
        onSuccess && onSuccess(response.data)
        onClose()
      }
    } catch (err) {
      console.error('❌ Erro ao criar produto:', err)
      setError(err.message || 'Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Novo Produto</h2>
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

          {loadingCategorias ? (
            <div className="loading-message">Carregando categorias...</div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="cdProduto">Código do Produto *</label>
                <input
                  type="text"
                  id="cdProduto"
                  name="cdProduto"
                  value={formData.cdProduto}
                  onChange={handleChange}
                  placeholder="Ex: PROD001"
                  maxLength="50"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nome">Nome do Produto *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Notebook Dell"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="precoUnitario">Preço Unitário (R$) *</label>
                <input
                  type="number"
                  id="precoUnitario"
                  name="precoUnitario"
                  value={formData.precoUnitario}
                  onChange={handleChange}
                  placeholder="Ex: 2500.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="idCategoria">Categoria *</label>
                <select
                  id="idCategoria"
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nomeCategoria}
                    </option>
                  ))}
                </select>
                {categorias.length === 0 && (
                  <small className="text-warning">
                    ⚠️ Nenhuma categoria disponível. Contate o administrador.
                  </small>
                )}
              </div>
            </>
          )}

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
              disabled={loading || loadingCategorias || categorias.length === 0}
            >
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduto

