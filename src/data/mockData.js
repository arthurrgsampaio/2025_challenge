// Dados Mock baseados no modelo do DB do Challenge Astéria

export const categorias = [
  { idCategoria: 1, nomeCategoria: 'Eletrônicos' },
  { idCategoria: 2, nomeCategoria: 'Alimentos' },
  { idCategoria: 3, nomeCategoria: 'Roupas' },
  { idCategoria: 4, nomeCategoria: 'Móveis' },
  { idCategoria: 5, nomeCategoria: 'Livros' }
]

export const produtos = [
  { idProduto: 1, cdProduto: 'EL001', precoUnitario: 1500.00, idCategoria: 1, nome: 'Smartphone' },
  { idProduto: 2, cdProduto: 'EL002', precoUnitario: 2500.00, idCategoria: 1, nome: 'Notebook' },
  { idProduto: 3, cdProduto: 'AL001', precoUnitario: 45.00, idCategoria: 2, nome: 'Café Premium' },
  { idProduto: 4, cdProduto: 'AL002', precoUnitario: 35.00, idCategoria: 2, nome: 'Chá Especial' },
  { idProduto: 5, cdProduto: 'RO001', precoUnitario: 120.00, idCategoria: 3, nome: 'Camisa Social' },
  { idProduto: 6, cdProduto: 'RO002', precoUnitario: 150.00, idCategoria: 3, nome: 'Calça Jeans' },
  { idProduto: 7, cdProduto: 'MO001', precoUnitario: 800.00, idCategoria: 4, nome: 'Cadeira Escritório' },
  { idProduto: 8, cdProduto: 'MO002', precoUnitario: 1200.00, idCategoria: 4, nome: 'Mesa Escritório' },
  { idProduto: 9, cdProduto: 'LI001', precoUnitario: 65.00, idCategoria: 5, nome: 'Livro Técnico' },
  { idProduto: 10, cdProduto: 'LI002', precoUnitario: 45.00, idCategoria: 5, nome: 'Romance' }
]

export const clientes = [
  { idCliente: 1, nome: 'João Silva', sexo: 'M', idade: 35 },
  { idCliente: 2, nome: 'Maria Santos', sexo: 'F', idade: 28 },
  { idCliente: 3, nome: 'Pedro Oliveira', sexo: 'M', idade: 42 },
  { idCliente: 4, nome: 'Ana Costa', sexo: 'F', idade: 31 },
  { idCliente: 5, nome: 'Carlos Souza', sexo: 'M', idade: 45 },
  { idCliente: 6, nome: 'Julia Lima', sexo: 'F', idade: 26 },
  { idCliente: 7, nome: 'Roberto Alves', sexo: 'M', idade: 38 },
  { idCliente: 8, nome: 'Patricia Rocha', sexo: 'F', idade: 33 }
]

export const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

// Gerar vendas mock
const gerarVendas = () => {
  const vendas = []
  let idVenda = 1

  // Últimos 12 meses
  const hoje = new Date()
  for (let i = 11; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const numVendasMes = Math.floor(Math.random() * 15) + 10 // 10-25 vendas por mês
    
    for (let j = 0; j < numVendasMes; j++) {
      const diaAleatorio = Math.floor(Math.random() * 28) + 1
      const dataVenda = new Date(data.getFullYear(), data.getMonth(), diaAleatorio)
      const cliente = clientes[Math.floor(Math.random() * clientes.length)]
      const regiao = regioes[Math.floor(Math.random() * regioes.length)]
      
      // Produtos vendidos nesta venda (1-4 produtos)
      const numProdutos = Math.floor(Math.random() * 4) + 1
      const produtosVendidos = []
      const produtosEscolhidos = new Set()
      
      for (let k = 0; k < numProdutos; k++) {
        let produto
        do {
          produto = produtos[Math.floor(Math.random() * produtos.length)]
        } while (produtosEscolhidos.has(produto.idProduto))
        
        produtosEscolhidos.add(produto.idProduto)
        const quantidade = Math.floor(Math.random() * 5) + 1
        
        produtosVendidos.push({
          idProduto: produto.idProduto,
          nomeProduto: produto.nome,
          quantidade,
          precoUnitario: produto.precoUnitario,
          idCategoria: produto.idCategoria
        })
      }
      
      const total = produtosVendidos.reduce((sum, p) => sum + (p.quantidade * p.precoUnitario), 0)
      
      vendas.push({
        idVenda,
        idCliente: cliente.idCliente,
        nomeCliente: cliente.nome,
        sexoCliente: cliente.sexo,
        idadeCliente: cliente.idade,
        regiaoVenda: regiao,
        dataVenda: dataVenda.toISOString(),
        total,
        produtos: produtosVendidos
      })
      
      idVenda++
    }
  }
  
  return vendas
}

