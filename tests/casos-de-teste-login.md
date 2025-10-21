# Casos de Teste - Cenário de Login

## 📋 Informações Gerais
- **Funcionalidade**: Login de Usuário
- **URL**: http://localhost:3001/login
- **Credenciais Válidas**: 
  - Email: admin@estoque.com
  - Senha: 123456

---

## ✅ Casos de Teste

### CT-001: Login com Sucesso
**Objetivo**: Verificar se o usuário consegue fazer login com credenciais válidas

**Pré-condições**: 
- Usuário não está logado
- Backend está rodando

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "admin@estoque.com"
3. Preencher campo "Senha" com "123456"
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Usuário é redirecionado para /dashboard
- Página do Dashboard é exibida com sucesso

**Status**: ✅ Passou

---

### CT-002: Email Incorreto
**Objetivo**: Verificar se o sistema exibe erro ao tentar login com email inexistente

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "emailinexistente@teste.com"
3. Preencher campo "Senha" com "123456"
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Mensagem "Email ou senha inválidos" é exibida
- Usuário permanece na página de login

**Status**: ✅ Passou

---

### CT-003: Senha Incorreta
**Objetivo**: Verificar se o sistema exibe erro ao tentar login com senha incorreta

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "admin@estoque.com"
3. Preencher campo "Senha" com "senhaerrada"
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Mensagem "Email ou senha inválidos" é exibida
- Usuário permanece na página de login

**Status**: ✅ Passou

---

### CT-004: Campos Vazios
**Objetivo**: Verificar validação quando ambos os campos estão vazios

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Deixar campo "Email" vazio
3. Deixar campo "Senha" vazio
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Validação HTML5 impede o submit
- Usuário permanece na página de login

**Status**: ✅ Passou

---

### CT-005: Email Vazio
**Objetivo**: Verificar validação quando apenas o email está vazio

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Deixar campo "Email" vazio
3. Preencher campo "Senha" com "123456"
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Validação HTML5 impede o submit
- Usuário permanece na página de login

**Status**: ✅ Passou

---

### CT-006: Senha Vazia
**Objetivo**: Verificar validação quando apenas a senha está vazia

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "admin@estoque.com"
3. Deixar campo "Senha" vazio
4. Clicar no botão "Entrar"

**Resultado Esperado**:
- Validação HTML5 impede o submit
- Usuário permanece na página de login

**Status**: ✅ Passou

---

### CT-007: Formato de Email Inválido
**Objetivo**: Verificar validação de formato de email

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "emailinvalido" (sem @)
3. Preencher campo "Senha" com "123456"
4. Tentar submeter o formulário

**Resultado Esperado**:
- Campo email é marcado como inválido (validity.valid = false)
- Validação HTML5 impede o submit

**Status**: ✅ Passou

---

### CT-008: Botão Desabilitado Durante Login
**Objetivo**: Verificar se o botão fica desabilitado durante o processo de login

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "admin@estoque.com"
3. Preencher campo "Senha" com "123456"
4. Clicar no botão "Entrar"
5. Verificar estado do botão imediatamente após o clique

**Resultado Esperado**:
- Botão fica desabilitado (disabled=true)
- Impede múltiplos cliques

**Status**: ✅ Passou

---

### CT-009: Feedback Visual Durante Login
**Objetivo**: Verificar se o texto do botão muda durante o processo de login

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher campo "Email" com "admin@estoque.com"
3. Preencher campo "Senha" com "123456"
4. Clicar no botão "Entrar"
5. Verificar texto do botão durante o processo

**Resultado Esperado**:
- Texto do botão muda de "Entrar" para "Entrando..."
- Fornece feedback visual ao usuário

**Status**: ✅ Passou

---

### CT-010: Limpar Erro ao Tentar Novamente
**Objetivo**: Verificar se a mensagem de erro é limpa ao fazer nova tentativa de login

**Pré-condições**: 
- Usuário não está logado

**Passos**:
1. Acessar a página de login
2. Preencher com credenciais inválidas
3. Clicar em "Entrar" (erro aparece)
4. Preencher com credenciais válidas
5. Clicar em "Entrar" novamente

**Resultado Esperado**:
- Mensagem de erro desaparece
- Login é realizado com sucesso
- Usuário é redirecionado para /dashboard

**Status**: ✅ Passou

---

## 📊 Resumo dos Testes

| Total de Casos | Passou | Falhou | Pendente |
|----------------|--------|--------|----------|
| 10             | 10     | 0      | 0        |

**Taxa de Sucesso**: 100%

---

## 🔧 Ambiente de Teste

- **Framework**: Playwright
- **Navegador**: Chromium
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **Data da Execução**: Janeiro 2025

---

## 📝 Observações

- Todos os testes utilizam `data-testid` para seletores mais confiáveis
- Testes aguardam `networkidle` para garantir que o JavaScript carregou
- Validações HTML5 são testadas através da propriedade `validity.valid`
- Loading states são verificados para melhor UX
