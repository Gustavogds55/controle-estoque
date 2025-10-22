# Casos de Teste - Dashboard

## CT-DASH-001: Exibir Dashboard Após Login
**Objetivo**: Verificar se o dashboard é exibido corretamente após login bem-sucedido

**Pré-condições**:
- Sistema backend rodando em localhost:3000
- Sistema frontend rodando em localhost:3001
- Usuário válido cadastrado (admin@estoque.com / 123456)

**Passos**:
1. Acessar página de login
2. Fazer login com credenciais válidas
3. Aguardar redirecionamento para dashboard

**Resultado Esperado**:
- Dashboard é exibido com título visível

**Status**: ✅ Implementado

---

## CT-DASH-002: Exibir Tabela de Lotes Vencendo
**Objetivo**: Verificar se a tabela de lotes próximos ao vencimento é exibida

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Acessar dashboard
2. Verificar seção de lotes próximos ao vencimento

**Resultado Esperado**:
- Se houver lotes vencendo: tabela é exibida com dados
- Se não houver lotes: mensagem "Nenhum lote próximo ao vencimento" é exibida

**Status**: ✅ Implementado

---

## CT-DASH-003: Navegar para Produtos via Ação Rápida
**Objetivo**: Verificar navegação para página de produtos através de ação rápida

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Acessar dashboard
2. Clicar em ação rápida "Gerenciar Produtos"

**Resultado Esperado**:
- Usuário é redirecionado para /produtos

**Status**: ✅ Implementado

---

## CT-DASH-004: Navegar para Lotes via Ação Rápida
**Objetivo**: Verificar navegação para página de lotes através de ação rápida

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Acessar dashboard
2. Clicar em ação rápida "Gerenciar Lotes"

**Resultado Esperado**:
- Usuário é redirecionado para /lotes

**Status**: ✅ Implementado

---

## CT-DASH-005: Entrar em Modo de Edição
**Objetivo**: Verificar ativação do modo de edição de ações rápidas

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Acessar dashboard
2. Clicar no botão "Editar"

**Resultado Esperado**:
- Modo de edição é ativado
- Botões de remoção (×) aparecem nas ações
- Botão de adicionar nova ação aparece

**Status**: ✅ Implementado

---

## CT-DASH-006: Sair do Modo de Edição
**Objetivo**: Verificar desativação do modo de edição de ações rápidas

**Pré-condições**:
- Usuário autenticado no dashboard
- Modo de edição ativado

**Passos**:
1. Estar em modo de edição
2. Clicar no botão "Concluir"

**Resultado Esperado**:
- Modo de edição é desativado
- Botões de remoção desaparecem
- Botão de adicionar nova ação desaparece

**Status**: ✅ Implementado

---

## CT-DASH-007: Abrir Modal de Nova Ação
**Objetivo**: Verificar abertura do modal para adicionar nova ação rápida

**Pré-condições**:
- Usuário autenticado no dashboard
- Modo de edição ativado

**Passos**:
1. Entrar em modo de edição
2. Clicar no botão "+" para adicionar nova ação

**Resultado Esperado**:
- Modal "Nova Ação Rápida" é exibido
- Campos de título, descrição, funcionalidade e cor estão visíveis

**Status**: ✅ Implementado

---

## CT-DASH-008: Adicionar Nova Ação Rápida
**Objetivo**: Verificar adição de nova ação rápida ao dashboard

**Pré-condições**:
- Usuário autenticado no dashboard
- Modo de edição ativado
- Modal de nova ação aberto

**Passos**:
1. Abrir modal de nova ação
2. Selecionar funcionalidade "/entradas"
3. Clicar em "Adicionar"

**Resultado Esperado**:
- Modal é fechado
- Nova ação "Registrar Entradas" aparece no dashboard
- Campos são preenchidos automaticamente ao selecionar funcionalidade

**Status**: ✅ Implementado

---

## CT-DASH-009: Remover Ação Rápida
**Objetivo**: Verificar remoção de ação rápida do dashboard

**Pré-condições**:
- Usuário autenticado no dashboard
- Modo de edição ativado
- Pelo menos uma ação rápida existente

**Passos**:
1. Entrar em modo de edição
2. Clicar no botão "×" de uma ação
3. Confirmar remoção no diálogo

**Resultado Esperado**:
- Ação é removida do dashboard
- Número total de ações diminui

**Status**: ✅ Implementado

---

## CT-DASH-010: Persistir Ações Após Novo Login
**Objetivo**: Verificar se ações rápidas personalizadas persistem após logout/login

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Adicionar nova ação "Registrar Saídas"
2. Verificar que ação foi adicionada
3. Navegar para tela de login
4. Fazer login novamente
5. Verificar dashboard

**Resultado Esperado**:
- Ação "Registrar Saídas" continua visível após novo login
- Ações são salvas no localStorage

**Status**: ✅ Implementado

---

## CT-DASH-011: Alternar Modo Claro/Escuro
**Objetivo**: Verificar alternância entre modo claro e escuro

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Verificar modo inicial (claro)
2. Clicar no botão de tema
3. Verificar mudança para modo escuro
4. Clicar novamente no botão de tema
5. Verificar retorno ao modo claro

**Resultado Esperado**:
- Modo claro: background bg-purple-50
- Modo escuro: background bg-gray-900
- Alternância funciona corretamente nos dois sentidos

**Status**: ✅ Implementado

---

## CT-DASH-012: Navegar por Todos os Links da Sidebar
**Objetivo**: Verificar navegação por todos os itens do menu lateral

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Clicar em "Entradas" na sidebar
2. Clicar em "Saídas" na sidebar
3. Clicar em "Lotes" na sidebar
4. Clicar em "Fornecedores" na sidebar
5. Clicar em "Produtos" na sidebar
6. Clicar em "Dashboard" na sidebar

**Resultado Esperado**:
- Cada clique redireciona para a página correta
- URLs: /entradas, /saidas, /lotes, /fornecedores, /produtos, /dashboard

**Status**: ✅ Implementado

---

## CT-DASH-013: Fazer Logout
**Objetivo**: Verificar se o botão de logout funciona corretamente

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Verificar que nome do usuário está visível
2. Clicar no botão "Sair"

**Resultado Esperado**:
- Usuário é deslogado
- Redirecionado para página de login (/login)
- Token removido do localStorage

**Status**: ✅ Implementado

---

## CT-DASH-014: Exibir Nome do Usuário
**Objetivo**: Verificar se o nome do usuário logado aparece no header

**Pré-condições**:
- Usuário autenticado no dashboard

**Passos**:
1. Acessar dashboard
2. Verificar header superior

**Resultado Esperado**:
- Nome "Administrador" é exibido no header
- Nome está visível ao lado do botão de tema

**Status**: ✅ Implementado

---

## Resumo dos Testes

**Total de Casos de Teste**: 14
**Implementados**: 14 ✅
**Pendentes**: 0

## Cobertura de Funcionalidades

- ✅ Exibição do Dashboard
- ✅ Lotes Próximos ao Vencimento
- ✅ Navegação via Ações Rápidas
- ✅ Modo de Edição de Ações
- ✅ Adicionar Ações Rápidas
- ✅ Remover Ações Rápidas
- ✅ Persistência de Ações
- ✅ Modo Claro/Escuro
- ✅ Navegação pela Sidebar
- ✅ Logout
- ✅ Informações do Usuário
