import React, { createContext, useContext, useState, useEffect } from 'react'
import { vendas as vendasIniciais, produtos, clientes, categorias } from '../data/mockData'

const VendasContext = createContext(null)

export const useVendas = () => {
  const context = useContext(VendasContext)
  if (!context) {
    throw new Error('useVendas deve ser usado dentro de um VendasProvider')
  }
  return context
}

export const VendasProvider = ({ children }) => {
  const [vendas, setVendas] = useState([])

  useEffect(() => {
    // Carregar vendas do localStorage ou usar dados iniciais
    const vendasSalvas = localStorage.getItem('vendas')
    if (vendasSalvas) {
      setVendas(JSON.parse(vendasSalvas))
    } else {
      setVendas(vendasIniciais)
      localStorage.setItem('vendas', JSON.stringify(vendasIniciais))
    }
  }, [])

  const salvarVendas = (novasVendas) => {
    setVendas(novasVendas)
    localStorage.setItem('vendas', JSON.stringify(novasVendas))
  }

  const adicionarVenda = (vendaData) => {
    const novaVenda = {
      idVenda: Math.max(...vendas.map(v => v.idVenda), 0) + 1,
      ...vendaData,
      dataVenda: vendaData.dataVenda || new Date().toISOString()
    }

    const novasVendas = [...vendas, novaVenda]
    salvarVendas(novasVendas)
    return { success: true, message: 'Venda adicionada com sucesso!' }
  }

  const importarVendas = (vendasImportadas) => {
    let maiorId = Math.max(...vendas.map(v => v.idVenda), 0)
    
    const vendasComId = vendasImportadas.map(venda => ({
      ...venda,
      idVenda: ++maiorId
    }))

    const novasVendas = [...vendas, ...vendasComId]
    salvarVendas(novasVendas)
    return { 
      success: true, 
      message: `${vendasImportadas.length} vendas importadas com sucesso!`,
      quantidade: vendasImportadas.length
    }
  }

  const limparVendas = () => {
    salvarVendas(vendasIniciais)
    return { success: true, message: 'Vendas resetadas para dados iniciais!' }
  }

  const value = {
    vendas,
    adicionarVenda,
    importarVendas,
    limparVendas,
    produtos,
    clientes,
    categorias
  }

  return (
    <VendasContext.Provider value={value}>
      {children}
    </VendasContext.Provider>
  )
}

