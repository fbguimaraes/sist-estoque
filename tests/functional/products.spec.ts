/**
 * Testes para produtos
 * 
 * @description Testa operações CRUD de produtos
 */
import { test } from '@japa/runner'

let authToken: string
let categoryId: number

test.group('Products', (group) => {
  group.each.setup(async ({ context }) => {
    context.client = context.client || {}
    
    // Criar usuário e obter token
    if (!authToken) {
      const registerResponse = await context.client.post('/api/auth/register').json({
        name: 'Product Test User',
        email: `product-${Date.now()}@example.com`,
        password: 'password123',
      })
      authToken = registerResponse.body().token

      // Criar categoria
      const categoryResponse = await context.client
        .post('/api/categories')
        .header('Authorization', `Bearer ${authToken}`)
        .json({
          name: 'Categoria Teste',
          description: 'Categoria para testes',
        })
      categoryId = categoryResponse.body().id
    }
  })

  test('deve listar todos os produtos', async ({ client }) => {
    const response = await client
      .get('/api/products')
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
  })

  test('deve criar um produto', async ({ client }) => {
    const response = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Notebook Dell',
        description: 'Notebook Dell Core i7',
        price: 3500.50,
        stockQuantity: 10,
        minimumStock: 2,
        categoryId,
      })

    response.assertStatus(201)
    response.assertBodyContains('Notebook Dell')
  })

  test('deve retornar erro com dados inválidos', async ({ client }) => {
    const response = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'P',
        description: 'Descrição',
        price: -100,
        categoryId,
      })

    response.assertStatus(422)
  })

  test('deve exibir um produto com todas as relações', async ({ client }) => {
    // Criar produto
    const createResponse = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Mouse Logitech',
        description: 'Mouse wireless Logitech',
        price: 89.90,
        stockQuantity: 50,
        minimumStock: 5,
        categoryId,
      })

    const productId = createResponse.body().id

    // Buscar produto
    const response = await client
      .get(`/api/products/${productId}`)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(200)
    response.assertBodyContains('Mouse Logitech')
  })

  test('deve atualizar um produto', async ({ client }) => {
    // Criar produto
    const createResponse = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Teclado Original',
        description: 'Teclado original',
        price: 150.00,
        stockQuantity: 20,
        minimumStock: 3,
        categoryId,
      })

    const productId = createResponse.body().id

    // Atualizar
    const response = await client
      .patch(`/api/products/${productId}`)
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Teclado Mecânico',
        price: 250.00,
      })

    response.assertStatus(200)
    response.assertBodyContains('Teclado Mecânico')
  })

  test('deve atualizar estoque de um produto', async ({ client }) => {
    // Criar produto
    const createResponse = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Monitor Samsung',
        description: 'Monitor 24 polegadas',
        price: 800.00,
        stockQuantity: 5,
        minimumStock: 2,
        categoryId,
      })

    const productId = createResponse.body().id

    // Atualizar estoque
    const response = await client
      .patch(`/api/products/${productId}/stock`)
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        stockQuantity: 15,
      })

    response.assertStatus(200)
  })

  test('deve deletar um produto', async ({ client }) => {
    // Criar produto
    const createResponse = await client
      .post('/api/products')
      .header('Authorization', `Bearer ${authToken}`)
      .json({
        name: 'Produto Temporário',
        description: 'Será deletado',
        price: 10.00,
        stockQuantity: 1,
        minimumStock: 1,
        categoryId,
      })

    const productId = createResponse.body().id

    // Deletar
    const response = await client
      .delete(`/api/products/${productId}`)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(204)
  })
})
