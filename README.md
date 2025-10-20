# StarSales - Dashboard Inteligente de Vendas

**StarSales** é um dashboard interativo e inteligente para visualização e análise de vendas em tempo real, desenvolvido como parte do Challenge Astéria 2025.

> 🌟 *StarSales* - Onde suas vendas brilham como estrelas e transformam-se em insights poderosos.

## 🚀 Funcionalidades

### Autenticação
- ✅ Sistema de login com email e senha
- ✅ Cadastro de novos usuários
- ✅ Armazenamento local (localStorage) para apresentação
- ✅ Proteção de rotas

### Dashboard Interativo
- ✅ **Cards de Métricas**: Total de vendas, ticket médio, clientes ativos e transações
- ✅ **Gráficos Dinâmicos**:
  - Linha: Vendas por mês (últimos 12 meses)
  - Barras: Vendas por região (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)
  - Pizza: Vendas por categoria de produto
  - Barras horizontais: Top 5 produtos mais vendidos
- ✅ **Filtros Avançados**:
  - Região de venda
  - Categoria de produto
  - Período (7, 30, 90 dias ou todo o período)
- ✅ **Tabela Detalhada**: Histórico de vendas com informações expandíveis
  - Dados do cliente (nome, sexo, idade)
  - Produtos vendidos na transação
  - Valores detalhados por produto
  - Paginação

### 🆕 Adicionar Vendas Manualmente
- ✅ Formulário completo para registro de vendas
- ✅ Seleção de cliente, região e data
- ✅ Adicionar múltiplos produtos por venda (até 4)
- ✅ Cálculo automático de totais
- ✅ Validação de dados
- ✅ Feedback visual de sucesso/erro

### 🆕 Importação via CSV
- ✅ **Download de Template**: Baixe um arquivo CSV pré-formatado
- ✅ **Instruções Integradas**: Template inclui exemplos e documentação
- ✅ **Upload de Arquivo**: Interface drag-and-drop intuitiva
- ✅ **Validação Completa**:
  - Validação de colunas obrigatórias
  - Verificação de formato de data (YYYY-MM-DD)
  - Validação de IDs de clientes e produtos
  - Verificação de regiões válidas
  - Validação de quantidades
- ✅ **Feedback de Erros**: 
  - Download automático de arquivo com lista de erros
  - Mensagens específicas para cada erro encontrado
  - Linha exata onde o erro ocorreu
- ✅ **Importação em Lote**: Adicione múltiplas vendas de uma vez

### Modelo de Dados
Baseado no diagrama do Challenge, com as seguintes entidades:
- **Cliente**: Nome, Sexo, Idade
- **Produto**: Código, Nome, Preço Unitário, Categoria
- **Categoria**: Nome da categoria
- **Venda**: Data, Região, Cliente, Produtos, Total
- **VendaProduto**: Relação n:n entre Venda e Produto com quantidade

## 🛠️ Tecnologias Utilizadas

- **React 18.3** - Framework JavaScript
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Recharts** - Biblioteca de gráficos interativos
- **Lucide React** - Ícones modernos
- **CSS3** - Estilização com variáveis CSS e responsividade

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ e npm/yarn instalados

### Passos

1. **Instalar dependências**:
```bash
npm install
```

2. **Iniciar o servidor de desenvolvimento**:
```bash
npm run dev
```

3. **Acessar a aplicação**:
Abra o navegador em `http://localhost:3000`

## 🎯 Como Usar

### 1. Criar uma Conta
- Acesse a página de cadastro
- Preencha: Nome, Email e Senha (mínimo 6 caracteres)
- Clique em "Cadastrar"

### 2. Fazer Login
- Use o email e senha cadastrados
- Acesse o dashboard

### 3. Navegar pelas Abas
O sistema possui 3 abas principais:

#### 📊 **Aba Dashboard**
- Visualize as métricas principais nos cards superiores
- Analise os gráficos interativos:
  - Passe o mouse sobre os elementos para ver detalhes
  - Os valores são formatados em Reais (R$)
- Use os filtros para segmentar os dados:
  - Selecione região, categoria ou período
  - Clique em "Limpar Filtros" para resetar
- Explore a tabela de vendas:
  - Clique em uma linha para expandir e ver detalhes
  - Use a paginação para navegar pelo histórico

#### ➕ **Aba Adicionar Venda**
1. Selecione o cliente
2. Escolha a região da venda
3. Defina a data (padrão: hoje)
4. Adicione produtos:
   - Selecione o produto
   - Defina a quantidade
   - Clique em "Adicionar"
5. Revise os produtos adicionados na tabela
6. Clique em "Salvar Venda"

#### 📤 **Aba Importar CSV**
1. **Baixar Template**:
   - Clique em "Baixar Template CSV"
   - O arquivo contém:
     - Headers necessários
     - Exemplo de preenchimento
     - Lista de clientes disponíveis
     - Lista de produtos disponíveis
     - Instruções detalhadas

