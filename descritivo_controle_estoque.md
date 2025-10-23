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
- Cadastro de produtos (nome, categoria, descrição, unidade de medida)
- Criação automática durante entrada de mercadorias
- Registro de **lotes** com data de entrada e validade
- Controle de **quantidade em estoque** em tempo real

### 🏢 Gestão de Fornecedores
- Cadastro de fornecedores (nome, CNPJ/CPF, telefone, email, endereço)
- Formatação automática de CPF/CNPJ e telefone
- Validação de campos obrigatórios com mensagens customizadas
- Vinculação de fornecedores às entradas de mercadorias
- Cadastro inline durante entrada (botão "+")
- Modal independente sem conflito de formulários
- CRUD completo com interface intuitiva

### ⏰ Controle de Validade
- Monitoramento automático de **produtos próximos do vencimento** (30 dias)
- Indicação visual de **itens vencidos**
- Endpoints REST para alertas (vencendo, vencidos, contadores)
- Documentação completa no Swagger

### 📦 Controle de Entradas e Saídas
- **Entradas**: Cadastro completo (Produto + Lote + Entrada) em um único formulário
- **Edição de Entradas**: Permite alterar quantidade, data, fornecedor e observação
- **Saídas**: Registro de saída de produtos do estoque
- Atualização automática de quantidade em estoque
- Sincronização perfeita entre Lotes, Entradas e Saídas
- Histórico detalhado separado por tipo (quem, quando e quanto)
- Reversão automática de estoque ao excluir movimentação
- Exclusão em cascata de lotes sem movimentações
- Sistema de notificações Toast (success, error, warning, info)
- Cadastro rápido de fornecedor sem sair da tela de entrada

### 🔔 Alertas e Notificações
- Endpoints REST para alertas de validade
- Contadores em tempo real
- Sistema de Toast com 4 tipos de mensagens
- Feedback visual em todas as operações

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
- **Edição Flexível**: Permite editar entradas já cadastradas com ajuste automático de estoque
- **UI/UX Moderna**: Tema roxo e branco com modo escuro
- **Interface Intuitiva**: Ícones visuais para ações de editar e excluir em todas as funcionalidades
- **Feedback Visual**: Sistema de Toast com 4 tipos (success, error, warning, info)
- **Personalização**: Dashboard com ações rápidas editáveis pelo usuário
- **Segurança**: Validação de token JWT em todas as requisições
- **Formatação Inteligente**: CPF/CNPJ e telefone formatados automaticamente
- **Gestão Completa**: Fornecedores integrados ao fluxo de entradas com exibição na tabela
- **Cadastro Rápido**: Botão "+" para criar fornecedor sem sair da tela de entrada
- **Validações**: Campos obrigatórios com mensagens "Este campo é obrigatório"
- **Estoque Sincronizado**: Quantidade sempre consistente entre Lotes, Entradas e Saídas
- **Modais Padronizados**: Todos os modais com tamanho e comportamento uniformes
- **Exclusão Inteligente**: Lotes deletados automaticamente quando sem movimentações
- **Testes Automatizados**: 54 cenários E2E com Playwright (100% de sucesso)
- **Page Object Model**: Testes organizáveis e manteníveis
- **Execução Paralela**: 4 workers para testes mais rápidos

---



## 🧪 Testes E2E
- **54 cenários automatizados** com Playwright
- **Login**: 10 cenários (credenciais, validações, sessão)
- **Dashboard**: 14 cenários (navegação, tema, ações rápidas)
- **Entradas**: 20 cenários (validações, CRUD, fornecedores, estoque)
- **Saídas**: 10 cenários (validações, CRUD, atualização de estoque, reversão)
- **Page Object Model** para organização
- **Data-testid** para seletores estáveis
- **Limpeza automática** de dados após testes
- **CNPJ único** gerado por timestamp
- **Execução paralela** com 4 workers
- **100% de taxa de sucesso**

---

## 🚀 Possíveis Extensões Futuras
- Integração Frontend com endpoints de alertas
- Dashboard com gráficos (produtos em risco, mais movimentados)
- Filtros e buscas avançadas nas listagens
- Níveis de permissões de usuários (admin, operador, gestor)
- Relatórios exportáveis em PDF ou Excel
- Paginação nas tabelas
- Recuperação de senha por e-mail
- Notificações por e-mail ou WhatsApp
- Impressão de etiquetas de lotes
