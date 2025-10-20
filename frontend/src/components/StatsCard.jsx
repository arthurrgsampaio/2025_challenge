import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import '../styles/StatsCard.css'

const StatsCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-title">{title}</div>
        <div className="stats-card-icon">{icon}</div>
      </div>
      
      <div className="stats-card-value">{value}</div>
      
      {trend && (
        <div className={`stats-card-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{trend} vs mês anterior</span>
        </div>
      )}
    </div>
  )
}

export default StatsCard

