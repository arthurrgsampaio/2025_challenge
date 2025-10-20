# 🌟 StarSales - Dashboard Inteligente de Vendas

Sistema completo de dashboard para análise e gerenciamento de vendas, desenvolvido para o Challenge Astéria 2025.

## 📋 Sobre o Projeto

StarSales é uma aplicação full-stack moderna que oferece:

- 📊 **Dashboard Analytics** - Visualizações interativas de vendas
- 💼 **Gestão de Vendas** - CRUD completo de transações
- 📈 **Relatórios Inteligentes** - Analytics por região, categoria, período
- 🔐 **Autenticação Segura** - Sistema de login com JWT
- 📤 **Importação em Lote** - Upload de vendas via CSV
- 🎯 **UX Moderna** - Interface intuitiva e responsiva

## 🏗️ Arquitetura

O projeto está dividido em duas partes principais:

```
2025_challenge_front/
├── frontend/          # React + Vite
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express + Oracle
│   ├── src/
│   ├── database/
│   └── package.json
├── package.json       # Scripts do projeto
└── README.md
```

## 🚀 Tecnologias

### Frontend
- **React** 18.3 - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Roteamento
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **CSS Modules** - Estilização

### Backend
- **Node.js** 18+ - Runtime
- **Express** 4.18 - Framework web
- **Oracle Database** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Joi** - Validação

## 📦 Instalação Rápida

### Pré-requisitos

- Node.js 18 ou superior
- Oracle Database 11g ou superior
- Oracle Instant Client
- npm ou yarn

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/2025_challenge_front.git
cd 2025_challenge_front
```

### 2. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configurar Banco de Dados

Execute o schema SQL no Oracle:
```bash
cd backend
sqlplus seu_usuario/sua_senha@localhost:1521/XEPDB1 @database/schema.sql
```

### 4. Configurar Variáveis de Ambiente

**Backend** - Crie `backend/.env`:
```env
PORT=3000
NODE_ENV=development

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_CONNECTION_STRING=localhost:1521/XEPDB1

JWT_SECRET=sua_chave_secreta_forte_256_bits
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:5173
```

### 5. Iniciar os Servidores

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

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🎯 Funcionalidades

### ✅ Implementadas

#### Autenticação
- [x] Cadastro de usuários
- [x] Login com JWT
- [x] Proteção de rotas
- [x] Validação de token

#### Vendas
- [x] Listar vendas com filtros
- [x] Criar nova venda
- [x] Ver detalhes de venda
- [x] Importação em lote via CSV
- [x] Filtros por data, região, cliente, categoria

#### Analytics
- [x] Visão geral (total vendas, ticket médio, etc)
- [x] Vendas por mês (gráfico de linha)
- [x] Vendas por região (gráfico de pizza)
- [x] Vendas por categoria (gráfico de barras)
- [x] Vendas por gênero
- [x] Top produtos mais vendidos

#### Recursos
- [x] Listar clientes com estatísticas
- [x] Listar produtos com estatísticas
- [x] Listar categorias
- [x] Ver detalhes de cliente/produto

#### Interface
- [x] Dashboard interativo
- [x] Design responsivo
- [x] Tema moderno
- [x] Navegação intuitiva
- [x] Loading states
- [x] Tratamento de erros

## 📊 Estrutura do Banco de Dados

```
usuarios
  ├── id (UUID, PK)
  ├── nome
  ├── email (unique)
  └── password (hash)

clientes
  ├── id_cliente (PK)
  ├── nome
  ├── sexo
  └── idade

categorias
  ├── id_categoria (PK)
  └── nome_categoria

produtos
  ├── id_produto (PK)
  ├── cd_produto
  ├── nome
  ├── preco_unitario
  └── id_categoria (FK)

vendas
  ├── id_venda (PK)
  ├── id_usuario (FK)
  ├── id_cliente (FK)
  ├── nome_cliente (denormalized)
  ├── sexo_cliente (denormalized)
  ├── idade_cliente (denormalized)
  ├── regiao_venda
  ├── data_venda
  └── total

venda_produtos
  ├── id_venda_produto (PK)
  ├── id_venda (FK)
  ├── id_produto (FK)
  ├── nome_produto (denormalized)
  ├── quantidade
  ├── preco_unitario (denormalized)
  ├── id_categoria (denormalized)
  └── subtotal
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Autenticação JWT
- ✅ Rate limiting (anti-brute force)
- ✅ Helmet (headers de segurança)
- ✅ Validação de entrada
- ✅ CORS configurável
- ✅ Isolamento de dados por usuário
- ✅ SQL Injection protection (prepared statements)

## 📝 API Endpoints

### Autenticação
```
POST   /api/v1/auth/register  - Cadastrar
POST   /api/v1/auth/login     - Login
GET    /api/v1/auth/me        - Validar token
```

### Vendas
```
GET    /api/v1/vendas         - Listar
GET    /api/v1/vendas/:id     - Detalhes
POST   /api/v1/vendas         - Criar
POST   /api/v1/vendas/import  - Importar lote
```

### Recursos
```
GET    /api/v1/clientes       - Listar clientes
GET    /api/v1/clientes/:id   - Detalhes cliente
GET    /api/v1/produtos       - Listar produtos
GET    /api/v1/produtos/:id   - Detalhes produto
GET    /api/v1/categorias     - Listar categorias
```

### Analytics
```
GET    /api/v1/analytics/overview           - Visão geral
GET    /api/v1/analytics/vendas-por-mes     - Por mês
GET    /api/v1/analytics/vendas-por-regiao  - Por região
GET    /api/v1/analytics/vendas-por-categoria - Por categoria
GET    /api/v1/analytics/vendas-por-genero  - Por gênero
GET    /api/v1/analytics/top-produtos       - Top produtos
```

## 📱 Capturas de Tela

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Gestão de Vendas
![Vendas](docs/screenshots/vendas.png)

### Analytics
![Analytics](docs/screenshots/analytics.png)

## 🧪 Testes

### Testar Backend

```bash
cd backend
npm test
```

### Testar Frontend

```bash
cd frontend
npm test
```

## 📈 Performance

- ⚡ Tempo de resposta médio: < 100ms
- 📊 Pool de conexões Oracle otimizado
- 🔄 Lazy loading de componentes
- 💾 Cache de dados quando apropriado

## 🛠️ Scripts Úteis

### Root
```bash
npm run dev           # Iniciar backend e frontend
npm run backend       # Apenas backend
npm run frontend      # Apenas frontend
```

### Backend
```bash
npm start             # Produção
npm run dev           # Desenvolvimento
npm test              # Testes
```

### Frontend
```bash
npm run dev           # Desenvolvimento
npm run build         # Build produção
npm run preview       # Preview build
```

## 📦 Build para Produção

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Arquivos em: frontend/dist
```

## 🌍 Deploy

### Backend (exemplo com PM2)
```bash
cd backend
npm install -g pm2
pm2 start src/server.js --name starsales-api
pm2 save
```

### Frontend (exemplo com Nginx)
```bash
cd frontend
npm run build
# Copiar dist/ para /var/www/starsales
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- Desenvolvido para o Challenge Astéria 2025

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato com a equipe

## 🙏 Agradecimentos

- FIAP pelo desafio
- Oracle pela tecnologia
- Comunidade open source

---

**Desenvolvido com ❤️ para o Challenge Astéria 2025**
