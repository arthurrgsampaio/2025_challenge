import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import '../styles/ChartCard.css'

const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

const ChartCard = ({ title, type, data }) => {
  console.log(`📊 ChartCard "${title}":`, { type, dataLength: data?.length, data })

  const formatCurrency = (value) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Se não houver dados, mostrar mensagem
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3>{title}</h3>
        </div>
        <div className="chart-card-content">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '300px',
            color: '#9ca3af'
          }}>
            Sem dados para exibir
          </div>
        </div>
      </div>
    )
  }

  const formatMonthYear = (mesAno) => {
    const [mes, ano] = mesAno.split('/')
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${meses[parseInt(mes) - 1]}`
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={formatMonthYear}
                stroke="#6b7280" 
              />
              <YAxis 
                stroke="#6b7280"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#667eea" 
                strokeWidth={3}
                name="Total de Vendas"
                dot={{ fill: '#667eea', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="regiao" stroke="#6b7280" />
              <YAxis 
                stroke="#6b7280"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                fill="#667eea" 
                name="Total de Vendas"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.categoria}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'bar-horizontal':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number" 
                stroke="#6b7280"
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <YAxis type="category" dataKey="nome" stroke="#6b7280" width={120} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="totalVendido" 
                fill="#764ba2" 
                name="Total Vendido"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return <div>Tipo de gráfico não suportado</div>
    }
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-card-content">
        {renderChart()}
      </div>
    </div>
  )
}

export default ChartCard

