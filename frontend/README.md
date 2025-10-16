# Frontend - Controle de Estoque

## Instalação

```bash
cd frontend
npm install
```

## Executar

```bash
npm run dev
```

Frontend estará rodando em: http://localhost:3001

## Credenciais de Teste

- Email: admin@estoque.com
- Senha: 123456

ou

- Email: joao@estoque.com
- Senha: 123456

## Funcionalidades

- ✅ Login/Logout
- ✅ Gerenciamento de Produtos (CRUD completo)
- ✅ Autenticação JWT
- ✅ Interface responsiva com TailwindCSS

## Estrutura

```
frontend/
├── pages/
│   ├── index.vue          # Página inicial (redireciona)
│   ├── login.vue          # Página de login
│   └── produtos/
│       └── index.vue      # Gerenciamento de produtos
├── layouts/
│   └── default.vue        # Layout padrão com navegação
├── stores/
│   └── auth.js            # Store de autenticação (Pinia)
├── composables/
│   └── useApi.js          # Composable para chamadas API
├── middleware/
│   └── auth.js            # Middleware de autenticação
└── assets/
    └── css/
        └── main.css       # Estilos TailwindCSS
```
