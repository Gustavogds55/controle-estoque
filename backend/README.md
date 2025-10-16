# Backend - Controle de Estoque

## Instalação

```bash
cd backend
npm install
```

## Configuração

1. Configure o arquivo `.env` com suas credenciais do MySQL
2. Execute o script do banco de dados:
```bash
mysql -u root -p < ../database/schema.sql
```

## Executar

```bash
npm run dev
```

Servidor estará rodando em: http://localhost:3000

## Documentação

### Swagger UI
Acesse: http://localhost:3000/api-docs

### Postman
Importe o arquivo `postman_collection.json` no Postman para testar as rotas.

## Rotas de Autenticação

### POST /api/auth/register
Registrar novo usuário
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### POST /api/auth/login
Fazer login
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

Retorna:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

### POST /api/auth/logout
Fazer logout (requer token)
```
Headers: Authorization: Bearer {token}
```

### GET /api/auth/me
Obter dados do usuário logado (requer token)
```
Headers: Authorization: Bearer {token}
```

## Testar Manualmente

```bash
# Health check (verifica se a API está funcionando)
curl http://localhost:3000/api/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'
```
