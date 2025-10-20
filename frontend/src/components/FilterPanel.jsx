import React from 'react'
import { Filter } from 'lucide-react'
import { regioes, categorias } from '../data/mockData'
import '../styles/FilterPanel.css'

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <Filter size={20} />
        <span>Filtros</span>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="regiao">Região</label>
          <select
            id="regiao"
            value={filters.regiao}
            onChange={(e) => onFilterChange('regiao', e.target.value)}
          >
            <option value="todas">Todas as Regiões</option>
            {regioes.map(regiao => (
              <option key={regiao} value={regiao}>{regiao}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={filters.categoria}
            onChange={(e) => onFilterChange('categoria', e.target.value)}
          >
            <option value="todas">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nomeCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="periodo">Período</label>
          <select
            id="periodo"
            value={filters.periodo}
            onChange={(e) => onFilterChange('periodo', e.target.value)}
          >
            <option value="todos">Todo o Período</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
            <option value="90dias">Últimos 90 dias</option>
          </select>
        </div>

        <button 
          className="btn-reset"
          onClick={() => {
            onFilterChange('regiao', 'todas')
            onFilterChange('categoria', 'todas')
            onFilterChange('periodo', 'todos')
          }}
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}

export default FilterPanel

