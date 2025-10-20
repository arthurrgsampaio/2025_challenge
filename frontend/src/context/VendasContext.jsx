import React, { createContext, useContext, useState, useEffect } from 'react'
import { vendasAPI, produtosAPI, clientesAPI, categoriasAPI } from '../config/api'

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
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  const carregarDados = async () => {
    try {
      const [vendasRes, produtosRes, clientesRes, categoriasRes] = await Promise.all([
        vendasAPI.listar(),
        produtosAPI.listar(),
        clientesAPI.listar(),
        categoriasAPI.listar(),
      ])

      if (vendasRes.success) setVendas(vendasRes.data)
      if (produtosRes.success) setProdutos(produtosRes.data)
      if (clientesRes.success) setClientes(clientesRes.data)
      if (categoriasRes.success) setCategorias(categoriasRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const adicionarVenda = async (vendaData) => {
    try {
      const response = await vendasAPI.criar(vendaData)
      
      if (response.success) {
        // Recarregar vendas após adicionar
        await carregarDados()
        return { success: true, message: response.message || 'Venda adicionada com sucesso!' }
      }
      
      return { success: false, message: response.message || 'Erro ao adicionar venda' }
    } catch (error) {
      return { success: false, message: error.message || 'Erro ao adicionar venda' }
    }
  }

  const importarVendas = async (vendasImportadas) => {
    try {
      const response = await vendasAPI.importar(vendasImportadas)
      
      if (response.success) {
        // Recarregar vendas após importar
        await carregarDados()
        return { 
          success: true, 
          message: response.message || `${vendasImportadas.length} vendas importadas com sucesso!`,
          quantidade: vendasImportadas.length
        }
      }
      
      return { success: false, message: response.message || 'Erro ao importar vendas' }
    } catch (error) {
      return { success: false, message: error.message || 'Erro ao importar vendas' }
    }
  }

  const atualizarVendas = async (filtros = {}) => {
    try {
      const response = await vendasAPI.listar(filtros)
      if (response.success) {
        setVendas(response.data)
      }
    } catch (error) {
      console.error('Erro ao atualizar vendas:', error)
    }
  }

  const value = {
    vendas,
    produtos,
    clientes,
    categorias,
    adicionarVenda,
    importarVendas,
    atualizarVendas,
    loading
  }

  return (
    <VendasContext.Provider value={value}>
      {children}
    </VendasContext.Provider>
  )
}

