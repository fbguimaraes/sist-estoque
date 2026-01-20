/**
 * Testes para categorias
 * 
 * @description Testa operações CRUD de categorias
 */
import { test } from '@japa/runner'

let authToken: string

test.group('Categories', (group) => {
  group.each.setup(async ({ context }) => {
    context.client = context.client || {}
    
    // Criar usuário e obter token
    if (!authToken) {
      const response = await context.client.post('/api/auth/register').json({
        name: 'Category Test User',
        email: `category-${Date.now()}@example.com`,
        password: 'password123',
      })
      authToken = response.body().token
    }
  })

  test('deve listar todas as categorias', async ({ client }) => {
    const response = await client
      .get('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
  })

  test('deve criar uma categoria', async ({ client }) => {
    const response = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Eletrônicos',
        description: 'Produtos eletrônicos em geral',
      })

    response.assertStatus(201)
    response.assertBodyContains('Eletrônicos')
  })

  test('deve retornar erro com dados inválidos', async ({ client }) => {
    const response = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'A',
        description: 'Descrição',
      })

    response.assertStatus(422)
  })

  test('deve exibir uma categoria com seus produtos', async ({ client }) => {
    // Criar categoria
    const createResponse = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Ferramentas',
        description: 'Ferramentas em geral',
      })

    const categoryId = createResponse.body().id

    // Buscar categoria
    const response = await client
      .get(`/api/categories/${categoryId}`)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
    response.assertBodyContains('Ferramentas')
  })

  test('deve atualizar uma categoria', async ({ client }) => {
    // Criar categoria
    const createResponse = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Alimentos',
        description: 'Alimentos variados',
      })

    const categoryId = createResponse.body().id

    // Atualizar
    const response = await client
      .patch(`/api/categories/${categoryId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Alimentos Frescos',
        description: 'Alimentos frescos e orgânicos',
      })

    response.assertStatus(200)
    response.assertBodyContains('Alimentos Frescos')
  })

  test('deve deletar uma categoria', async ({ client }) => {
    // Criar categoria
    const createResponse = await client
      .post('/api/categories')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Categoria Temporária',
        description: 'Será deletada',
      })

    const categoryId = createResponse.body().id

    // Deletar
    const response = await client
      .delete(`/api/categories/${categoryId}`)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(204)
  })
})
