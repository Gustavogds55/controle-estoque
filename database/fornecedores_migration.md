# 🗄️ Migration - Tabela Fornecedores

## Script SQL para criar tabela de fornecedores

```sql
-- Criar tabela fornecedores
CREATE TABLE fornecedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Adicionar coluna fornecedor_id na tabela movimentacoes
ALTER TABLE movimentacoes 
ADD COLUMN fornecedor_id INT,
ADD FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id);
```

## Como executar:

1. Acesse o MySQL:
```bash
mysql -u root -p
```

2. Selecione o banco:
```sql
USE controle_estoque;
```

3. Execute o script acima

4. Verifique:
```sql
DESCRIBE fornecedores;
DESCRIBE movimentacoes;
```
