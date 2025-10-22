# 🌟 StarSales - Dashboard Inteligente de Vendas

Sistema completo de dashboard para análise e gerenciamento de vendas, desenvolvido para o Challenge Astéria 2025.

## 📋 Sobre o Projeto

StarSales é uma aplicação full-stack moderna que oferece:

- 📊 **Dashboard Analytics** - Visualizações interativas de vendas com gráficos em tempo real
- 💼 **Gestão Completa** - CRUD de vendas, clientes e produtos
- 📈 **Relatórios Inteligentes** - Analytics por região, categoria, período e gênero
- 🔐 **Autenticação Segura** - Sistema de login com JWT e bcrypt
- 📤 **Importação em Lote** - Upload de vendas via CSV
- 🎯 **UX Moderna** - Interface intuitiva, responsiva e com animações suaves
- 🔄 **Sync em Tempo Real** - Dados atualizados automaticamente após operações

## 🏗️ Arquitetura

O projeto está dividido em duas partes principais:

```
2025_challenge/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas principais
│   │   ├── context/       # Context API (Auth, Vendas)
│   │   ├── config/        # Configuração API
│   │   └── styles/        # CSS por componente
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express + Oracle
│   ├── src/
│   │   ├── controllers/   # Lógica de negócios
│   │   ├── models/        # Modelos do banco
│   │   ├── routes/        # Rotas da API
│   │   ├── middlewares/   # Auth, validação, error handler
│   │   ├── config/        # Database e JWT
│   │   └── server.js      # Entry point
│   ├── database/
│   │   └── schema.sql     # Schema Oracle
│   └── package.json
├── package.json       # Scripts do projeto
└── README.md
```

## 🚀 Tecnologias

### Frontend
- **React** 18.3 - Biblioteca UI
- **Vite** 6.0 - Build tool ultrarrápido
- **React Router** 7.0 - Roteamento SPA
- **Recharts** 2.15 - Gráficos responsivos
- **Lucide React** - Ícones modernos
- **Context API** - Gerenciamento de estado
- **CSS Modules** - Estilização isolada

### Backend
- **Node.js** 18+ - Runtime JavaScript
- **Express** 4.21 - Framework web minimalista
- **Oracle Database** 11g+ - Banco de dados robusto
- **oracledb** 6.7 - Driver Node.js para Oracle
- **JWT** (jsonwebtoken) - Autenticação stateless
- **Bcrypt** - Hash seguro de senhas
- **Joi** - Validação de schemas
- **Helmet** - Segurança HTTP headers
- **Express Rate Limit** - Proteção contra brute force

## 📦 Instalação Rápida

### Pré-requisitos

- **Node.js** 18 ou superior
- **Oracle Database** 11g ou superior (XE recomendado)
- **Oracle Instant Client** configurado
- **npm** ou **yarn**

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/2025_challenge.git
cd 2025_challenge
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências (backend + frontend)
npm install

# Ou instalar separadamente:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configurar Banco de Dados

Execute o schema SQL no Oracle:

```bash
cd backend
sqlplus seu_usuario/sua_senha@localhost:1521/XEPDB1 @database/schema.sql
```

O schema criará automaticamente:
- Tabelas: `usuarios`, `clientes`, `categorias`, `produtos`, `vendas`, `venda_produtos`
- Sequences para IDs
- Constraints e relacionamentos
- Dados de exemplo (categorias, clientes, produtos)

### 4. Configurar Variáveis de Ambiente

**Backend** - Crie `backend/.env` baseado no `backend/env.example`:

```env
# ============================================
# CONFIGURAÇÃO STARTSALES BACKEND
# ============================================

# --------------------------------------------
# Server Configuration
# --------------------------------------------
PORT=3000

# --------------------------------------------
# Oracle Database Configuration
# --------------------------------------------
# Credenciais do seu banco Oracle
DB_USER=seu_usuario_oracle
DB_PASSWORD=sua_senha_oracle

# String de conexão no formato: host:porta/service_name
# Exemplos:
#   - Localhost: localhost:1521/XEPDB1
#   - Fiap: oracle.fiap.com.br:1521/ORCL
#   - Remoto: 192.168.1.100:1521/ORCL
DB_CONNECTION_STRING=localhost:1521/XEPDB1

# --------------------------------------------
# OBSERVAÇÕES IMPORTANTES:
# --------------------------------------------
# ✅ JWT, CORS e Rate Limiting já estão pré-configurados
# ✅ Você só precisa configurar as variáveis acima
# ✅ Não é necessário configurar mais nada!
# --------------------------------------------
```

