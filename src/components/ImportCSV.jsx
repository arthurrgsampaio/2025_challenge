import React, { useState } from 'react'
import { useVendas } from '../context/VendasContext'
import { Download, Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react'
import '../styles/ImportCSV.css'

const ImportCSV = () => {
  const { importarVendas, produtos, clientes } = useVendas()
  const [arquivo, setArquivo] = useState(null)
  const [erros, setErros] = useState([])
  const [sucesso, setSucesso] = useState('')
  const [processando, setProcessando] = useState(false)

  const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

  const gerarTemplateCSV = () => {
    const headers = [
      'data_venda',
      'id_cliente',
      'regiao',
      'id_produto_1',
      'quantidade_1',
      'id_produto_2',
      'quantidade_2',
      'id_produto_3',
      'quantidade_3',
      'id_produto_4',
      'quantidade_4'
    ]

    // Adicionar exemplo
    const exemplo = [
      '2025-01-15',
      '1',
      'Sudeste',
      '1',
      '2',
      '3',
      '1',
      '',
      '',
      '',
      ''
    ]

    // Adicionar informações sobre clientes e produtos
    const info = [
      '',
      '# CLIENTES DISPONÍVEIS:',
      ...clientes.map(c => `# ${c.idCliente} - ${c.nome} (${c.sexo}, ${c.idade} anos)`),
      '',
      '# PRODUTOS DISPONÍVEIS:',
      ...produtos.map(p => `# ${p.idProduto} - ${p.nome} - R$ ${p.precoUnitario.toFixed(2)}`),
      '',
      '# REGIÕES: Norte, Nordeste, Centro-Oeste, Sudeste, Sul',
      '',
      '# INSTRUÇÕES:',
      '# - data_venda: formato YYYY-MM-DD',
      '# - Pode adicionar até 4 produtos por venda',
      '# - Deixe os campos de produto/quantidade vazios se não usar todos',
      '# - Remova as linhas de comentário (#) antes de enviar'
    ]

    const csv = [
      headers.join(','),
      exemplo.join(','),
      '',
      ...info
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_vendas_starsales.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const validarLinha = (linha, numeroLinha) => {
    const errosLinha = []

    // Validar data
    if (!linha.data_venda) {
      errosLinha.push(`Linha ${numeroLinha}: Data da venda é obrigatória`)
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dataRegex.test(linha.data_venda)) {
        errosLinha.push(`Linha ${numeroLinha}: Data inválida (use formato YYYY-MM-DD)`)
      } else {
        const data = new Date(linha.data_venda)
        if (isNaN(data.getTime())) {
          errosLinha.push(`Linha ${numeroLinha}: Data inválida`)
        }
      }
    }

    // Validar cliente
    if (!linha.id_cliente) {
      errosLinha.push(`Linha ${numeroLinha}: ID do cliente é obrigatório`)
    } else {
      const idCliente = parseInt(linha.id_cliente)
      if (isNaN(idCliente) || !clientes.find(c => c.idCliente === idCliente)) {
        errosLinha.push(`Linha ${numeroLinha}: ID do cliente ${linha.id_cliente} não existe`)
      }
    }

    // Validar região
    if (!linha.regiao) {
      errosLinha.push(`Linha ${numeroLinha}: Região é obrigatória`)
    } else if (!regioes.includes(linha.regiao)) {
      errosLinha.push(`Linha ${numeroLinha}: Região "${linha.regiao}" inválida. Use: ${regioes.join(', ')}`)
    }

    // Validar produtos (pelo menos um)
    let temProduto = false
    for (let i = 1; i <= 4; i++) {
      const idProduto = linha[`id_produto_${i}`]
      const quantidade = linha[`quantidade_${i}`]

      if (idProduto || quantidade) {
        temProduto = true

        if (!idProduto) {
          errosLinha.push(`Linha ${numeroLinha}: ID do produto ${i} não pode estar vazio se quantidade foi informada`)
        } else {
          const id = parseInt(idProduto)
          if (isNaN(id) || !produtos.find(p => p.idProduto === id)) {
            errosLinha.push(`Linha ${numeroLinha}: ID do produto ${idProduto} não existe`)
          }
        }

        if (!quantidade) {
          errosLinha.push(`Linha ${numeroLinha}: Quantidade do produto ${i} não pode estar vazia`)
        } else {
          const qtd = parseInt(quantidade)
          if (isNaN(qtd) || qtd <= 0) {
            errosLinha.push(`Linha ${numeroLinha}: Quantidade do produto ${i} deve ser maior que zero`)
          }
        }
      }
    }

    if (!temProduto) {
      errosLinha.push(`Linha ${numeroLinha}: Adicione pelo menos um produto`)
    }

    return errosLinha
  }

  const processarCSV = (texto) => {
    const linhas = texto.split('\n').filter(l => l.trim() && !l.startsWith('#'))
    
    if (linhas.length < 2) {
      return { success: false, erros: ['Arquivo CSV vazio ou sem dados'] }
    }

    const headers = linhas[0].split(',').map(h => h.trim())
    const headersEsperados = [
      'data_venda',
      'id_cliente',
      'regiao',
      'id_produto_1',
      'quantidade_1',
      'id_produto_2',
      'quantidade_2',
      'id_produto_3',
      'quantidade_3',
      'id_produto_4',
      'quantidade_4'
    ]

    // Validar headers
    const headersFaltando = headersEsperados.filter(h => !headers.includes(h))
    if (headersFaltando.length > 0) {
      return {
        success: false,
        erros: [`Colunas faltando no arquivo: ${headersFaltando.join(', ')}`]
      }
    }

    const vendasParaImportar = []
    const todosErros = []

    // Processar cada linha
    for (let i = 1; i < linhas.length; i++) {
      const valores = linhas[i].split(',').map(v => v.trim())
      const linha = {}
      
      headers.forEach((header, index) => {
        linha[header] = valores[index] || ''
      })

      const errosLinha = validarLinha(linha, i + 1)
      
      if (errosLinha.length > 0) {
        todosErros.push(...errosLinha)
      } else {
        // Construir objeto de venda
        const cliente = clientes.find(c => c.idCliente === parseInt(linha.id_cliente))
        const produtosVenda = []

        for (let j = 1; j <= 4; j++) {
          const idProduto = linha[`id_produto_${j}`]
          const quantidade = linha[`quantidade_${j}`]

          if (idProduto && quantidade) {
            const produto = produtos.find(p => p.idProduto === parseInt(idProduto))
            produtosVenda.push({
              idProduto: produto.idProduto,
              nomeProduto: produto.nome,
              quantidade: parseInt(quantidade),
              precoUnitario: produto.precoUnitario,
              idCategoria: produto.idCategoria
            })
          }
        }

        const total = produtosVenda.reduce((sum, p) => sum + (p.quantidade * p.precoUnitario), 0)

        vendasParaImportar.push({
          idCliente: cliente.idCliente,
          nomeCliente: cliente.nome,
          sexoCliente: cliente.sexo,
          idadeCliente: cliente.idade,
          regiaoVenda: linha.regiao,
          dataVenda: new Date(linha.data_venda).toISOString(),
          total,
          produtos: produtosVenda
        })
      }
    }

    if (todosErros.length > 0) {
      return { success: false, erros: todosErros }
    }

    return { success: true, vendas: vendasParaImportar }
  }

  const gerarCSVComErros = (erros) => {
    const conteudo = [
      '# ERROS ENCONTRADOS NO SEU ARQUIVO:',
      '',
      ...erros.map(erro => `# ${erro}`),
      '',
      '# Corrija os erros acima e envie o arquivo novamente',
      '# Você pode baixar um novo template clicando no botão "Baixar Template"'
    ].join('\n')

    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'vendas_com_erros.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setErros(['Por favor, selecione um arquivo CSV'])
        return
      }
      setArquivo(file)
      setErros([])
      setSucesso('')
    }
  }

  const handleUpload = async () => {
    if (!arquivo) {
      setErros(['Selecione um arquivo CSV'])
      return
    }

    setProcessando(true)
    setErros([])
    setSucesso('')

    try {
      const texto = await arquivo.text()
      const resultado = processarCSV(texto)

      if (resultado.success) {
        const importResult = importarVendas(resultado.vendas)
        setSucesso(importResult.message)
        setArquivo(null)
        // Limpar input
        document.getElementById('file-input').value = ''
      } else {
        setErros(resultado.erros)
        // Gerar arquivo com erros
        gerarCSVComErros(resultado.erros)
      }
    } catch (error) {
      setErros(['Erro ao processar arquivo: ' + error.message])
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="import-csv-container">
      <div className="import-csv-header">
        <FileText size={24} />
        <h2>Importar Vendas via CSV</h2>
      </div>

      <div className="import-instructions">
        <h3>Como importar vendas:</h3>
        <ol>
          <li>Baixe o template CSV clicando no botão abaixo</li>
          <li>Preencha o arquivo com os dados das vendas</li>
          <li>Siga as instruções e exemplos no arquivo</li>
          <li>Remova as linhas de comentário (que começam com #)</li>
          <li>Faça o upload do arquivo preenchido</li>
        </ol>
      </div>

      <div className="import-actions">
        <button className="btn-download" onClick={gerarTemplateCSV}>
          <Download size={20} />
          Baixar Template CSV
        </button>
      </div>

      <div className="upload-section">
        <div className="upload-area">
          <Upload size={32} />
          <p>Selecione o arquivo CSV preenchido</p>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          {arquivo && (
            <div className="file-selected">
              Arquivo selecionado: <strong>{arquivo.name}</strong>
            </div>
          )}
        </div>

        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={!arquivo || processando}
        >
          {processando ? 'Processando...' : 'Importar Vendas'}
        </button>
      </div>

      {sucesso && (
        <div className="message message-success">
          <CheckCircle size={20} />
          <span>{sucesso}</span>
        </div>
      )}

      {erros.length > 0 && (
        <div className="message message-error">
          <AlertCircle size={20} />
          <div>
            <strong>Erros encontrados no arquivo:</strong>
            <ul>
              {erros.slice(0, 10).map((erro, index) => (
                <li key={index}>{erro}</li>
              ))}
              {erros.length > 10 && (
                <li><em>... e mais {erros.length - 10} erros</em></li>
              )}
            </ul>
            <p className="error-help">
              Um arquivo com todos os erros foi baixado automaticamente. 
              Corrija os erros e tente novamente.
            </p>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>Informações Importantes:</h3>
        <ul>
          <li><strong>Formato da data:</strong> YYYY-MM-DD (ex: 2025-01-15)</li>
          <li><strong>Regiões válidas:</strong> Norte, Nordeste, Centro-Oeste, Sudeste, Sul</li>
          <li><strong>Produtos por venda:</strong> Você pode adicionar até 4 produtos por venda</li>
          <li><strong>Validação:</strong> O sistema validará todos os dados antes de importar</li>
          <li><strong>Erros:</strong> Se houver erros, um arquivo com as correções necessárias será baixado</li>
        </ul>
      </div>
    </div>
  )
}

export default ImportCSV

