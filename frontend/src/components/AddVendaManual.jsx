import React, { useState, useEffect } from 'react'
import { useVendas } from '../context/VendasContext'
import { Plus, X, ShoppingCart, UserPlus, Package } from 'lucide-react'
import AddCliente from './AddCliente'
import AddProduto from './AddProduto'
import '../styles/AddVendaManual.css'

const AddVendaManual = () => {
  const { adicionarVenda, produtos, clientes, categorias, recarregarDados, loading } = useVendas()
  const [formData, setFormData] = useState({
    idCliente: '',
    regiaoVenda: '',
    dataVenda: new Date().toISOString().split('T')[0],
    produtos: []
  })
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })
  const [showAddCliente, setShowAddCliente] = useState(false)
  const [showAddProduto, setShowAddProduto] = useState(false)
  const [recarregando, setRecarregando] = useState(false)
  const [carregandoLocal, setCarregandoLocal] = useState(true)

  const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      if (produtos.length === 0 || clientes.length === 0 || categorias.length === 0) {
        await recarregarDados()
      }
      setCarregandoLocal(false)
    }
    carregarDadosIniciais()
  }, [])

  const adicionarProduto = () => {
    if (!produtoSelecionado) {
      setMensagem({ tipo: 'error', texto: 'Selecione um produto' })
      return
    }

    const produto = produtos.find(p => p.idProduto === parseInt(produtoSelecionado))
    
    // Verificar se o produto já foi adicionado
    if (formData.produtos.some(p => p.idProduto === produto.idProduto)) {
      setMensagem({ tipo: 'error', texto: 'Produto já foi adicionado' })
      return
    }

    const novoProduto = {
      idProduto: produto.idProduto,
      nomeProduto: produto.nome,
      quantidade: parseInt(quantidade),
      precoUnitario: produto.precoUnitario,
      idCategoria: produto.idCategoria
    }

    setFormData({
      ...formData,
      produtos: [...formData.produtos, novoProduto]
    })

    setProdutoSelecionado('')
    setQuantidade(1)
    setMensagem({ tipo: '', texto: '' })
  }

  const removerProduto = (idProduto) => {
    setFormData({
      ...formData,
      produtos: formData.produtos.filter(p => p.idProduto !== idProduto)
    })
  }

  const calcularTotal = () => {
    return formData.produtos.reduce((sum, p) => sum + (p.quantidade * p.precoUnitario), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem({ tipo: '', texto: '' })

    // Validações
    if (!formData.idCliente) {
      setMensagem({ tipo: 'error', texto: 'Selecione um cliente' })
      return
    }

    if (!formData.regiaoVenda) {
      setMensagem({ tipo: 'error', texto: 'Selecione uma região' })
      return
    }

    if (formData.produtos.length === 0) {
      setMensagem({ tipo: 'error', texto: 'Adicione pelo menos um produto' })
      return
    }

    const cliente = clientes.find(c => c.idCliente === parseInt(formData.idCliente))
    
    const vendaData = {
      idCliente: cliente.idCliente,
      nomeCliente: cliente.nome,
      sexoCliente: cliente.sexo,
      idadeCliente: cliente.idade,
      regiaoVenda: formData.regiaoVenda,
      dataVenda: new Date(formData.dataVenda).toISOString(),
      total: calcularTotal(),
      produtos: formData.produtos.map(p => ({
        idProduto: p.idProduto,
        quantidade: p.quantidade
      }))
    }

    setRecarregando(true)
    const resultado = await adicionarVenda(vendaData)
    setRecarregando(false)
    
    if (resultado.success) {
      setMensagem({ tipo: 'success', texto: resultado.message })
      setFormData({
        idCliente: '',
        regiaoVenda: '',
        dataVenda: new Date().toISOString().split('T')[0],
        produtos: []
      })
      setProdutoSelecionado('')
      setQuantidade(1)
    } else {
      setMensagem({ tipo: 'error', texto: resultado.message })
    }
  }

  if (loading || carregandoLocal) {
    return (
      <div className="add-venda-container">
        <div className="add-venda-header">
          <ShoppingCart size={24} />
          <h2>Adicionar Venda Manualmente</h2>
        </div>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '60px 20px',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="add-venda-container">
      <div className="add-venda-header">
        <ShoppingCart size={24} />
        <h2>Adicionar Venda Manualmente</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-venda-form">
        {mensagem.texto && (
          <div className={`message message-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <div className="label-with-button">
              <label htmlFor="cliente">Cliente *</label>
              <button
                type="button"
                className="btn-add-new"
                onClick={() => setShowAddCliente(true)}
                title="Adicionar novo cliente"
              >
                <UserPlus size={16} />
                Novo Cliente
              </button>
            </div>
            <select
              id="cliente"
              value={formData.idCliente}
              onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
              required
              disabled={recarregando}
            >
              <option value="">{recarregando ? 'Atualizando lista...' : 'Selecione um cliente'}</option>
              {clientes.map(cliente => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nome} ({cliente.sexo === 'M' ? 'Masculino' : 'Feminino'}, {cliente.idade} anos)
                </option>
              ))}
            </select>
            {recarregando && (
              <small style={{ color: '#3b82f6' }}>🔄 Atualizando lista...</small>
            )}
            {!recarregando && clientes.length === 0 && (
              <small className="text-warning">⚠️ Nenhum cliente cadastrado. Clique em "Novo Cliente" para adicionar.</small>
            )}
            {!recarregando && clientes.length > 0 && (
              <small style={{ color: '#10b981' }}>✅ {clientes.length} cliente(s) disponível(is)</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="regiao">Região *</label>
            <select
              id="regiao"
              value={formData.regiaoVenda}
              onChange={(e) => setFormData({ ...formData, regiaoVenda: e.target.value })}
              required
            >
              <option value="">Selecione uma região</option>
              {regioes.map(regiao => (
                <option key={regiao} value={regiao}>{regiao}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data">Data da Venda *</label>
            <input
              type="date"
              id="data"
              value={formData.dataVenda}
              onChange={(e) => setFormData({ ...formData, dataVenda: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="produtos-section">
          <div className="section-header-with-button">
            <h3>Produtos</h3>
            <button
              type="button"
              className="btn-add-new"
              onClick={() => setShowAddProduto(true)}
              title="Adicionar novo produto"
            >
              <Package size={16} />
              Novo Produto
            </button>
          </div>
          
          <div className="add-produto-row">
            <div className="form-group">
              <label htmlFor="produto">Produto</label>
              <select
                id="produto"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                disabled={recarregando}
              >
                <option value="">{recarregando ? 'Atualizando lista...' : 'Selecione um produto'}</option>
                {produtos.map(produto => (
                  <option key={produto.idProduto} value={produto.idProduto}>
                    {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}
                  </option>
                ))}
              </select>
              {recarregando && (
                <small style={{ color: '#3b82f6' }}>🔄 Atualizando lista...</small>
              )}
              {!recarregando && produtos.length === 0 && (
                <small className="text-warning">⚠️ Nenhum produto cadastrado. Clique em "Novo Produto" para adicionar.</small>
              )}
              {!recarregando && produtos.length > 0 && (
                <small style={{ color: '#10b981' }}>✅ {produtos.length} produto(s) disponível(is)</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>
              <input
                type="number"
                id="quantidade"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>&nbsp;</label>
              <button
                type="button"
                className="btn-add-produto"
                onClick={adicionarProduto}
              >
                <Plus size={20} />
                Adicionar
              </button>
            </div>
          </div>

          {formData.produtos.length > 0 && (
            <div className="produtos-list">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.produtos.map(produto => (
                    <tr key={produto.idProduto}>
                      <td>{produto.nomeProduto}</td>
                      <td>{produto.quantidade}</td>
                      <td>R$ {produto.precoUnitario.toFixed(2)}</td>
                      <td>R$ {(produto.quantidade * produto.precoUnitario).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removerProduto(produto.idProduto)}
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total</strong></td>
                    <td><strong>R$ {calcularTotal().toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={recarregando}>
            {recarregando ? (
              <>
                <div className="spinner-small"></div>
                Salvando...
              </>
            ) : (
              'Salvar Venda'
            )}
          </button>
        </div>
      </form>

      {/* Modais */}
      {showAddCliente && (
        <AddCliente
          onClose={() => setShowAddCliente(false)}
          onSuccess={async (novoCliente) => {
            setMensagem({ tipo: 'success', texto: 'Cliente adicionado! Atualizando lista...' })
            setRecarregando(true)
            
            try {
              await recarregarDados()
              setTimeout(() => {
                setFormData(prev => ({ ...prev, idCliente: novoCliente.idCliente }))
                setMensagem({ tipo: 'success', texto: 'Cliente adicionado e selecionado!' })
                setRecarregando(false)
              }, 500)
            } catch (error) {
              setMensagem({ tipo: 'error', texto: 'Cliente criado, mas erro ao atualizar lista. Recarregue a página.' })
              setRecarregando(false)
            }
          }}
        />
      )}

      {showAddProduto && (
        <AddProduto
          onClose={() => setShowAddProduto(false)}
          onSuccess={async (novoProduto) => {
            setMensagem({ tipo: 'success', texto: 'Produto adicionado! Atualizando lista...' })
            setRecarregando(true)
            
            try {
              await recarregarDados()
              setTimeout(() => {
                setMensagem({ tipo: 'success', texto: 'Produto adicionado com sucesso!' })
                setRecarregando(false)
              }, 500)
            } catch (error) {
              setMensagem({ tipo: 'error', texto: 'Produto criado, mas erro ao atualizar lista. Recarregue a página.' })
              setRecarregando(false)
            }
          }}
        />
      )}
    </div>
  )
}

export default AddVendaManual

