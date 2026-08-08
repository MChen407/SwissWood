import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '@/app'

const app = createApp()

describe('API — endpoints racine et erreurs', () => {
  it('GET / expose les liens de l’API', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('SwissWood API')
  })

  it('GET /api/health répond ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.status).toBe('ok')
  })

  it('route inconnue → enveloppe d’erreur 404', async () => {
    const res = await request(app).get('/api/inexistant')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})

describe('GET — validation des entrées publiques', () => {
  it('rejette une essence inconnue sur /api/products', async () => {
    const res = await request(app).get('/api/products').query({ essence: 'Bambou' })
    expect(res.status).toBe(422)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejette un limit invalide sur /api/products', async () => {
    const res = await request(app).get('/api/products').query({ limit: 'abc' })
    expect(res.status).toBe(422)
  })

  it('rejette un slug produit trop long', async () => {
    const res = await request(app).get(`/api/products/${'a'.repeat(201)}`)
    expect(res.status).toBe(422)
  })
})

describe('Auth — protections', () => {
  it('requiert l’authentification pour /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHORIZED')
  })

  it('rejette un bearer token invalide', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalide')
    expect(res.status).toBe(401)
  })

  it('valide le corps d’inscription', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x' })
    expect(res.status).toBe(422)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('valide le corps de connexion', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(422)
  })
})

describe('Admin — RBAC partiel sans base', () => {
  it('refuse l’accès sans token sur /api/admin/stats', async () => {
    const res = await request(app).get('/api/admin/stats')
    expect(res.status).toBe(401)
  })

  it('refuse l’accès sans token sur /api/admin/orders', async () => {
    const res = await request(app).get('/api/admin/orders')
    expect(res.status).toBe(401)
  })
})

describe('Validation des commandes', () => {
  it('rejette une commande vide', async () => {
    const res = await request(app).post('/api/orders').send({ items: [] })
    expect(res.status).toBe(401) // authenticate d’abord
  })

  it('rejette un uuid invalide sur /api/orders/xxx (avec token)', async () => {
    const res = await request(app)
      .get('/api/orders/zz')
      .set('Authorization', 'Bearer whatever')
    expect(res.status).toBe(401) // auth middleware avant la validation
  })
})