export const vendas = gerarVendas()

// Funções auxiliares para análise de dados (agora recebem vendas como parâmetro)
export const getVendasPorMes = (vendasData = vendas) => {
  const vendasPorMes = {}
  
  vendasData.forEach(venda => {
    const data = new Date(venda.dataVenda)
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`
    
    if (!vendasPorMes[mesAno]) {
      vendasPorMes[mesAno] = {
        mes: mesAno,
        dataCompleta: data,
        total: 0,
        quantidade: 0
      }
    }
    
    vendasPorMes[mesAno].total += venda.total
    vendasPorMes[mesAno].quantidade += 1
  })
  
  return Object.values(vendasPorMes).sort((a, b) => a.dataCompleta - b.dataCompleta)
}

export const getVendasPorRegiao = (vendasData = vendas) => {
  const vendasPorRegiao = {}
  
  vendasData.forEach(venda => {
    if (!vendasPorRegiao[venda.regiaoVenda]) {
      vendasPorRegiao[venda.regiaoVenda] = {
        regiao: venda.regiaoVenda,
        total: 0,
        quantidade: 0
      }
    }
    
    vendasPorRegiao[venda.regiaoVenda].total += venda.total
    vendasPorRegiao[venda.regiaoVenda].quantidade += 1
  })
  
  return Object.values(vendasPorRegiao).sort((a, b) => b.total - a.total)
}

export const getVendasPorCategoria = (vendasData = vendas) => {
  const vendasPorCategoria = {}
  
  vendasData.forEach(venda => {
    venda.produtos.forEach(produto => {
      const categoria = categorias.find(c => c.idCategoria === produto.idCategoria)
      const nomeCategoria = categoria ? categoria.nomeCategoria : 'Outros'
      
      if (!vendasPorCategoria[nomeCategoria]) {
        vendasPorCategoria[nomeCategoria] = {
          categoria: nomeCategoria,
          total: 0,
          quantidade: 0
        }
      }
      
      vendasPorCategoria[nomeCategoria].total += produto.quantidade * produto.precoUnitario
      vendasPorCategoria[nomeCategoria].quantidade += produto.quantidade
    })
  })
  
  return Object.values(vendasPorCategoria).sort((a, b) => b.total - a.total)
}

export const getTopProdutos = (limite = 10, vendasData = vendas) => {
  const produtosVendidos = {}
  
  vendasData.forEach(venda => {
    venda.produtos.forEach(produto => {
      if (!produtosVendidos[produto.idProduto]) {
        produtosVendidos[produto.idProduto] = {
          idProduto: produto.idProduto,
          nome: produto.nomeProduto,
          quantidadeVendida: 0,
          totalVendido: 0
        }
      }
      
      produtosVendidos[produto.idProduto].quantidadeVendida += produto.quantidade
      produtosVendidos[produto.idProduto].totalVendido += produto.quantidade * produto.precoUnitario
    })
  })
  
  return Object.values(produtosVendidos)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .slice(0, limite)
}

export const getVendasPorGenero = (vendasData = vendas) => {
  const vendasPorGenero = {
    M: { genero: 'Masculino', total: 0, quantidade: 0 },
    F: { genero: 'Feminino', total: 0, quantidade: 0 }
  }
  
  vendasData.forEach(venda => {
    vendasPorGenero[venda.sexoCliente].total += venda.total
    vendasPorGenero[venda.sexoCliente].quantidade += 1
  })
  
  return Object.values(vendasPorGenero)
}

export const getTotalVendas = (vendasData = vendas) => {
  return vendasData.reduce((sum, venda) => sum + venda.total, 0)
}

export const getTicketMedio = (vendasData = vendas) => {
  const total = getTotalVendas(vendasData)
  return vendasData.length > 0 ? total / vendasData.length : 0
}

export const getTotalClientes = (vendasData = vendas) => {
  const clientesUnicos = new Set(vendasData.map(v => v.idCliente))
  return clientesUnicos.size
}

