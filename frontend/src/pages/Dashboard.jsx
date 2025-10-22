import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useVendas } from '../context/VendasContext'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import ChartCard from '../components/ChartCard'
import SalesTable from '../components/SalesTable'
import FilterPanel from '../components/FilterPanel'
import AddVendaManual from '../components/AddVendaManual'
import ImportCSV from '../components/ImportCSV'
import {
  getVendasPorMes,
  getVendasPorRegiao,
  getVendasPorCategoria,
  getTopProdutos,
  getVendasPorGenero,
  getTotalVendas,
  getTicketMedio,
  getTotalClientes
} from '../data/mockData'
import { TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, Plus, Upload } from 'lucide-react'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth()
  const { vendas, loading } = useVendas()
  const navigate = useNavigate()
  const [abaAtiva, setAbaAtiva] = useState('dashboard')
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    regiao: 'todas',
    categoria: 'todas',
    periodo: 'todos'
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    applyFilters()
  }, [filters, vendas])

  const applyFilters = () => {
    let filtered = [...vendas]

    // Filtrar por região
    if (filters.regiao !== 'todas') {
      filtered = filtered.filter(v => v.regiaoVenda === filters.regiao)
    }

    // Filtrar por categoria
    if (filters.categoria !== 'todas') {
      filtered = filtered.filter(v => 
        v.produtos.some(p => {
          const categoriaId = parseInt(filters.categoria)
          return p.idCategoria === categoriaId
        })
      )
    }

    // Filtrar por período
    if (filters.periodo !== 'todos') {
      const hoje = new Date()
      let dataLimite = new Date()

      switch (filters.periodo) {
        case '7dias':
          dataLimite.setDate(hoje.getDate() - 7)
          break
        case '30dias':
          dataLimite.setDate(hoje.getDate() - 30)
          break
        case '90dias':
          dataLimite.setDate(hoje.getDate() - 90)
          break
        default:
          break
      }

      if (filters.periodo !== 'todos') {
        filtered = filtered.filter(v => new Date(v.dataVenda) >= dataLimite)
      }
    }

    setFilteredData(filtered)
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  // Calcular métricas com base nos dados filtrados
  const totalVendasFiltrado = filteredData.reduce((sum, v) => sum + (Number(v.total) || 0), 0)
  const ticketMedioFiltrado = filteredData.length > 0 ? totalVendasFiltrado / filteredData.length : 0
  const clientesUnicosFiltrado = new Set(filteredData.map(v => v.idCliente)).size

  if (!isAuthenticated) {
    return null
  }

  const renderConteudo = () => {
    if (loading || (vendas.length === 0 && !loading)) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '100px 20px',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid #e5e7eb',
            borderTop: '5px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: 500 }}>
            {loading ? 'Carregando dashboard...' : 'Buscando vendas...'}
          </p>
        </div>
      )
    }

    switch (abaAtiva) {
      case 'dashboard':
        return (
          <>
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange}
            />

            <div className="stats-grid">
              <StatsCard
                title="Total de Vendas"
                value={`R$ ${totalVendasFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<DollarSign />}
                trend="+12.5%"
                trendUp={true}
              />
              <StatsCard
                title="Ticket Médio"
                value={`R$ ${ticketMedioFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={<TrendingUp />}
                trend="+8.2%"
                trendUp={true}
              />
              <StatsCard
                title="Clientes Ativos"
                value={clientesUnicosFiltrado}
                icon={<Users />}
                trend="+5.3%"
                trendUp={true}
              />
              <StatsCard
                title="Total de Transações"
                value={filteredData.length}
                icon={<ShoppingCart />}
                trend="-2.1%"
                trendUp={false}
              />
            </div>

            <div className="charts-grid">
              <ChartCard
                title="Vendas por Mês"
                type="line"
                data={getVendasPorMes(vendas)}
              />
              <ChartCard
                title="Vendas por Região"
                type="bar"
                data={getVendasPorRegiao(vendas)}
              />
              <ChartCard
                title="Vendas por Categoria"
                type="pie"
                data={getVendasPorCategoria(vendas)}
              />
              <ChartCard
                title="Top 5 Produtos"
                type="bar-horizontal"
                data={getTopProdutos(5, vendas)}
              />
            </div>

            <SalesTable vendas={filteredData} />
          </>
        )
      
      case 'adicionar':
        return <AddVendaManual />
      
      case 'importar':
        return <ImportCSV />
      
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard de Vendas</h1>
            <p>Bem-vindo(a), {user?.nome || 'Usuário'}</p>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab ${abaAtiva === 'dashboard' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('dashboard')}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            className={`tab ${abaAtiva === 'adicionar' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('adicionar')}
          >
            <Plus size={20} />
            Adicionar Venda
          </button>
          <button
            className={`tab ${abaAtiva === 'importar' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('importar')}
          >
            <Upload size={20} />
            Importar CSV
          </button>
        </div>

        {renderConteudo()}
      </div>
    </div>
  )
}

export default Dashboard

