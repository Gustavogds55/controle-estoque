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
- Controle de **quantidade em estoque** e **retiradas** (movimentações)

### 🏢 Gestão de Fornecedores (EM IMPLEMENTAÇÃO)
- Cadastro de fornecedores (nome, CNPJ, telefone, email, endereço)
- Vinculação de fornecedores às entradas de mercadorias
- Histórico de compras por fornecedor
- Controle de dados de contato e informações fiscais

### ⏰ Controle de Validade
- Monitoramento automático de **produtos próximos do vencimento**
- Indicação visual de **itens vencidos**
- Filtros e buscas por status de validade

### 📦 Controle de Entradas e Saídas
- **Entradas**: Cadastro completo (Produto + Lote + Entrada) em um único formulário
- **Saídas**: Registro de saída de produtos do estoque
- Atualização automática de quantidade em estoque
- Histórico detalhado separado por tipo (quem, quando e quanto)
- Reversão automática de estoque ao excluir movimentação
- Sistema de notificações Toast para feedback visual

### 🔔 Alertas e Notificações
- Painel de avisos com alertas automáticos
- Possibilidade de envio de notificações (ex: e-mail ou dashboard) — futura implementação

---

## 🧱 Arquitetura e Stack Técnica

### Frontend
- **Nuxt.js (Vue 3)**
  - Framework SPA/SSR para performance e SEO.
  - Comunicação via **$fetch** com a API.
  - Interface moderna, responsiva e intuitiva.
  - **TailwindCSS** para estilização e **Pinia** para gerenciamento de estado.
  - **Modo Escuro/Claro** com persistência no localStorage.
  - **Tema roxo e branco** consistente em todo o sistema.
  - **Dashboard personalizável** com ações rápidas editáveis.

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
- **STATUS_PROJETO.md** — acompanhamento detalhado do desenvolvimento.
- **Modelo ER** — diagrama do banco de dados.
- **Guia de Deploy** (futuro): passo a passo para implantação em ambiente de produção.

---

## ✨ Diferenciais Implementados
- **Fluxo Unificado**: Cadastro de Produto + Lote + Entrada em uma única tela
- **UI/UX Moderna**: Tema roxo e branco com modo escuro
- **Feedback Visual**: Sistema de Toast para notificações
- **Personalização**: Dashboard com ações rápidas editáveis pelo usuário
- **Segurança**: Validação de token JWT em todas as requisições

---

## 🔜 Próxima Implementação: Gerenciamento de Fornecedores

### Backend - Tarefas:
1. **Banco de Dados**: Criar tabela `fornecedores` (id, nome, cnpj, telefone, email, endereco)
2. **Service**: `fornecedorService.js` com CRUD completo
3. **Controller**: `fornecedorController.js` para gerenciar requisições
4. **Routes**: `fornecedorRoutes.js` com autenticação JWT
5. **Integração**: Adicionar `fornecedor_id` na tabela `movimentacoes`
6. **Documentação**: Atualizar Swagger e Postman

### Frontend - Tarefas:
1. **Página**: Criar `fornecedores/index.vue` com listagem e CRUD
2. **Sidebar**: Adicionar link "Fornecedores" no menu
3. **Entradas**: Substituir campo texto por select de fornecedores
4. **Tema**: Aplicar cores roxas e modo escuro
5. **Toast**: Feedback visual nas ações

### Resultado Esperado:
- Gerenciar fornecedores (criar, listar, editar, excluir)
- Vincular fornecedor às entradas de mercadorias
- Visualizar fornecedor nas movimentações

---

## 🚀 Possíveis Extensões Futuras
- Integração com notificações por e-mail ou WhatsApp.
- Dashboard com gráficos (produtos em risco, mais movimentados, etc.).
- Níveis de permissões de usuários (admin, operador, gestor).
- Relatórios exportáveis em PDF ou Excel.
- Recuperação de senha por e-mail.
- Filtros e buscas avançadas nas listagens.
- Impressão de etiquetas de lotes.
