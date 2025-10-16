# 📊 Status do Projeto - Controle de Estoque

## 🗂️ Estrutura do Projeto
```
controle-estoque/
├── frontend/          # Aplicação Nuxt.js (Vue 3)
├── backend/           # API Node.js + Express
├── descritivo_controle_estoque.md
├── STATUS_PROJETO.md
└── README.md
```

---

## ✅ Status Atual: BANCO DE DADOS CRIADO

### 📅 Última Atualização
**Data**: Janeiro 2024  
**Fase**: Estruturação do Banco de Dados

---

## 🎯 Metodologia de Desenvolvimento
Desenvolvimento **incremental e validado**, onde cada funcionalidade será:
1. Implementada
2. Testada
3. Validada pelo desenvolvedor
4. Documentada antes de prosseguir

---

## 📦 Componentes do Sistema

### Backend (`/backend`)
**Stack**: Node.js + Express.js + MySQL + Prisma/Sequelize

**Status**: ⚪ Não iniciado

**Funcionalidades Planejadas**:
- [ ] Configuração inicial do projeto (package.json, estrutura de pastas)
- [x] Configuração do banco de dados MySQL
- [x] Modelagem e criação das tabelas (Usuários, Produtos, Lotes, Movimentações)
- [ ] Sistema de autenticação (login/registro)
- [ ] CRUD de Produtos
- [ ] CRUD de Lotes
- [ ] Sistema de Movimentações (entrada/saída)
- [ ] Lógica de alertas de validade
- [ ] Documentação Swagger
- [ ] Coleção Postman

**Estrutura Planejada**:
```
backend/
├── src/
│   ├── config/        # Configurações (DB, env)
│   ├── models/        # Modelos do banco
│   ├── controllers/   # Controladores
│   ├── services/      # Lógica de negócio
│   ├── routes/        # Rotas da API
│   └── middlewares/   # Middlewares
├── prisma/            # Schema Prisma
├── .env.example
├── package.json
└── server.js
```

---

### Frontend (`/frontend`)
**Stack**: Nuxt.js (Vue 3) + TailwindCSS + Pinia + Axios

**Status**: ⚪ Não iniciado

**Funcionalidades Planejadas**:
- [ ] Configuração inicial do Nuxt.js
- [ ] Configuração do TailwindCSS
- [ ] Configuração do Pinia (gerenciamento de estado)
- [ ] Tela de listagem de produtos
- [ ] Tela de cadastro/edição de produtos
- [ ] Tela de gestão de lotes
- [ ] Tela de movimentações
- [ ] Dashboard de alertas de validade
- [ ] Filtros e buscas
- [ ] Integração com API backend

**Estrutura Planejada**:
```
frontend/
├── pages/             # Páginas Nuxt
├── components/        # Componentes Vue
├── stores/            # Stores Pinia
├── composables/       # Composables Vue
├── services/          # Serviços API (Axios)
├── assets/            # CSS, imagens
├── nuxt.config.ts
└── package.json
```

---

## 🗄️ Modelagem do Banco de Dados

### Tabelas Principais

**usuarios**
- id (PK)
- nome
- email (UNIQUE)
- senha (hash)
- created_at
- updated_at

**produtos**
- id (PK)
- nome
- categoria
- descricao
- unidade_medida
- created_at
- updated_at

**lotes**
- id (PK)
- produto_id (FK)
- numero_lote
- quantidade_inicial
- quantidade_atual
- data_entrada
- data_validade
- created_at
- updated_at

**movimentacoes**
- id (PK)
- lote_id (FK)
- usuario_id (FK)
- tipo (ENTRADA/SAIDA)
- quantidade
- data_movimentacao
- observacao
- created_at

**Relacionamentos**:
- 1 Produto → N Lotes
- 1 Lote → N Movimentações
- 1 Usuário → N Movimentações

---

## 🚀 Próximos Passos

### Etapa 1: Setup Backend
1. Criar estrutura de pastas do backend
2. Configurar package.json e dependências
3. Configurar conexão com MySQL
4. Criar schema do Prisma/Sequelize

### Etapa 2: API Básica
1. Implementar CRUD de Produtos
2. Implementar CRUD de Lotes
3. Testar endpoints com Postman

### Etapa 3: Setup Frontend
1. Criar projeto Nuxt.js
2. Configurar TailwindCSS
3. Criar layout base

### Etapa 4: Integração
1. Conectar frontend com backend
2. Implementar telas de produtos e lotes

---

## 📝 Notas de Desenvolvimento

### Decisões Técnicas
- **Banco de Dados**: MySQL (controle_estoque)
- **ORM**: [A definir - Prisma ou Sequelize]
- **Autenticação**: JWT + bcrypt para hash de senhas
- **Validação**: Usar biblioteca de validação (ex: Joi, Zod)

### Convenções
- Commits em português
- Nomenclatura de variáveis e funções em inglês
- Comentários em português quando necessário

---

## 🔄 Histórico de Alterações

| Data | Descrição | Status |
|------|-----------|--------|
| Jan/2024 | Criação do arquivo de status | Planejamento |
| Jan/2024 | Criação do banco de dados MySQL | Concluído |
| Jan/2024 | Adição de controle de usuários | Concluído |

---

## 📌 Observações Importantes
- Desenvolvimento será feito de forma **incremental**
- Cada funcionalidade será **validada** antes de prosseguir
- Documentação será atualizada a cada etapa concluída
- Foco em código **mínimo e funcional**
