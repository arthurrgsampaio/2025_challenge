import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, MapPin, User, DollarSign } from 'lucide-react'
import '../styles/SalesTable.css'

const SalesTable = ({ vendas }) => {
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const toggleRow = (idVenda) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(idVenda)) {
      newExpanded.delete(idVenda)
    } else {
      newExpanded.add(idVenda)
    }
    setExpandedRows(newExpanded)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  const formatCurrency = (value) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Ordenar por data (mais recente primeiro)
  const sortedVendas = [...vendas].sort((a, b) => 
    new Date(b.dataVenda) - new Date(a.dataVenda)
  )

  // Paginação
  const totalPages = Math.ceil(sortedVendas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVendas = sortedVendas.slice(startIndex, endIndex)

  return (
    <div className="sales-table-container">
      <div className="sales-table-header">
        <h3>Histórico de Vendas</h3>
        <span className="sales-count">{vendas.length} transações</span>
      </div>

      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Região</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentVendas.map(venda => (
              <React.Fragment key={venda.idVenda}>
                <tr 
                  className={expandedRows.has(venda.idVenda) ? 'expanded' : ''}
                  onClick={() => toggleRow(venda.idVenda)}
                >
                  <td className="expand-cell">
                    {expandedRows.has(venda.idVenda) ? 
                      <ChevronUp size={18} /> : 
                      <ChevronDown size={18} />
                    }
                  </td>
                  <td className="id-cell">#{venda.idVenda}</td>
                  <td>
                    <div className="cell-with-icon">
                      <Calendar size={16} />
                      {formatDate(venda.dataVenda)}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <User size={16} />
                      {venda.nomeCliente}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <MapPin size={16} />
                      {venda.regiaoVenda}
                    </div>
                  </td>
                  <td className="total-cell">
                    <div className="cell-with-icon">
                      <DollarSign size={16} />
                      {formatCurrency(venda.total)}
                    </div>
                  </td>
                </tr>
                {expandedRows.has(venda.idVenda) && (
                  <tr className="details-row">
                    <td colSpan="6">
                      <div className="sale-details">
                        <div className="details-section">
                          <h4>Informações do Cliente</h4>
                          <div className="details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Nome:</span>
                              <span className="detail-value">{venda.nomeCliente}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Sexo:</span>
                              <span className="detail-value">{venda.sexoCliente === 'M' ? 'Masculino' : 'Feminino'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Idade:</span>
                              <span className="detail-value">{venda.idadeCliente} anos</span>
                            </div>
                          </div>
                        </div>

                        <div className="details-section">
                          <h4>Produtos Vendidos</h4>
                          <div className="products-list">
                            {venda.produtos.map((produto, index) => (
                              <div key={index} className="product-item">
                                <div className="product-name">{produto.nomeProduto}</div>
                                <div className="product-info">
                                  <span>Qtd: {produto.quantidade}</span>
                                  <span>Unit: {formatCurrency(produto.precoUnitario)}</span>
                                  <span className="product-total">
                                    {formatCurrency(produto.quantidade * produto.precoUnitario)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          
          <div className="pagination-info">
            Página {currentPage} de {totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}

export default SalesTable

