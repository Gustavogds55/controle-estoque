# 📋 Casos de Teste - Entradas

## 🎯 Objetivo
Validar todas as funcionalidades da tela de Entradas de Mercadorias, incluindo validações de campos, cadastro completo, criação de fornecedores, edição e exclusão.

---

## ✅ Cenários de Teste (20)

### 1. Validação de Campos Obrigatórios (8 cenários)

#### CT-E01: Validar campo "Nome do Produto" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Deixar campo "Nome do Produto" vazio
3. Preencher demais campos obrigatórios
4. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Nome do Produto"

---

#### CT-E02: Validar campo "Unidade de Medida" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher "Nome do Produto"
3. Deixar campo "Unidade de Medida" vazio
4. Preencher demais campos obrigatórios
5. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Unidade de Medida"

---

#### CT-E03: Validar campo "Número do Lote" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher dados do produto
3. Deixar campo "Número do Lote" vazio
4. Preencher demais campos obrigatórios
5. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Número do Lote"

---

#### CT-E04: Validar campo "Data de Validade" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher dados do produto e número do lote
3. Deixar campo "Data de Validade" vazio
4. Preencher demais campos obrigatórios
5. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Data de Validade"

---

#### CT-E05: Validar campo "Número da NF" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher dados do produto e lote
3. Deixar campo "Número da Nota Fiscal" vazio
4. Preencher demais campos obrigatórios
5. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Número da Nota Fiscal"

---

#### CT-E06: Validar campo "Fornecedor" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher dados do produto, lote e NF
3. Deixar campo "Fornecedor" sem seleção
4. Preencher demais campos obrigatórios
5. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Fornecedor"

---

#### CT-E07: Validar campo "Quantidade" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher todos os campos exceto "Quantidade"
3. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Quantidade"

---

#### CT-E08: Validar campo "Data e Hora" obrigatório
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher todos os campos exceto "Data e Hora"
3. Clicar em "Cadastrar"

**Resultado Esperado**: Mensagem "Este campo é obrigatório" abaixo do campo "Data e Hora"

---

### 2. Cadastro e Criação Automática (4 cenários)

#### CT-E09: Cadastrar entrada completa
**Pré-condição**: Usuário autenticado, fornecedor cadastrado  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher "Nome do Produto" com nome único
3. Preencher "Categoria" e "Unidade de Medida"
4. Preencher "Número do Lote" único e "Data de Validade"
5. Preencher "Número da NF", selecionar "Fornecedor"
6. Preencher "Quantidade" e "Data e Hora"
7. Clicar em "Cadastrar"

**Resultado Esperado**: 
- Toast "Cadastro realizado com sucesso"
- Entrada aparece na tabela
- Modal fecha automaticamente

---

#### CT-E10: Criar produto automaticamente ao cadastrar entrada
**Pré-condição**: Usuário autenticado  
**Passos**:
1. Cadastrar entrada com produto novo
2. Navegar para "Produtos"
3. Verificar se produto foi criado

**Resultado Esperado**: Produto aparece na listagem de Produtos

---

#### CT-E11: Criar lote automaticamente ao cadastrar entrada
**Pré-condição**: Usuário autenticado  
**Passos**:
1. Cadastrar entrada com lote novo
2. Navegar para "Lotes"
3. Verificar se lote foi criado

**Resultado Esperado**: Lote aparece na listagem de Lotes

---

#### CT-E12: Validar fluxo completo entrada → lote → saída
**Pré-condição**: Usuário autenticado  
**Passos**:
1. Cadastrar entrada com quantidade 100
2. Verificar lote com estoque 100.00
3. Cadastrar saída de 30 unidades
4. Verificar lote com estoque 70.00

**Resultado Esperado**: 
- Estoque atualizado corretamente (100 → 70)
- Toast "Saída cadastrada com sucesso"

---

### 3. Gestão de Fornecedores (3 cenários)

#### CT-E13: Criar fornecedor inline durante entrada
**Pré-condição**: Usuário autenticado na tela de Entradas  
**Passos**:
1. Clicar em "+ Nova Entrada"
2. Preencher dados do produto e lote
3. Clicar no botão "+" ao lado do select de fornecedor
4. Preencher modal "Novo Fornecedor" com CNPJ único
5. Clicar em "Salvar"
6. Verificar fechamento do modal
7. Verificar toast "Fornecedor cadastrado com sucesso"