2. **Preencher o CSV**:
   - Abra o arquivo no Excel, Google Sheets ou editor de texto
   - Adicione suas vendas seguindo o exemplo
   - Cada venda pode ter até 4 produtos
   - Formato de data: YYYY-MM-DD (ex: 2025-01-15)
   - Remova as linhas de comentário (começam com #)

3. **Importar**:
   - Clique em "Selecione o arquivo CSV"
   - Escolha seu arquivo preenchido
   - Clique em "Importar Vendas"

4. **Validação**:
   - ✅ **Sucesso**: Vendas adicionadas ao dashboard
   - ❌ **Erro**: Arquivo com erros é baixado automaticamente
     - Corrija os erros indicados
     - Envie novamente

### 4. Dados de Demonstração
O sistema vem com dados mock pré-carregados:
- 150+ transações de vendas
- 8 clientes diferentes
- 10 produtos em 5 categorias
- Vendas distribuídas nas 5 regiões do Brasil
- Histórico dos últimos 12 meses

**Importante**: Todas as vendas (mock + adicionadas/importadas) são salvas no localStorage do navegador.

## 📁 Estrutura do Projeto

```
src/
├── components/             # Componentes reutilizáveis
│   ├── AddVendaManual.jsx # Formulário de adição manual
│   ├── ChartCard.jsx      # Card com gráficos (Recharts)
│   ├── FilterPanel.jsx    # Painel de filtros
│   ├── ImportCSV.jsx      # Upload e validação de CSV
│   ├── Navbar.jsx         # Barra de navegação
│   ├── SalesTable.jsx     # Tabela de vendas
│   └── StatsCard.jsx      # Card de estatísticas
├── context/               # Context API
│   ├── AuthContext.jsx    # Gerenciamento de autenticação
│   └── VendasContext.jsx  # Gerenciamento de vendas
├── data/                  # Dados mock
│   └── mockData.js        # Dados de demonstração e funções
├── pages/                 # Páginas da aplicação
│   ├── Dashboard.jsx      # Dashboard principal com abas
│   ├── Login.jsx          # Página de login
│   └── Register.jsx       # Página de cadastro
├── styles/                # Arquivos CSS
│   ├── AddVendaManual.css
│   ├── Auth.css
│   ├── ChartCard.css
│   ├── Dashboard.css
│   ├── FilterPanel.css
│   ├── ImportCSV.css
│   ├── Navbar.css
│   ├── SalesTable.css
│   └── StatsCard.css
├── App.jsx                # Componente principal
├── index.css              # Estilos globais
└── main.jsx               # Entry point
```

## 🎨 Design

- Interface moderna e clean
- Paleta de cores em gradiente (roxo/azul)
- Totalmente responsiva (mobile-first)
- Animações suaves
- UX intuitiva inspirada em dashboards BI

## 🔐 Segurança

⚠️ **IMPORTANTE**: Esta é uma aplicação de demonstração. Os dados são armazenados apenas no `localStorage` do navegador. Para uso em produção, implemente:
- Backend com API REST
- Banco de dados real
- Autenticação JWT ou OAuth
- Criptografia de senhas (bcrypt)
- HTTPS
- Validação server-side

## 📋 Formato do CSV

### Colunas Obrigatórias:
```csv
data_venda,id_cliente,regiao,id_produto_1,quantidade_1,id_produto_2,quantidade_2,id_produto_3,quantidade_3,id_produto_4,quantidade_4
```

### Exemplo de Linha:
```csv
2025-01-15,1,Sudeste,1,2,3,1,,,
```

### Regras de Validação:
- **data_venda**: Formato YYYY-MM-DD, data válida
- **id_cliente**: Deve existir na base de clientes (1-8)
- **regiao**: Norte, Nordeste, Centro-Oeste, Sudeste ou Sul
- **id_produto_X**: Deve existir na base de produtos (1-10)
- **quantidade_X**: Número inteiro maior que zero
- **Produtos**: Mínimo 1, máximo 4 por venda

### Produtos Disponíveis:
1. Smartphone (R$ 1.500,00)
2. Notebook (R$ 2.500,00)
3. Café Premium (R$ 45,00)
4. Chá Especial (R$ 35,00)
5. Camisa Social (R$ 120,00)
6. Calça Jeans (R$ 150,00)
7. Cadeira Escritório (R$ 800,00)
8. Mesa Escritório (R$ 1.200,00)
9. Livro Técnico (R$ 65,00)
10. Romance (R$ 45,00)

### Clientes Disponíveis:
1. João Silva (M, 35 anos)
2. Maria Santos (F, 28 anos)
3. Pedro Oliveira (M, 42 anos)
4. Ana Costa (F, 31 anos)
5. Carlos Souza (M, 45 anos)
6. Julia Lima (F, 26 anos)
7. Roberto Alves (M, 38 anos)
8. Patricia Rocha (F, 33 anos)

## 📊 Funcionalidades Futuras

- [ ] Integração com API backend
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Mais tipos de gráficos
- [ ] Comparação de períodos
- [ ] Notificações em tempo real
- [ ] Modo escuro
- [ ] Personalização de dashboard
- [ ] Cadastro de novos produtos e clientes
- [ ] Edição e exclusão de vendas

## 👥 Autores

Projeto desenvolvido para o Challenge Astéria 2025 - FIAP

## 📄 Licença

Este projeto é para fins educacionais.

