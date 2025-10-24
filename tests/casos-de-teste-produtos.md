# Casos de Teste - Produtos

## Informações Gerais
- **Funcionalidade**: Gerenciamento de Produtos
- **Pré-requisito**: Usuário autenticado no sistema
- **Observação**: Produtos são cadastrados via aba "Entradas"

---

## CT-PROD-001: Exibir a tela de produtos
**Objetivo**: Validar que a tela de produtos é exibida corretamente

**Passos**:
1. Fazer login no sistema
2. Clicar no menu "Produtos"

**Resultado Esperado**:
- Tela de produtos é exibida
- Título "Gerenciamento de Produtos" está visível

---

## CT-PROD-002: Exibir mensagem informativa sobre cadastro via Entradas
**Objetivo**: Validar que a mensagem informativa é exibida

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos

**Resultado Esperado**:
- Mensagem "Para cadastrar novos produtos, utilize a aba 'Entradas'" está visível

---

## CT-PROD-003: Validar campo "Nome" obrigatório
**Objetivo**: Validar que o campo Nome é obrigatório

**Passos**:
1. Fazer login no sistema
2. Criar um produto via Entradas
3. Navegar para tela de Produtos
4. Clicar em "Editar" no produto
5. Limpar o campo "Nome"
6. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" aparece abaixo do campo Nome
- Produto não é salvo

---

## CT-PROD-004: Validar campo "Unidade de Medida" obrigatório
**Objetivo**: Validar que o campo Unidade de Medida é obrigatório

**Passos**:
1. Fazer login no sistema
2. Criar um produto via Entradas
3. Navegar para tela de Produtos
4. Clicar em "Editar" no produto
5. Limpar o campo "Unidade de Medida"
6. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" aparece abaixo do campo Unidade de Medida
- Produto não é salvo

---

## CT-PROD-005: Validar campos vazios simultaneamente
**Objetivo**: Validar que múltiplos campos obrigatórios são validados ao mesmo tempo

**Passos**:
1. Fazer login no sistema
2. Criar um produto via Entradas
3. Navegar para tela de Produtos
4. Clicar em "Editar" no produto
5. Limpar os campos "Nome" e "Unidade de Medida"
6. Clicar em "Salvar"

**Resultado Esperado**:
- 2 mensagens "Este campo é obrigatório" aparecem
- Produto não é salvo

---

## CT-PROD-006: Validar asterisco em campos obrigatórios
**Objetivo**: Validar que campos obrigatórios têm asterisco vermelho

**Passos**:
1. Fazer login no sistema
2. Criar um produto via Entradas
3. Navegar para tela de Produtos
4. Clicar em "Editar" no produto

**Resultado Esperado**:
- Label "Nome" tem asterisco vermelho (*)
- Label "Unidade de Medida" tem asterisco vermelho (*)

---

## CT-PROD-007: Exibir tabela com colunas corretas
**Objetivo**: Validar que a tabela possui todas as colunas necessárias

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos

**Resultado Esperado**:
- Coluna "Nome" está visível
- Coluna "Categoria" está visível
- Coluna "Unidade" está visível
- Coluna "Ações" está visível

---

## CT-PROD-008: Editar nome do produto
**Objetivo**: Validar edição do nome de um produto

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Alterar o campo "Nome"
5. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Produto atualizado com sucesso" é exibido
- Novo nome aparece na tabela

---

## CT-PROD-009: Editar categoria do produto
**Objetivo**: Validar edição da categoria de um produto

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Alterar o campo "Categoria"
5. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Produto atualizado com sucesso" é exibido
- Nova categoria aparece na tabela

---

## CT-PROD-010: Editar unidade de medida do produto
**Objetivo**: Validar edição da unidade de medida de um produto

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Alterar o campo "Unidade de Medida"
5. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Produto atualizado com sucesso" é exibido
- Nova unidade aparece na tabela

---

## CT-PROD-011: Editar descrição do produto
**Objetivo**: Validar edição da descrição de um produto

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Alterar o campo "Descrição"
5. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Produto atualizado com sucesso" é exibido
- Produto é atualizado no sistema

---

## CT-PROD-012: Excluir produto com sucesso
**Objetivo**: Validar exclusão de um produto

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Excluir" de um produto
4. Aguardar processamento

**Resultado Esperado**:
- Toast "Produto excluído com sucesso" é exibido
- Produto não aparece mais na tabela

---

## CT-PROD-013: Cancelar edição de produto
**Objetivo**: Validar cancelamento da edição

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Alterar algum campo
5. Clicar em "Cancelar"

**Resultado Esperado**:
- Modal é fechado
- Alterações não são salvas

---

## CT-PROD-014: Fechar modal ao clicar fora dele
**Objetivo**: Validar fechamento do modal ao clicar no overlay

**Passos**:
1. Fazer login no sistema
2. Navegar para tela de Produtos
3. Clicar no botão "Editar" de um produto
4. Clicar fora do modal (no overlay escuro)

**Resultado Esperado**:
- Modal é fechado
- Alterações não são salvas

---

## CT-PROD-015: Refletir edição de produto nos lotes
**Objetivo**: Validar que edição do produto reflete nos lotes vinculados

**Passos**:
1. Fazer login no sistema
2. Criar um produto via Entradas (cria lote automaticamente)
3. Navegar para tela de Produtos
4. Editar o nome do produto
5. Clicar em "Salvar"
6. Navegar para tela de Lotes

**Resultado Esperado**:
- Novo nome do produto aparece na tela de Lotes
- Lote está vinculado ao produto atualizado

---

## Resumo
- **Total de Casos de Teste**: 15
- **Cobertura**: 
  - Visualização: 2 casos
  - Validação: 4 casos
  - Edição: 5 casos
  - Exclusão: 1 caso
  - Cancelamento: 2 casos
  - Integração: 1 caso
