/**
 * Testes para autenticação
 * 
 * @description Testa operações de registro, login e logout
 */
import { test } from '@japa/runner'

test.group('Auth - Register', (group) => {
  group.each.setup(async ({ context }) => {
    context.client = context.client || {}
  })

  test('deve registrar um novo usuário', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    response.assertStatus(201)
    response.assertBodyContains('token')
    response.assertBodyContains('user')
  })

  test('deve retornar erro com dados inválidos', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      name: 'Jo',
      email: 'invalid-email',
      password: 'short',
    })

    response.assertStatus(422)
  })

  test('deve retornar erro com email duplicado', async ({ client }) => {
    await client.post('/api/auth/register').json({
      name: 'User 1',
      email: 'duplicate@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/auth/register').json({
      name: 'User 2',
      email: 'duplicate@example.com',
      password: 'password456',
    })

    response.assertStatus(422)
  })
})

test.group('Auth - Login', (group) => {
  group.each.setup(async ({ context }) => {
    context.client = context.client || {}
  })

  test('deve fazer login com credenciais válidas', async ({ client }) => {
    await client.post('/api/auth/register').json({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/auth/login').json({
      email: 'login@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains('token')
    response.assertBodyContains('user')
  })

  test('deve retornar erro com senha inválida', async ({ client }) => {
    await client.post('/api/auth/register').json({
      name: 'Wrong Password User',
      email: 'wrongpass@example.com',
      password: 'correct_password',
    })

    const response = await client.post('/api/auth/login').json({
      email: 'wrongpass@example.com',
      password: 'wrong_password',
    })

    response.assertStatus(400)
  })

  test('deve retornar erro com usuário inexistente', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    response.assertStatus(400)
  })
})

test.group('Auth - Protected Routes', (group) => {
  group.each.setup(async ({ context }) => {
    context.client = context.client || {}
  })

  test('deve acessar rota protegida com token válido', async ({ client }) => {
    const registerResponse = await client.post('/api/auth/register').json({
      name: 'Protected User',
      email: 'protected@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().token

    const response = await client.get('/api/auth/me').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    response.assertBodyContains('protected@example.com')
  })

  test('deve retornar erro sem token', async ({ client }) => {
    const response = await client.get('/api/auth/me')

    response.assertStatus(401)
  })
})