**Nota:** JWT, CORS e outras configurações já estão pré-configuradas no código. Você só precisa configurar as credenciais do Oracle!

### 5. Iniciar os Servidores

**Opção 1 - Iniciar tudo de uma vez (recomendado):**
```bash
npm run dev
```

**Opção 2 - Iniciar separadamente:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Acessar a Aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### 7. Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "Criar Conta"
3. Cadastre-se com email e senha
4. Faça login e explore o dashboard!

## 🎯 Funcionalidades

### 🔐 Autenticação
- ✅ Cadastro de usuários com validação
- ✅ Login com JWT (7 dias de expiração)
- ✅ Proteção de rotas privadas
- ✅ Validação automática de token
- ✅ Logout seguro
- ✅ Isolamento de dados por usuário

### 💰 Gestão de Vendas
- ✅ Listar vendas com paginação (15 por página)
- ✅ Criar venda manual com múltiplos produtos
- ✅ Expandir venda para ver produtos detalhados
- ✅ Importação em lote via CSV
- ✅ Filtros avançados:
  - Data (início e fim)
  - Região (Norte, Sul, Leste, Oeste, Centro)
  - Cliente específico
  - Categoria de produto
- ✅ Reset de filtros
- ✅ Cálculo automático de totais e subtotais

### 👥 Gestão de Clientes
- ✅ Listar clientes com estatísticas
- ✅ Adicionar novo cliente via modal
- ✅ Ver total de vendas por cliente
- ✅ Dados: nome, sexo, idade
- ✅ Sincronização automática após criação

### 📦 Gestão de Produtos
- ✅ Listar produtos com estatísticas
- ✅ Adicionar novo produto via modal
- ✅ Associar a categoria
- ✅ Ver quantidade total vendida
- ✅ Dados: nome, preço unitário, categoria
- ✅ Sincronização automática após criação

### 📊 Analytics e Dashboard
- ✅ **Visão Geral:**
  - Total de vendas (R$)
  - Número de transações
  - Ticket médio
  - Número de clientes únicos
- ✅ **Gráfico de Vendas por Mês** (linha)
- ✅ **Vendas por Região** (pizza)
- ✅ **Vendas por Categoria** (barras)
- ✅ **Vendas por Gênero** (barras)
- ✅ **Top 5 Produtos Mais Vendidos** (lista)
- ✅ Todos os gráficos com tooltips interativos
- ✅ Legendas e formatação de moeda

### 🎨 Interface e UX
- ✅ Design moderno com gradientes
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Loading states em todas as operações
- ✅ Mensagens de sucesso/erro
- ✅ Animações suaves
- ✅ Ícones intuitivos (Lucide)
- ✅ Navbar com navegação clara
- ✅ Formulários com validação
- ✅ Modais para adicionar recursos
- ✅ Tabelas expansíveis
- ✅ Botões com estados (disabled, loading)

### 📤 Importação CSV
- ✅ Upload de arquivo CSV
- ✅ Validação de estrutura
- ✅ Preview de dados antes de importar
- ✅ Processamento em lote
- ✅ Feedback de sucesso/erro
- ✅ Formato esperado documentado

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

```sql
usuarios
  ├── id_usuario (VARCHAR2(36) UUID, PK)
  ├── nome (VARCHAR2(100))
  ├── email (VARCHAR2(100), UNIQUE)
  ├── senha (VARCHAR2(255), hash bcrypt)
  ├── criado_em (DATE)
  └── atualizado_em (DATE)

clientes
  ├── id_cliente (NUMBER, PK, autoincrement)
  ├── nome (VARCHAR2(100))
  ├── sexo (CHAR(1): M/F)
  └── idade (NUMBER)

categorias
  ├── id_categoria (NUMBER, PK, autoincrement)
  └── nome_categoria (VARCHAR2(50), UNIQUE)

produtos
  ├── id_produto (NUMBER, PK, autoincrement)
  ├── cd_produto (VARCHAR2(20), UNIQUE)
  ├── nome (VARCHAR2(100))
  ├── preco_unitario (NUMBER(10,2))
  └── id_categoria (NUMBER, FK → categorias)

vendas
  ├── id_venda (NUMBER, PK, autoincrement)
  ├── id_usuario (VARCHAR2(36), FK → usuarios)
  ├── id_cliente (NUMBER, FK → clientes)
  ├── nome_cliente (VARCHAR2(100), denormalized)
  ├── sexo_cliente (CHAR(1), denormalized)
  ├── idade_cliente (NUMBER, denormalized)
  ├── regiao_venda (VARCHAR2(20))
  ├── data_venda (DATE)
  ├── total (NUMBER(10,2))
  ├── criado_em (DATE)
  └── atualizado_em (DATE)

venda_produtos
  ├── id_venda_produto (NUMBER, PK, autoincrement)
  ├── id_venda (NUMBER, FK → vendas)
  ├── id_produto (NUMBER, FK → produtos)
  ├── nome_produto (VARCHAR2(100), denormalized)
  ├── quantidade (NUMBER)
  ├── preco_unitario (NUMBER(10,2), denormalized)
  ├── id_categoria (NUMBER, denormalized)
  └── subtotal (NUMBER(10,2), calculated)
```

