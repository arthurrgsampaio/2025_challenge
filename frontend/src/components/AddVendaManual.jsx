import React, { useState } from 'react'
import { useVendas } from '../context/VendasContext'
import { Plus, X, ShoppingCart } from 'lucide-react'
import '../styles/AddVendaManual.css'

const AddVendaManual = () => {
  const { adicionarVenda, produtos, clientes, categorias } = useVendas()
  const [formData, setFormData] = useState({
    idCliente: '',
    regiaoVenda: '',
    dataVenda: new Date().toISOString().split('T')[0],
    produtos: []
  })
  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })

  const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

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

  const handleSubmit = (e) => {
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
      produtos: formData.produtos
    }

    const resultado = adicionarVenda(vendaData)
    
    if (resultado.success) {
      setMensagem({ tipo: 'success', texto: resultado.message })
      // Limpar formulário
      setFormData({
        idCliente: '',
        regiaoVenda: '',
        dataVenda: new Date().toISOString().split('T')[0],
        produtos: []
      })
    } else {
      setMensagem({ tipo: 'error', texto: resultado.message })
    }
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
            <label htmlFor="cliente">Cliente *</label>
            <select
              id="cliente"
              value={formData.idCliente}
              onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.nome} ({cliente.sexo === 'M' ? 'Masculino' : 'Feminino'}, {cliente.idade} anos)
                </option>
              ))}
            </select>
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
          <h3>Produtos</h3>
          
          <div className="add-produto-row">
            <div className="form-group flex-grow">
              <label htmlFor="produto">Produto</label>
              <select
                id="produto"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.idProduto} value={produto.idProduto}>
                    {produto.nome} - R$ {produto.precoUnitario.toFixed(2)}
                  </option>
                ))}
              </select>
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

            <button
              type="button"
              className="btn-add-produto"
              onClick={adicionarProduto}
            >
              <Plus size={20} />
              Adicionar
            </button>
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
          <button type="submit" className="btn-submit">
            Salvar Venda
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddVendaManual

