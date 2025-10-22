# Sistema de Controle de Estoque

[![Status](https://img.shields.io/badge/status-concluído-success)](https://github.com)
[![Testes](https://img.shields.io/badge/testes-44%20passando-brightgreen)](https://github.com)
[![Cobertura](https://img.shields.io/badge/cobertura-E2E-blue)](https://github.com)

Sistema completo de gerenciamento de estoque com rastreamento de lotes, movimentações, alertas de validade e testes automatizados end-to-end.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- MySQL
- Swagger (Documentação API)

### Frontend
- Nuxt.js 3
- Vue 3
- TailwindCSS
- Modo Escuro/Claro

### Testes
- Playwright (E2E)
- Page Object Model
- Execução Paralela (4 workers)

## 📋 Funcionalidades

### Gestão de Produtos
- Cadastro com nome, categoria e unidade de medida
- Criação automática durante entrada

### Controle de Lotes
- Rastreamento por número de lote
- Data de validade
- Quantidade atual em tempo real
- Exclusão automática quando sem movimentações

### Movimentações
- **Entradas**: Registro com NF, fornecedor e observações
- **Saídas**: Controle de retirada com atualização automática de estoque
- Histórico completo de movimentações

### Fornecedores
- Cadastro inline durante entrada (botão "+")
- CPF/CNPJ e telefone formatados
- Modal independente sem conflito de formulários

### Sistema de Alertas
- Lotes vencendo (próximos 30 dias)
- Lotes vencidos
- Contadores em tempo real
- Endpoints REST documentados

### Interface
- Tema claro/escuro
- Toasts com 4 tipos (success, error, warning, info)
- Validação de campos obrigatórios com mensagens customizadas
- Responsivo

## 🧪 Testes E2E

### Cobertura Total: 44 Cenários ✅
- **Login**: 10 cenários
- **Dashboard**: 14 cenários
- **Entradas**: 20 cenários

### Cenários de Teste - Login (10)
1. Login com credenciais válidas
2. Login com usuário inválido
3. Login com senha inválida
4. Validação de campos obrigatórios
5. Redirecionamento após login
6. Persistência de sessão
7. Logout
8. Validação de token
9. Mensagens de erro
10. Interface responsiva

### Cenários de Teste - Dashboard (14)
1. Exibição de cards de resumo
2. Navegação para Produtos
3. Navegação para Lotes
4. Navegação para Entradas
5. Navegação para Saídas
6. Navegação para Fornecedores
7. Alternância de tema claro/escuro
8. Logout do sistema
9. Exibição de nome do usuário
10. Ações rápidas
11. Edição de ação rápida
12. Modal de ações
13. Validação de dados
14. Responsividade

### Cenários de Teste - Entradas (20)
1. Validação de campo "Nome do Produto" obrigatório
2. Validação de campo "Unidade de Medida" obrigatório
3. Validação de campo "Número do Lote" obrigatório
4. Validação de campo "Data de Validade" obrigatório
5. Validação de campo "Número da NF" obrigatório
6. Validação de campo "Fornecedor" obrigatório
7. Validação de campo "Quantidade" obrigatório
8. Validação de campo "Data e Hora" obrigatório
9. Cadastro completo de entrada
10. Criação automática de produto
11. Criação automática de lote
12. Fluxo completo: entrada → lote → saída (validação de estoque)
13. Criação de fornecedor inline durante entrada
14. Cadastro completo com novo fornecedor
15. Cancelamento de cadastro de fornecedor
16. Exclusão em cascata de lote ao excluir entrada
17. Edição de entrada existente
18. Validação de toast de sucesso
19. Fechamento automático de modal de fornecedor
20. Limpeza automática de dados de teste

### Execução
```bash
# Todos os testes
npm test

# Apenas entradas
npx playwright test entradas.spec.js

# Modo headed
npx playwright test --headed
```

## 🔧 Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Banco de Dados
```sql
-- Execute o script de criação das tabelas
-- Localizado em: backend/database/schema.sql
```

## 📡 API Endpoints

### Movimentações
- `GET /api/movimentacoes` - Listar (filtro por tipo)
- `POST /api/movimentacoes` - Criar
- `PUT /api/movimentacoes/:id` - Atualizar
- `DELETE /api/movimentacoes/:id` - Excluir (com exclusão em cascata)

### Alertas
- `GET /api/alertas/vencendo` - Lotes vencendo
- `GET /api/alertas/vencidos` - Lotes vencidos
- `GET /api/alertas/contadores` - Contadores

### Documentação Completa
- Swagger: `http://localhost:3001/api-docs`
- Postman: `backend/docs/postman_collection.json`

## 🎯 Destaques Técnicos

### Controle de Estoque
- Lote inicia com `quantidade_atual=0`
- Movimentação ajusta estoque em transação
- Evita duplicação de quantidade

### Exclusão Inteligente
- Backend deleta lote automaticamente quando última movimentação é removida
- Mantém integridade referencial

### Modal de Fornecedor
- Sem formulário aninhado
- Fecha automaticamente após salvar
- Toast de confirmação
- Fornecedor selecionado automaticamente

### Validação de Campos
- Mensagens "Este campo é obrigatório"
- Exibição abaixo de cada campo
- Asterisco (*) em labels obrigatórios
- Validação antes do submit

### Testes Confiáveis
- Page Object Model para manutenibilidade
- Data-testid para seletores estáveis
- Limpeza automática de dados após cada teste
- CNPJ único gerado por timestamp (evita duplicação)
- Timeouts estratégicos para operações assíncronas
- Execução paralela com 4 workers
- 100% de taxa de sucesso nos testes

## 📊 Estrutura do Projeto

```
controle-estoque/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── config/
│   └── docs/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── composables/
│   └── layouts/
└── tests/
    ├── pages/
    ├── login.spec.js
    ├── dashboard.spec.js
    └── entradas.spec.js
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

MIT