**Resultado Esperado**: 
- Modal fecha automaticamente
- Toast de sucesso exibido
- Fornecedor selecionado no select

---

#### CT-E14: Cadastrar entrada completa com novo fornecedor
**Pré-condição**: Usuário autenticado  
**Passos**:
1. Abrir modal de nova entrada
2. Criar fornecedor inline com CNPJ único
3. Completar cadastro da entrada
4. Verificar entrada na tabela com nome do fornecedor

**Resultado Esperado**: 
- Entrada cadastrada com sucesso
- Coluna "Fornecedor" exibe nome correto

---

#### CT-E15: Cancelar cadastro de fornecedor
**Pré-condição**: Usuário no modal de nova entrada  
**Passos**:
1. Preencher dados do produto e lote
2. Clicar no botão "+"
3. Preencher dados do fornecedor
4. Clicar em "Cancelar"

**Resultado Esperado**: 
- Modal de fornecedor fecha
- Dados do produto/lote permanecem preenchidos
- Modal de entrada continua aberto

---

### 4. Edição e Exclusão (3 cenários)

#### CT-E16: Excluir lote ao excluir entrada
**Pré-condição**: Entrada cadastrada sem outras movimentações  
**Passos**:
1. Cadastrar entrada com lote novo
2. Verificar lote na listagem de Lotes
3. Excluir entrada
4. Verificar listagem de Lotes

**Resultado Esperado**: Lote não aparece mais na listagem (exclusão em cascata)

---

#### CT-E17: Editar entrada existente
**Pré-condição**: Entrada cadastrada  
**Passos**:
1. Clicar no botão "Editar" de uma entrada
2. Alterar quantidade, data ou observação
3. Clicar em "Atualizar"

**Resultado Esperado**: 
- Toast "Entrada atualizada com sucesso"
- Dados atualizados na tabela

---

#### CT-E18: Validar toast de sucesso
**Pré-condição**: Usuário autenticado  
**Passos**:
1. Cadastrar entrada completa
2. Observar toast exibido

**Resultado Esperado**: Toast verde com mensagem "Cadastro realizado com sucesso" aparece por 3 segundos

---

### 5. Comportamento de Interface (2 cenários)

#### CT-E19: Fechamento automático de modal de fornecedor
**Pré-condição**: Modal de fornecedor aberto  
**Passos**:
1. Preencher dados do fornecedor
2. Clicar em "Salvar"
3. Observar comportamento

**Resultado Esperado**: 
- Modal fecha imediatamente
- Toast aparece após fechamento
- Fornecedor selecionado no select

---

#### CT-E20: Limpeza automática de dados de teste
**Pré-condição**: Teste executado com sucesso  
**Passos**:
1. Executar teste que cria entrada
2. Verificar exclusão automática no final

**Resultado Esperado**: Dados de teste removidos do banco (entrada, fornecedor se aplicável)

---

## 📊 Resumo de Cobertura

| Categoria | Cenários | Status |
|-----------|----------|--------|
| Validações de Campos | 8 | ✅ 100% |
| Cadastro e Criação | 4 | ✅ 100% |
| Gestão de Fornecedores | 3 | ✅ 100% |
| Edição e Exclusão | 3 | ✅ 100% |
| Interface | 2 | ✅ 100% |
| **TOTAL** | **20** | **✅ 100%** |

---

## 🔧 Configuração dos Testes

### Ferramentas
- **Playwright**: Framework de testes E2E
- **Page Object Model**: Organização dos testes
- **Data-testid**: Seletores estáveis

### Execução
```bash
# Todos os testes de entradas
npx playwright test entradas.spec.js

# Modo headed (visualizar execução)
npx playwright test entradas.spec.js --headed

# Teste específico
npx playwright test entradas.spec.js -g "deve criar fornecedor"
```

### Características
- ✅ Execução paralela (4 workers)
- ✅ CNPJ único por timestamp
- ✅ Limpeza automática de dados
- ✅ Timeouts estratégicos
- ✅ 100% de taxa de sucesso
