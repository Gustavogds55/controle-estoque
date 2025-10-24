# 📋 Casos de Teste - Saídas

## 📊 Resumo
- **Total de Cenários**: 13
- **Ferramenta**: Playwright
- **Padrão**: Page Object Model
- **Status**: ✅ Todos implementados e passando

---

## 🧪 Cenários de Teste

### 1. Exibição da tela de saídas
**Objetivo**: Validar que a tela de saídas é exibida corretamente

**Pré-condições**:
- Usuário autenticado

**Passos**:
1. Fazer login
2. Navegar para "Saídas"

**Resultado Esperado**:
- Título "Gerenciamento de Saídas" visível

---

### 2. Abertura de modal de nova saída
**Objetivo**: Validar que o modal de nova saída abre corretamente

**Pré-condições**:
- Usuário autenticado
- Estar na tela de Saídas

**Passos**:
1. Clicar no botão "Nova Saída"

**Resultado Esperado**:
- Modal "Nova Saída" visível

---

### 3. Fechamento de modal ao clicar em cancelar
**Objetivo**: Validar que o modal fecha ao clicar em cancelar

**Pré-condições**:
- Modal de nova saída aberto

**Passos**:
1. Clicar em "Cancelar"

**Resultado Esperado**:
- Modal não visível

---

### 4. Fechamento de modal ao clicar fora dele
**Objetivo**: Validar que o modal fecha ao clicar no overlay

**Pré-condições**:
- Modal de nova saída aberto

**Passos**:
1. Clicar fora do modal (no overlay)

**Resultado Esperado**:
- Modal não visível

---

### 5. Validação de campo "Lote" obrigatório
**Objetivo**: Validar que o campo Lote é obrigatório

**Pré-condições**:
- Modal de nova saída aberto

**Passos**:
1. Deixar campo "Lote" vazio
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível

---

### 6. Validação de campo "Quantidade" obrigatório
**Objetivo**: Validar que o campo Quantidade é obrigatório

**Pré-condições**:
- Modal de nova saída aberto
- Lote selecionado

**Passos**:
1. Deixar campo "Quantidade" vazio
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível

---

### 7. Validação de campo "Data e Hora" obrigatório
**Objetivo**: Validar que o campo Data e Hora é obrigatório

**Pré-condições**:
- Modal de nova saída aberto
- Lote selecionado
- Quantidade preenchida

**Passos**:
1. Deixar campo "Data e Hora" vazio
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível

---

### 8. Cadastro completo de saída
**Objetivo**: Validar cadastro completo de uma saída

**Pré-condições**:
- Entrada cadastrada com estoque disponível

**Passos**:
1. Abrir modal de nova saída
2. Selecionar lote
3. Preencher quantidade (menor que estoque)
4. Preencher data e hora
5. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Saída cadastrada com sucesso" visível
- Saída aparece na listagem

---

### 9. Atualização de estoque ao cadastrar saída
**Objetivo**: Validar que o estoque é atualizado corretamente

**Pré-condições**:
- Entrada cadastrada com 100 unidades

**Passos**:
1. Cadastrar saída de 30 unidades
2. Navegar para "Lotes"
3. Verificar quantidade atual do lote

**Resultado Esperado**:
- Quantidade atual = 70.00

---

### 10. Reversão de estoque ao excluir saída
**Objetivo**: Validar que o estoque é revertido ao excluir saída

**Pré-condições**:
- Saída cadastrada (30 unidades)
- Estoque atual = 70

**Passos**:
1. Excluir a saída
2. Navegar para "Lotes"
3. Verificar quantidade atual do lote

**Resultado Esperado**:
- Quantidade atual = 100.00 (revertida)

---

### 11. Impedir saída maior que estoque disponível
**Objetivo**: Validar que não é possível retirar mais que o disponível

**Pré-condições**:
- Entrada com 50 unidades

**Passos**:
1. Tentar cadastrar saída de 100 unidades
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem de erro "Quantidade indisponível em estoque"
- Modal permanece aberto

---

### 12. Validar quantidade zero ou negativa
**Objetivo**: Validar que quantidade deve ser maior que zero

**Pré-condições**:
- Modal de nova saída aberto

**Passos**:
1. Preencher quantidade = 0
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "A quantidade deve ser maior que zero"

---

### 13. Validar formato de quantidade (apenas números)
**Objetivo**: Validar que quantidade aceita apenas números

**Pré-condições**:
- Modal de nova saída aberto

**Passos**:
1. Verificar tipo do campo quantidade

**Resultado Esperado**:
- Campo tipo "number"
- Step "0.01" (aceita decimais)

---

## 📝 Observações

### Limpeza de Dados
- Todos os testes limpam seus dados após execução
- Navegação para "Entradas" e exclusão da entrada criada
- Exclusão automática de lote e produto em cascata

### Padrão de Nomenclatura
- Produtos: "Produto Saida {timestamp}"
- Lotes: "LOTE-SAIDA-{timestamp}"
- NF: Números únicos por teste

### Validações Implementadas
- ✅ Campos obrigatórios com mensagens customizadas
- ✅ Validação de estoque disponível
- ✅ Validação de quantidade positiva
- ✅ Atualização automática de estoque
- ✅ Reversão de estoque ao excluir

---

## 🎯 Cobertura de Testes

| Funcionalidade | Cobertura |
|----------------|-----------|
| Exibição de tela | ✅ |
| Abertura/Fechamento de modal | ✅ |
| Validações de campos | ✅ |
| Cadastro de saída | ✅ |
| Atualização de estoque | ✅ |
| Reversão de estoque | ✅ |
| Validação de quantidade | ✅ |
| Limpeza de dados | ✅ |

**Total**: 13 cenários implementados e passando ✅
