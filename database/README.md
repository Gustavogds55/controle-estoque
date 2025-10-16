# 🗄️ Banco de Dados - Controle de Estoque

## Estrutura

### Tabelas

**usuarios**
- Controla acesso ao sistema
- Campos: id, nome, email, senha (hash)
- Email único para login

**produtos**
- Armazena informações básicas dos produtos
- Campos: id, nome, categoria, descricao, unidade_medida

**lotes**
- Controla lotes de produtos com validade
- Campos: id, produto_id, numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade
- Relacionamento: N lotes para 1 produto

**movimentacoes**
- Registra entradas e saídas de estoque
- Campos: id, lote_id, usuario_id, tipo (ENTRADA/SAIDA), quantidade, data_movimentacao, observacao
- Relacionamento: N movimentações para 1 lote, N movimentações para 1 usuário

## Como Executar

### 1. Criar o banco de dados
```bash
mysql -u root -p < database/schema.sql
```

### 2. Popular com dados de exemplo (opcional)
```bash
mysql -u root -p < database/seed.sql
```

### 3. Verificar criação
```bash
mysql -u root -p -e "USE controle_estoque; SHOW TABLES;"
```

## Configuração de Conexão

Credenciais padrão para desenvolvimento:
- **Host**: localhost
- **Port**: 3306
- **Database**: controle_estoque
- **User**: root
- **Password**: [sua senha]
