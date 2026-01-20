export default class DocumentationController {
    async index({ response }) {
        const endpoints = {
            titulo: 'SistEstoque - API de Gerenciamento de Estoque',
            versao: '1.0.0',
            descricao: 'API REST completa para gerenciamento de estoque de produtos com autenticação por token',
            baseUrl: 'http://127.0.0.1:3333',
            autenticacao: {
                tipo: 'Bearer Token',
                descricao: 'Todos os endpoints (exceto /auth/register e /auth/login) requerem autenticação',
                header: 'Authorization: Bearer {token}'
            },
            endpoints: {
                autenticacao: {
                    grupo: 'AUTENTICAÇÃO',
                    descricao: 'Endpoints para gerenciar autenticação de usuários',
                    requerAutenticacao: false,
                    rotas: [
                        {
                            metodo: 'POST',
                            rota: '/api/auth/register',
                            descricao: 'Registrar novo usuário',
                            parametros: {
                                name: 'Nome do usuário (obrigatório)',
                                email: 'Email único (obrigatório)',
                                password: 'Senha com mínimo 8 caracteres (obrigatório)'
                            },
                            exemplo: {
                                body: {
                                    name: 'João Silva',
                                    email: 'joao@example.com',
                                    password: 'senha123456'
                                }
                            },
                            resposta: {
                                status: 201,
                                exemplo: {
                                    user: {
                                        id: 1,
                                        name: 'João Silva',
                                        email: 'joao@example.com',
                                        role: 'user',
                                        createdAt: '2026-01-20T14:39:55.609-03:00',
                                        updatedAt: '2026-01-20T14:39:55.609-03:00'
                                    },
                                    token: 'oat_NA.UE42U0RlVG5sSE9HVzRGY0V6Qy1JU3R2dTlKZG5PeDZjdEpCbkE1djIzOTU0NjU3NA'
                                }
                            }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/auth/login',
                            descricao: 'Fazer login e obter token de acesso',
                            parametros: {
                                email: 'Email do usuário (obrigatório)',
                                password: 'Senha do usuário (obrigatório)'
                            },
                            exemplo: {
                                body: {
                                    email: 'joao@example.com',
                                    password: 'senha123456'
                                }
                            },
                            resposta: {
                                status: 201,
                                exemplo: {
                                    user: {
                                        id: 1,
                                        name: 'João Silva',
                                        email: 'joao@example.com',
                                        role: 'user'
                                    },
                                    token: 'oat_NQ.d2c2WUFycmhwOWx4OFpkZHZsUGlIeVhhTGF1ckZrelBoVmVnMU9NZzQyNDY1NzEzNDk'
                                }
                            }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/auth/me',
                            descricao: 'Obter dados do usuário autenticado',
                            requerAutenticacao: true,
                            resposta: {
                                status: 200,
                                exemplo: {
                                    id: 1,
                                    name: 'João Silva',
                                    email: 'joao@example.com',
                                    role: 'user'
                                }
                            }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/auth/logout',
                            descricao: 'Fazer logout e revogar token',
                            requerAutenticacao: true,
                            resposta: {
                                status: 200,
                                exemplo: {
                                    message: 'Logout realizado com sucesso'
                                }
                            }
                        }
                    ]
                },
                usuarios: {
                    grupo: 'USUÁRIOS',
                    descricao: 'Endpoints para gerenciar usuários do sistema',
                    requerAutenticacao: true,
                    rotas: [
                        {
                            metodo: 'GET',
                            rota: '/api/users',
                            descricao: 'Listar todos os usuários',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/users/:id',
                            descricao: 'Obter dados de um usuário específico',
                            parametros: { id: 'ID do usuário (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/users/:id',
                            descricao: 'Atualizar dados do usuário',
                            parametros: { id: 'ID do usuário (obrigatório)' },
                            parametrosBody: { name: 'Novo nome', role: 'Novo role' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'DELETE',
                            rota: '/api/users/:id',
                            descricao: 'Deletar um usuário',
                            parametros: { id: 'ID do usuário (obrigatório)' },
                            resposta: { status: 204 }
                        }
                    ]
                },
                categorias: {
                    grupo: 'CATEGORIAS',
                    descricao: 'Endpoints para gerenciar categorias de produtos',
                    requerAutenticacao: true,
                    rotas: [
                        {
                            metodo: 'GET',
                            rota: '/api/categories',
                            descricao: 'Listar todas as categorias',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/categories',
                            descricao: 'Criar nova categoria',
                            parametros: {
                                name: 'Nome da categoria (obrigatório, mínimo 3 caracteres)',
                                description: 'Descrição (opcional)'
                            },
                            resposta: { status: 201 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/categories/:id',
                            descricao: 'Obter categoria com seus produtos',
                            parametros: { id: 'ID da categoria (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/categories/:id',
                            descricao: 'Atualizar categoria',
                            parametros: { id: 'ID da categoria (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'DELETE',
                            rota: '/api/categories/:id',
                            descricao: 'Deletar categoria (deleta produtos relacionados)',
                            parametros: { id: 'ID da categoria (obrigatório)' },
                            resposta: { status: 204 }
                        }
                    ]
                },
                produtos: {
                    grupo: 'PRODUTOS',
                    descricao: 'Endpoints para gerenciar produtos do estoque',
                    requerAutenticacao: true,
                    rotas: [
                        {
                            metodo: 'GET',
                            rota: '/api/products',
                            descricao: 'Listar todos os produtos',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/products',
                            descricao: 'Criar novo produto',
                            parametros: {
                                name: 'Nome do produto (obrigatório)',
                                description: 'Descrição (opcional)',
                                price: 'Preço (obrigatório, deve ser positivo)',
                                stock_quantity: 'Quantidade em estoque (padrão: 0)',
                                minimum_stock: 'Quantidade mínima (padrão: 0)',
                                categoryId: 'ID da categoria (obrigatório)'
                            },
                            resposta: { status: 201 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/products/:id',
                            descricao: 'Obter produto com detalhes (categoria, movimentações, alertas)',
                            parametros: { id: 'ID do produto (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/products/:id',
                            descricao: 'Atualizar dados do produto',
                            parametros: { id: 'ID do produto (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/products/:id/stock',
                            descricao: 'Atualizar estoque do produto manualmente',
                            parametros: { id: 'ID do produto (obrigatório)' },
                            parametrosBody: { quantity: 'Nova quantidade (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'DELETE',
                            rota: '/api/products/:id',
                            descricao: 'Deletar produto',
                            parametros: { id: 'ID do produto (obrigatório)' },
                            resposta: { status: 204 }
                        }
                    ]
                },
                movimentacoes: {
                    grupo: 'MOVIMENTAÇÕES DE ESTOQUE',
                    descricao: 'Endpoints para registrar entradas e saídas de estoque',
                    requerAutenticacao: true,
                    rotas: [
                        {
                            metodo: 'GET',
                            rota: '/api/stock-movements',
                            descricao: 'Listar todas as movimentações de estoque',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/stock-movements',
                            descricao: 'Registrar nova movimentação (entrada ou saída)',
                            parametros: {
                                productId: 'ID do produto (obrigatório)',
                                type: 'Tipo: entrada ou saida (obrigatório)',
                                quantity: 'Quantidade (obrigatório, deve ser positiva)',
                                movementDate: 'Data da movimentação (opcional, padrão: agora)'
                            },
                            validacoes: 'Para saídas, valida se quantity <= stock_quantity',
                            efeitos: 'Atualiza estoque automaticamente, cria alerta se estoque <= mínimo',
                            resposta: { status: 201 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/stock-movements/:id',
                            descricao: 'Obter detalhes de uma movimentação específica',
                            parametros: { id: 'ID da movimentação (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/stock-movements/product/:productId',
                            descricao: 'Listar todas as movimentações de um produto',
                            parametros: { productId: 'ID do produto (obrigatório)' },
                            resposta: { status: 200 }
                        }
                    ]
                },
                alertas: {
                    grupo: 'ALERTAS',
                    descricao: 'Endpoints para gerenciar alertas de estoque',
                    requerAutenticacao: true,
                    rotas: [
                        {
                            metodo: 'GET',
                            rota: '/api/alerts',
                            descricao: 'Listar todos os alertas',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'POST',
                            rota: '/api/alerts',
                            descricao: 'Criar novo alerta',
                            parametros: {
                                productId: 'ID do produto (obrigatório)',
                                alertType: 'Tipo: estoque_baixo, fora_estoque ou outro (obrigatório)',
                                message: 'Mensagem do alerta (obrigatório)'
                            },
                            resposta: { status: 201 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/alerts/:id',
                            descricao: 'Obter alerta específico',
                            parametros: { id: 'ID do alerta (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'GET',
                            rota: '/api/alerts/unread/list',
                            descricao: 'Listar apenas alertas não lidos',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/alerts/:id',
                            descricao: 'Marcar alerta como lido/não lido',
                            parametros: { id: 'ID do alerta (obrigatório)' },
                            parametrosBody: { isRead: 'Boolean (obrigatório)' },
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'PATCH',
                            rota: '/api/alerts/all/mark-read',
                            descricao: 'Marcar todos os alertas como lidos',
                            resposta: { status: 200 }
                        },
                        {
                            metodo: 'DELETE',
                            rota: '/api/alerts/:id',
                            descricao: 'Deletar alerta',
                            parametros: { id: 'ID do alerta (obrigatório)' },
                            resposta: { status: 204 }
                        }
                    ]
                }
            },
            resumo: {
                totalEndpoints: 39,
                endpointsPublicos: 2,
                endpointsProtegidos: 37,
                grupos: 6,
                autenticacao: 'Bearer Token (obtém ao fazer login ou registrar)'
            },
            dicas: [
                'Sempre inclua o header Authorization: Bearer {token} nas requisições (exceto /auth/register e /auth/login)',
                'Ao registrar uma saída que deixa o estoque <= mínimo, um alerta é criado automaticamente',
                'Deletar uma categoria deleta todos seus produtos (CASCADE)',
                'Cada movimentação registra qual usuário fez a operação',
                'Use /api/alerts/unread/list para monitorar novos alertas',
                'Para desenvolvimento, todos os endpoints estão documentados em /guia-pratico'
            ]
        };
        return response.ok(endpoints);
    }
}
//# sourceMappingURL=documentation_controller.js.map