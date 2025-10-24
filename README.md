# Sistema de Controle de Estoque

[![Status](https://img.shields.io/badge/status-concluído-success)](https://github.com)
[![Testes](https://img.shields.io/badge/testes-122%20passando-brightgreen)](https://github.com)
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

### Cobertura Total: 122 Cenários ✅
- **Login**: 10 cenários
- **Dashboard**: 14 cenários
- **Produtos**: 15 cenários
- **Entradas**: 20 cenários
- **Saídas**: 13 cenários
- **Lotes**: 20 cenários
- **Fornecedores**: 20 cenários
- **Integração**: 10 cenários

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

### Cenários de Teste - Produtos (15)
1. Exibição da tela de produtos
2. Exibição de mensagem informativa sobre cadastro via Entradas
3. Validar campo "Nome" obrigatório
4. Validar campo "Unidade de Medida" obrigatório
5. Validar campos vazios simultaneamente
6. Validar asterisco em campos obrigatórios
7. Exibição de tabela com colunas corretas
8. Editar nome do produto
9. Editar categoria do produto
10. Editar unidade de medida do produto
11. Editar descrição do produto
12. Excluir produto com sucesso
13. Cancelar edição de produto
14. Fechar modal ao clicar fora dele
15. Refletir edição de produto nos lotes (integração)

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

### Cenários de Teste - Saídas (13)
1. Exibição da tela de saídas
2. Abertura de modal de nova saída
3. Fechamento de modal ao clicar em cancelar
4. Fechamento de modal ao clicar fora dele
5. Validação de campo "Lote" obrigatório
6. Validação de campo "Quantidade" obrigatório
7. Validação de campo "Data e Hora" obrigatório
8. Cadastro completo de saída
9. Atualização de estoque ao cadastrar saída
10. Reversão de estoque ao excluir saída
11. Impedir saída maior que estoque disponível
12. Validar quantidade zero ou negativa
13. Validar formato de quantidade (apenas números)

### Cenários de Teste - Fornecedores (20)
1. Exibição da tela de fornecedores
2. Abrir modal de novo fornecedor
3. Fechar modal ao clicar em cancelar
4. Fechar modal ao clicar fora dele
5. Validar campo "Nome" obrigatório
6. Validar campo "CNPJ" obrigatório
7. Cadastro completo de fornecedor
8. Formatação automática de CNPJ (14 dígitos)
9. Formatação automática de CPF (11 dígitos)
10. Formatação automática de Telefone
11. Excluir fornecedor com sucesso
12. Usar fornecedor cadastrado em uma entrada (integração)
13. Editar nome do fornecedor
14. Editar CNPJ do fornecedor
15. Editar telefone do fornecedor
16. Editar email do fornecedor
17. Editar endereço do fornecedor
18. Cadastrar fornecedor apenas com campos obrigatórios
19. Exibir tabela com colunas corretas
20. Impedir cadastro de CNPJ duplicado
21. Validar formato de email inválido

### Cenários de Teste - Lotes (20)
1. Exibição da tela de lotes
2. Exibição de tabela com colunas corretas
3. Status "Válido" para lote com validade futura
4. Status "Vencido" para lote com validade passada
5. Status "Próximo ao vencimento" para lote vencendo em 30 dias
6. Abrir modal de edição ao clicar em editar
7. Editar lote com sucesso
8. Excluir lote com sucesso
9. Fechar modal ao clicar em cancelar
10. Exibir quantidade atual atualizada após movimentações
11. Validar formatação de data no formato dd/mm/yyyy
12. Validar formatação de quantidade com 2 casas decimais
13. Criar múltiplos lotes do mesmo produto com validades diferentes
14. Editar data de validade e validar mudança de status
15. Validar campo "Produto" obrigatório no modal de edição
16. Validar campo "Número do Lote" obrigatório no modal de edição
17. Validar campo "Quantidade Inicial" obrigatório no modal de edição
18. Validar campo "Data de Entrada" obrigatório no modal de edição
19. Validar campo "Data de Validade" obrigatório no modal de edição
20. Validar quantidade negativa no modal de edição

### Execução
```bash
# Todos os testes
npm test

# Apenas entradas
npx playwright test entradas.spec.js

# Apenas saídas
npx playwright test saidas.spec.js

# Apenas lotes
npx playwright test lotes.spec.js

# Apenas produtos
npx playwright test produtos.spec.js

# Apenas fornecedores
npx playwright test fornecedores.spec.js

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
    │   ├── LoginPage.js
    │   ├── DashboardPage.js
    │   ├── ProdutosPage.js
    │   ├── EntradasPage.js
    │   ├── SaidasPage.js
    │   ├── LotesPage.js
    │   └── FornecedoresPage.js
    ├── helpers/
    │   ├── cleanup.js
    │   └── limpar-produtos.js
    ├── login.spec.js
    ├── dashboard.spec.js
    ├── produtos.spec.js
    ├── entradas.spec.js
    ├── saidas.spec.js
    ├── lotes.spec.js
    └── fornecedores.spec.js
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

MIT