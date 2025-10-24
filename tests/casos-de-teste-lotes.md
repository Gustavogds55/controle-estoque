# 📋 Casos de Teste - Lotes

## 📊 Resumo
- **Total de Cenários**: 20
- **Ferramenta**: Playwright
- **Padrão**: Page Object Model
- **Status**: ✅ Todos implementados e passando

---

## 🧪 Cenários de Teste

### 1. Exibição da tela de lotes
**Objetivo**: Validar que a tela de lotes é exibida corretamente

**Pré-condições**:
- Usuário autenticado

**Passos**:
1. Fazer login
2. Navegar para "Lotes"

**Resultado Esperado**:
- Título "Gerenciamento de Lotes" visível

---

### 2. Exibição de tabela com colunas corretas
**Objetivo**: Validar que a tabela possui todas as colunas necessárias

**Pré-condições**:
- Pelo menos um lote cadastrado

**Passos**:
1. Criar entrada (produto + lote)
2. Navegar para "Lotes"
3. Verificar colunas da tabela

**Resultado Esperado**:
- Colunas visíveis: Produto, Número Lote, Qtd Atual, Data Entrada, Validade, Status, Ações

---

### 3. Status "Válido" para lote com validade futura
**Objetivo**: Validar exibição de status para lote válido

**Pré-condições**:
- Lote com validade > 30 dias

**Passos**:
1. Criar lote com validade 2025-12-31
2. Verificar badge de status

**Resultado Esperado**:
- Badge "Válido" visível
- Cor verde (bg-green-100)

---

### 4. Status "Vencido" para lote com validade passada
**Objetivo**: Validar exibição de status para lote vencido

**Pré-condições**:
- Lote com validade no passado

**Passos**:
1. Criar lote com validade 2020-01-01
2. Verificar badge de status

**Resultado Esperado**:
- Badge "Vencido" visível
- Cor vermelha (bg-red-100)

---

### 5. Status "Próximo ao vencimento" para lote vencendo em 30 dias
**Objetivo**: Validar exibição de status para lote próximo ao vencimento

**Pré-condições**:
- Lote com validade entre 1-30 dias

**Passos**:
1. Criar lote com validade em 15 dias
2. Verificar badge de status

**Resultado Esperado**:
- Badge "Próximo ao vencimento" visível
- Cor amarela (bg-yellow-100)

---

### 6. Abrir modal de edição ao clicar em editar
**Objetivo**: Validar abertura do modal de edição

**Pré-condições**:
- Lote cadastrado

**Passos**:
1. Clicar no botão "Editar" do lote
2. Verificar modal

**Resultado Esperado**:
- Modal "Editar Lote" visível
- Campos preenchidos com dados do lote

---

### 7. Editar lote com sucesso
**Objetivo**: Validar edição de um lote

**Pré-condições**:
- Lote cadastrado

**Passos**:
1. Abrir modal de edição
2. Alterar número do lote
3. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Lote atualizado com sucesso" visível
- Novo número do lote visível na tabela

---

### 8. Excluir lote com sucesso
**Objetivo**: Validar exclusão de um lote

**Pré-condições**:
- Lote cadastrado

**Passos**:
1. Clicar no botão "Excluir" do lote
2. Confirmar exclusão

**Resultado Esperado**:
- Toast "Lote excluído com sucesso" visível
- Lote não aparece mais na tabela
- Entrada e produto excluídos automaticamente (cascata)

---

### 9. Fechar modal ao clicar em cancelar
**Objetivo**: Validar fechamento do modal ao cancelar

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Clicar em "Cancelar"

**Resultado Esperado**:
- Modal "Editar Lote" não visível

---

### 10. Exibir quantidade atual atualizada após movimentações
**Objetivo**: Validar que quantidade atual reflete as movimentações

**Pré-condições**:
- Entrada com 100 unidades

**Passos**:
1. Verificar quantidade na tela de Lotes

**Resultado Esperado**:
- Quantidade atual = 100.00

---

### 11. Validar formatação de data no formato dd/mm/yyyy
**Objetivo**: Validar formatação brasileira de datas

**Pré-condições**:
- Lote com data entrada 2024-06-15 e validade 2025-12-31

**Passos**:
1. Verificar colunas de data na tabela