### Desnormalização Estratégica

O banco utiliza desnormalização controlada para:
- **Performance:** Evitar JOINs complexos em queries de analytics
- **Histórico:** Manter dados da venda mesmo se cliente/produto forem alterados
- **Simplicidade:** Queries mais rápidas e simples

## 🔐 Segurança

### Implementações de Segurança

- ✅ **Senhas hasheadas** com bcrypt (salt rounds: 10)
- ✅ **JWT** com expiração configurável
- ✅ **Helmet** para headers HTTP seguros
- ✅ **CORS** configurável por ambiente
- ✅ **Rate Limiting** (100 requisições por 15 min)
- ✅ **Validação de entrada** com Joi
- ✅ **SQL Injection protection** (prepared statements)
- ✅ **Isolamento de dados** por usuário
- ✅ **Middleware de autenticação** em rotas protegidas
- ✅ **Error handling** centralizado sem expor stack traces

## 📝 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### 🔐 Autenticação
```http
POST   /auth/register          # Cadastrar novo usuário
POST   /auth/login             # Login (retorna JWT)
GET    /auth/me                # Validar token e retornar usuário
```

### 💰 Vendas (Autenticado)
```http
GET    /vendas                 # Listar vendas (com filtros e paginação)
GET    /vendas/:id             # Detalhes de uma venda
POST   /vendas                 # Criar nova venda
POST   /vendas/import          # Importar vendas via CSV
```

**Filtros disponíveis:**
- `dataInicio` (YYYY-MM-DD)
- `dataFim` (YYYY-MM-DD)
- `regiao` (Norte, Sul, Leste, Oeste, Centro)
- `idCliente` (número)
- `idCategoria` (número)
- `page` (número, default: 1)
- `limit` (número, default: 15)

### 👥 Clientes (Autenticado)
```http
GET    /clientes               # Listar todos os clientes
GET    /clientes/:id           # Detalhes de um cliente
POST   /clientes               # Criar novo cliente
PUT    /clientes/:id           # Atualizar cliente
DELETE /clientes/:id           # Deletar cliente
```

### 📦 Produtos (Autenticado)
```http
GET    /produtos               # Listar todos os produtos
GET    /produtos/:id           # Detalhes de um produto
POST   /produtos               # Criar novo produto
PUT    /produtos/:id           # Atualizar produto
DELETE /produtos/:id           # Deletar produto
```

### 🏷️ Categorias (Autenticado)
```http
GET    /categorias             # Listar todas as categorias
GET    /categorias/:id         # Detalhes de uma categoria
```

### 📊 Analytics (Autenticado)
```http
GET    /analytics/overview              # Visão geral (cards)
GET    /analytics/vendas-por-mes        # Vendas mensais (gráfico linha)
GET    /analytics/vendas-por-regiao     # Vendas por região (gráfico pizza)
GET    /analytics/vendas-por-categoria  # Vendas por categoria (gráfico barras)
GET    /analytics/vendas-por-genero     # Vendas por gênero (gráfico barras)
GET    /analytics/top-produtos          # Top 5 produtos
```

**Todos os endpoints de analytics aceitam filtros:**
- `dataInicio` (YYYY-MM-DD)
- `dataFim` (YYYY-MM-DD)
- `regiao`
- `idCliente`
- `idCategoria`

## 🛠️ Scripts Úteis

### Root (Projeto Completo)
```bash
npm run dev           # Iniciar backend e frontend simultaneamente
npm run backend       # Apenas backend em modo dev
npm run frontend      # Apenas frontend em modo dev
npm install           # Instalar dependências de backend e frontend
```

### Backend
```bash
npm start             # Produção (NODE_ENV=production)
npm run dev           # Desenvolvimento com nodemon
```

