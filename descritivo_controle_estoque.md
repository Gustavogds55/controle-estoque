# 🧾 Descritivo do Sistema — Controle de Estoque e Validade de Produtos

## 📘 Visão Geral
O sistema tem como objetivo gerenciar o **estoque de produtos**, controlando **quantidades, lotes e prazos de validade**.  
Ele permitirá **cadastrar, editar, remover e monitorar produtos**, emitindo **alertas automáticos** para itens **próximos do vencimento** e **já vencidos**, ajudando na tomada de decisão e evitando prejuízos.

---

## 🎯 Objetivo Principal
Fornecer uma solução leve, moderna e intuitiva para o **controle de estoque com foco em validade de produtos**, voltada para pequenas e médias empresas que necessitam de uma ferramenta prática para acompanhar o ciclo de vida dos seus produtos.

---

## 👥 Público-Alvo
Empresas, comércios e profissionais que precisam gerenciar estoques de produtos perecíveis ou com prazo de validade determinado — como farmácias, mercados, distribuidores e indústrias alimentícias.

---

## ⚙️ Principais Funcionalidades

### 👤 Controle de Usuários
- Sistema de autenticação com email e senha
- Registro e login de usuários
- Rastreamento de movimentações por usuário
- Controle de acesso ao sistema

### 🗃️ Gestão de Produtos
- Cadastro de produtos (nome, categoria, descrição, unidade de medida, etc.)
- Registro de **lotes**, com data de entrada e validade
- Associação de produtos a **fornecedores** (opcional)
- Controle de **quantidade em estoque** e **retiradas** (movimentações)

### ⏰ Controle de Validade
- Monitoramento automático de **produtos próximos do vencimento**
- Indicação visual de **itens vencidos**
- Filtros e buscas por status de validade

### 📦 Movimentação de Estoque
- Entrada e saída de produtos
- Histórico detalhado de movimentações (quem, quando e quanto)
- Geração de relatórios de movimentação e vencimentos

### 🔔 Alertas e Notificações
- Painel de avisos com alertas automáticos
- Possibilidade de envio de notificações (ex: e-mail ou dashboard) — futura implementação

---

## 🧱 Arquitetura e Stack Técnica

### Frontend
- **Nuxt.js (Vue 3)**
  - Framework SPA/SSR para performance e SEO.
  - Comunicação via **Axios** com a API.
  - Interface moderna, responsiva e intuitiva.
  - Uso sugerido de **TailwindCSS** para estilização e **Pinia** para gerenciamento de estado.

### Backend
- **Node.js + Express.js**
  - API RESTful modular (routes, controllers, services).
  - Autenticação JWT + bcrypt para hash de senhas.
  - Integração com **Swagger** para documentação de endpoints.
  - Exportação de **coleções Postman** para testes e integração.

### Banco de Dados
- **MySQL**
  - Tabelas: Usuários, Produtos, Lotes, Movimentações.
  - Relacionamentos:
    - 1 Produto → N Lotes
    - 1 Lote → N Movimentações
    - 1 Usuário → N Movimentações
  - ORM sugerido: **Prisma** ou **Sequelize**.

---

## 📚 Documentação
- **Swagger UI** — `/api-docs`: descrição detalhada de rotas, parâmetros e exemplos.
- **Postman Collection** — para testes e integração manual.
- **README.md** — com instruções de instalação, configuração e uso.
- **Modelo ER** — diagrama do banco de dados.
- **Guia de Deploy** (futuro): passo a passo para implantação em ambiente de produção.

---

## 🚀 Possíveis Extensões Futuras
- Integração com notificações por e-mail ou WhatsApp.
- Dashboard com gráficos (produtos em risco, mais movimentados, etc.).
- Níveis de permissões de usuários (admin, operador, gestor).
- Relatórios exportáveis em PDF ou Excel.
- Recuperação de senha por e-mail.
