# 📋 Casos de Teste - Fornecedores

## 📊 Resumo
- **Total de Cenários**: 10
- **Ferramenta**: Playwright
- **Padrão**: Page Object Model
- **Status**: ✅ Todos implementados e passando

---

## 🧪 Cenários de Teste

### 1. Exibição da tela de fornecedores
**Objetivo**: Validar que a tela de fornecedores é exibida corretamente

**Pré-condições**:
- Usuário autenticado

**Passos**:
1. Fazer login
2. Navegar para "Fornecedores"

**Resultado Esperado**:
- Título "Gerenciamento de Fornecedores" visível

---

### 2. Abrir modal de novo fornecedor
**Objetivo**: Validar que o modal de novo fornecedor abre corretamente

**Pré-condições**:
- Usuário autenticado
- Estar na tela de Fornecedores

**Passos**:
1. Clicar no botão "Novo Fornecedor"

**Resultado Esperado**:
- Modal "Novo Fornecedor" visível

---

### 3. Fechar modal ao clicar em cancelar
**Objetivo**: Validar que o modal fecha ao clicar em cancelar

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Clicar em "Cancelar"

**Resultado Esperado**:
- Modal "Novo Fornecedor" não visível

---

### 4. Fechar modal ao clicar fora dele
**Objetivo**: Validar que o modal fecha ao clicar no overlay

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Clicar fora do modal (no overlay escuro)

**Resultado Esperado**:
- Modal "Novo Fornecedor" não visível

---

### 5. Validar campo "Nome" obrigatório
**Objetivo**: Validar que o campo Nome é obrigatório

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Preencher apenas CNPJ
2. Deixar campo "Nome" vazio
3. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 6. Validar campo "CNPJ" obrigatório
**Objetivo**: Validar que o campo CNPJ é obrigatório

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Preencher apenas Nome
2. Deixar campo "CNPJ" vazio
3. Clicar em "Salvar"

**Resultado Esperado**:
- Mensagem "Este campo é obrigatório" visível
- Modal permanece aberto

---

### 7. Cadastrar fornecedor completo
**Objetivo**: Validar cadastro completo de um fornecedor

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Preencher Nome: "Fornecedor Completo {timestamp}"
2. Preencher CNPJ: "{timestamp com 14 dígitos}"
3. Preencher Telefone: "11987654321"
4. Preencher Email: "fornecedor@teste.com"
5. Preencher Endereço: "Rua Teste, 123"
6. Clicar em "Salvar"

**Resultado Esperado**:
- Toast "Fornecedor cadastrado com sucesso" visível
- Fornecedor aparece na listagem
- Dados limpos após teste

---

### 8. Formatar CNPJ automaticamente
**Objetivo**: Validar formatação automática do CNPJ

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Preencher CNPJ com apenas números: "12345678901234"
2. Verificar valor do campo

**Resultado Esperado**:
- CNPJ formatado: "12.345.678/9012-34"
- Contém pontos (.)
- Contém barra (/)
- Contém hífen (-)

---

### 9. Formatar telefone automaticamente
**Objetivo**: Validar formatação automática do telefone

**Pré-condições**:
- Modal de novo fornecedor aberto

**Passos**:
1. Preencher Telefone com apenas números: "11987654321"
2. Verificar valor do campo

**Resultado Esperado**:
- Telefone formatado: "(11) 98765-4321"
- Contém parênteses ()
- Contém espaço
- Contém hífen (-)

---

### 10. Excluir fornecedor com sucesso
**Objetivo**: Validar exclusão de um fornecedor

**Pré-condições**:
- Fornecedor cadastrado

**Passos**:
1. Cadastrar fornecedor
2. Clicar no botão "Excluir" do fornecedor
3. Confirmar exclusão

**Resultado Esperado**:
- Toast "Fornecedor excluído com sucesso" visível
- Fornecedor não aparece mais na listagem

---

## 📝 Observações

### Limpeza de Dados
- Testes que criam fornecedores os excluem após validação
- Teste de exclusão não precisa limpar (já exclui no próprio teste)
- Testes de formatação cancelam o modal sem salvar

### Padrão de Nomenclatura
- Fornecedores: "Fornecedor {Tipo} {timestamp}"
- CNPJ: Timestamp com 14 dígitos (garante unicidade)

### Validações Implementadas
- ✅ Campos obrigatórios (Nome, CNPJ)
- ✅ Formatação automática de CNPJ (00.000.000/0000-00)
- ✅ Formatação automática de Telefone ((00) 00000-0000)
- ✅ Fechamento de modal (cancelar e overlay)
- ✅ Toast de confirmação em todas as operações

### Funcionalidades Especiais
- **Formatação Automática**: CNPJ e Telefone são formatados enquanto o usuário digita
- **Validação em Tempo Real**: Mensagens aparecem ao tentar salvar sem preencher campos obrigatórios
- **Modal Independente**: Pode ser usado tanto na tela de Fornecedores quanto inline em Entradas

---

## 🎯 Cobertura de Testes

| Funcionalidade | Cobertura |
|----------------|-----------|
| Exibição de tela | ✅ |
| Abertura/Fechamento de modal | ✅ |
| Validações de campos obrigatórios | ✅ |
| Cadastro de fornecedor | ✅ |
| Formatação de CNPJ | ✅ |
| Formatação de Telefone | ✅ |
| Exclusão de fornecedor | ✅ |
| Limpeza de dados | ✅ |

**Total**: 10 cenários implementados e passando ✅