### Frontend
```bash
npm run dev           # Desenvolvimento (hot reload)
npm run build         # Build para produção
npm run preview       # Preview do build de produção
npm run lint          # Rodar ESLint
```

## 📦 Build para Produção

### 1. Backend

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Recomendações:**
- Use PM2 ou similar para gerenciar o processo
- Configure as mesmas variáveis do `.env` em produção (DB_USER, DB_PASSWORD, DB_CONNECTION_STRING, PORT)
- Use HTTPS (reverse proxy como Nginx)
- Configure logs apropriados

### 2. Frontend

```bash
cd frontend
npm run build
```

Os arquivos otimizados estarão em `frontend/dist/`

**Servir com Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/starsales/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🌍 Deploy

### Backend com PM2

```bash
cd backend
npm install -g pm2
pm2 start src/server.js --name starsales-api
pm2 startup
pm2 save
```

**Comandos úteis:**
```bash
pm2 list              # Ver processos
pm2 logs starsales-api # Ver logs
pm2 restart starsales-api
pm2 stop starsales-api
```

### Frontend em Servidor Web

**Opção 1 - Nginx:**
```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/starsales/
```

**Opção 2 - Vercel/Netlify:**
- Build command: `npm run build`
- Output directory: `dist`
- Configurar rewrites para SPA

## 📈 Performance e Otimizações

### Backend
- ⚡ Pool de conexões Oracle (min: 2, max: 10)
- 📊 Prepared statements para todas as queries
- 🔄 Desnormalização estratégica para analytics
- 💾 Isolamento de dados por usuário (WHERE id_usuario)
- 🚀 Middleware de compressão (gzip)

### Frontend
- ⚡ Vite para build ultrarrápido
- 🔄 Lazy loading de componentes
- 💾 Context API para state management eficiente
- 🎨 CSS puro (sem biblioteca pesada)
- 📦 Code splitting automático

## 🧪 Testes

### Teste Manual da API

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'

# Listar vendas (com token)
curl http://localhost:3000/api/v1/vendas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🐛 Troubleshooting

### Erro: "NJS-098: bind placeholders"
- **Causa:** Incompatibilidade entre placeholders SQL e bind parameters
- **Solução:** Verificar que todos os binds estão corretos (implementado)

### Erro: "Connection refused" ao conectar no Oracle
- **Causa:** Oracle não está rodando ou configuração incorreta
- **Solução:**
  ```bash
  # Verificar status do Oracle
  lsnrctl status
  
  # Verificar connection string no .env
  DB_CONNECTION_STRING=localhost:1521/XEPDB1
  ```

### Erro: "Cannot read properties of undefined"
- **Causa:** Dados não carregados antes de renderizar
- **Solução:** Implementar loading states (já implementado)

### Frontend não atualiza após mudanças
- **Solução:** Limpar cache do navegador (Ctrl+Shift+R)

### CORS error
- **Solução:** O CORS já está pré-configurado para `http://localhost:5173`. Se precisar alterar, verifique `backend/src/app.js`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch
   ```bash
   git checkout -b feature/MinhaFeature
   ```
3. Commit suas mudanças
   ```bash
   git commit -m 'Adiciona MinhaFeature'
   ```
4. Push para a branch
   ```bash
   git push origin feature/MinhaFeature
   ```
5. Abra um Pull Request

### Padrões de Código

- **Backend:** ESLint + Prettier
- **Frontend:** ESLint + Prettier
- **Commits:** Conventional Commits
- **Branches:** feature/, bugfix/, hotfix/

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido para o **Challenge Astéria 2025** - FIAP

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Abra uma issue no GitHub
- 💬 Entre em contato com a equipe

## 🙏 Agradecimentos

- **FIAP** pelo desafio inspirador
- **Oracle** pela robustez do banco de dados
- **Comunidade Open Source** pelas bibliotecas incríveis
- **React Team** pela melhor biblioteca UI
- **Vite Team** pela ferramenta de build mais rápida

## 📚 Recursos Úteis

### Documentação
- [React Documentation](https://react.dev)
- [Oracle Node.js Driver](https://oracle.github.io/node-oracledb/)
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/)

### Bibliotecas Utilizadas
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)

---

<div align="center">

**⭐ Desenvolvido com ❤️ para o Challenge Astéria 2025 ⭐**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Oracle](https://img.shields.io/badge/Oracle-11g+-red.svg)](https://www.oracle.com/database/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>
