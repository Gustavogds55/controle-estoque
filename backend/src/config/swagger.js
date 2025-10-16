export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Controle de Estoque',
    version: '1.0.0',
    description: 'API para gerenciamento de estoque com controle de validade de produtos'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desenvolvimento'
    },
    {
      url: 'http://localhost:3000',
      description: 'Rotas do sistema'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          email: { type: 'string' }
        }
      },
      Produto: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          categoria: { type: 'string' },
          descricao: { type: 'string' },
          unidade_medida: { type: 'string' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificar status da API',
        responses: {
          200: {
            description: 'API funcionando',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string', example: 'API Controle de Estoque' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registrar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'email', 'senha'],
                properties: {
                  nome: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', example: 'joao@email.com' },
                  senha: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/Usuario' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Erro de validação',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Fazer login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                  email: { type: 'string', example: 'joao@email.com' },
                  senha: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/Usuario' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Autenticação'],
        summary: 'Fazer logout',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Logout realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Obter dados do usuário logado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Dados do usuário',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Usuario' }
              }
            }
          },
          401: {
            description: 'Token inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar todos os produtos',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de produtos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Produto' }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Produtos'],
        summary: 'Criar novo produto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'unidade_medida'],
                properties: {
                  nome: { type: 'string', example: 'Paracetamol 500mg' },
                  categoria: { type: 'string', example: 'Medicamentos' },
                  descricao: { type: 'string', example: 'Analgésico e antitérmico' },
                  unidade_medida: { type: 'string', example: 'UN' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Produto criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' }
              }
            }
          }
        }
      }
    },
    '/produtos/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' }
              }
            }
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar produto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  categoria: { type: 'string' },
                  descricao: { type: 'string' },
                  unidade_medida: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Produto atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Produto' }
              }
            }
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Deletar produto',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: 'Produto deletado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      }
    }
  }
};