**Resultado Esperado**:
- Data Entrada: 15/06/2024
- Validade: 31/12/2025

---

### 12. Validar formatação de quantidade com 2 casas decimais
**Objetivo**: Validar formatação de quantidade

**Pré-condições**:
- Lote com quantidade 123.45

**Passos**:
1. Verificar coluna Qtd Atual

**Resultado Esperado**:
- Quantidade exibida: 123.45

---

### 13. Criar múltiplos lotes do mesmo produto com validades diferentes
**Objetivo**: Validar que um produto pode ter vários lotes

**Pré-condições**:
- Produto cadastrado

**Passos**:
1. Criar entrada com lote 1 (validade 2025-06-30)
2. Criar entrada com lote 2 do mesmo produto (validade 2025-12-31)
3. Verificar tela de Lotes

**Resultado Esperado**:
- Ambos os lotes visíveis na tabela
- Mesmo produto, lotes diferentes

---

### 14. Editar data de validade e validar mudança de status
**Objetivo**: Validar que status muda ao alterar validade

**Pré-condições**:
- Lote com status "Válido"

**Passos**:
1. Editar data de validade para 15 dias à frente
2. Salvar
3. Verificar badge de status

**Resultado Esperado**:
- Status muda para "Próximo ao vencimento"
- Badge amarelo

---

### 15. Validar campo "Produto" obrigatório no modal de edição
**Objetivo**: Validar campo obrigatório Produto

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Limpar campo "Produto" (selecionar opção vazia)
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 16. Validar campo "Número do Lote" obrigatório no modal de edição
**Objetivo**: Validar campo obrigatório Número do Lote

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Limpar campo "Número do Lote"
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 17. Validar campo "Quantidade Inicial" obrigatório no modal de edição
**Objetivo**: Validar campo obrigatório Quantidade Inicial

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Limpar campo "Quantidade Inicial"
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 18. Validar campo "Data de Entrada" obrigatório no modal de edição
**Objetivo**: Validar campo obrigatório Data de Entrada

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Limpar campo "Data de Entrada"
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 19. Validar campo "Data de Validade" obrigatório no modal de edição
**Objetivo**: Validar campo obrigatório Data de Validade

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Limpar campo "Data de Validade"
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 20. Validar quantidade negativa no modal de edição
**Objetivo**: Validar que quantidade não pode ser negativa

**Pré-condições**:
- Modal de edição aberto

**Passos**:
1. Preencher "Quantidade Inicial" com -10
2. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "A quantidade não pode ser negativa" visível
- Modal permanece aberto

---

## 📝 Observações

### Limpeza de Dados
- Todos os testes limpam seus dados após execução
- Navegação para "Entradas" e exclusão da entrada criada
- Teste 8 não precisa limpar (exclusão do lote remove tudo em cascata)

### Padrão de Nomenclatura
- Produtos: "Produto {Tipo} {timestamp}"
- Lotes: "LOTE-{TIPO}-{timestamp}"
- NF: Números únicos por teste

### Validações Implementadas
- ✅ Campos obrigatórios com mensagens customizadas
- ✅ Validação de quantidade negativa
- ✅ Status de validade dinâmico
- ✅ Formatação de data (dd/mm/yyyy)
- ✅ Formatação de quantidade (2 casas decimais)
- ✅ Múltiplos lotes por produto
- ✅ Edição com mudança de status

### Funcionalidades Especiais
- **Exclusão em Cascata**: Ao excluir lote, entrada e produto são removidos automaticamente
- **Status Dinâmico**: Badge muda cor conforme proximidade do vencimento
- **Validação Customizada**: Mensagens específicas para cada tipo de erro

---

## 🎯 Cobertura de Testes

| Funcionalidade | Cobertura |
|----------------|-----------|
| Exibição de tela | ✅ |
| Exibição de tabela | ✅ |
| Status de validade | ✅ |
| Abertura/Fechamento de modal | ✅ |
| Edição de lote | ✅ |
| Exclusão de lote | ✅ |
| Validações de campos obrigatórios | ✅ |
| Validação de quantidade negativa | ✅ |
| Formatação de data | ✅ |
| Formatação de quantidade | ✅ |
| Múltiplos lotes | ✅ |
| Mudança de status | ✅ |
| Limpeza de dados | ✅ |

**Total**: 20 cenários implementados e passando ✅
