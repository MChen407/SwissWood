import { describe, expect, it } from 'vitest'
import { registerSchema, loginSchema, refreshTokenSchema } from '../../src/validators/auth.validator.js'
import { changePasswordSchema, updateProfileSchema } from '../../src/validators/user.validator.js'
import { createOrderSchema, initPaymentSchema, orderByIdSchema, confirmPaymentSchema } from '../../src/validators/order.validator.js'
import { createReviewSchema } from '../../src/validators/review.validator.js'
import { contactMessageSchema } from '../../src/validators/contact.validator.js'
import { createProductSchema } from '../../src/validators/admin.validator.js'

describe('auth.validators', () => {
  const validUser = { email: 'JOHN@SwissWood.ch ', password: 'MotDePasse1', firstName: ' John ', lastName: 'Doe' }

  it('accepte une inscription valide et normalise email/noms', () => {
    const result = registerSchema.safeParse({ body: validUser })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.body.email).toBe('john@swisswood.ch')
      expect(result.data.body.firstName).toBe('John')
    }
  })

  it('rejette un mot de passe trop faible', () => {
    expect(registerSchema.safeParse({ body: { ...validUser, password: 'abc' } }).success).toBe(false)
    expect(registerSchema.safeParse({ body: { ...validUser, password: 'minuscule1' } }).success).toBe(false)
    expect(registerSchema.safeParse({ body: { ...validUser, password: 'MAJUSCULES' } }).success).toBe(false)
  })

  it('rejette un email invalide', () => {
    expect(registerSchema.safeParse({ body: { ...validUser, email: 'pas-un-email' } }).success).toBe(false)
  })

  it('login exige email et mot de passe', () => {
    expect(loginSchema.safeParse({ body: { email: 'a@b.ch', password: 'x' } }).success).toBe(true)
    expect(loginSchema.safeParse({ body: { email: 'a@b.ch' } }).success).toBe(false)
  })

  it('refresh token requis', () => {
    expect(refreshTokenSchema.safeParse({ body: { refreshToken: 'tok' } }).success).toBe(true)
    expect(refreshTokenSchema.safeParse({ body: {} }).success).toBe(false)
  })
})

describe('user.validators', () => {
  it('accepte un profil partiel', () => {
    expect(updateProfileSchema.safeParse({ body: { city: 'Genève' } }).success).toBe(true)
    expect(updateProfileSchema.safeParse({ body: {} }).success).toBe(true)
  })

  it('changePassword valide la politique de mot de passe', () => {
    const ok = changePasswordSchema.safeParse({ body: { currentPassword: 'old', newPassword: 'Nouveau1' } })
    expect(ok.success).toBe(true)
    const weak = changePasswordSchema.safeParse({ body: { currentPassword: 'old', newPassword: 'faible' } })
    expect(weak.success).toBe(false)
  })
})

describe('order.validators', () => {
  it('crée une commande avec un article minimal', () => {
    const body = { items: [{ productId: '11111111-1111-1111-1111-111111111111', quantity: 2 }], currency: 'EUR' }
    const result = createOrderSchema.safeParse({ body })
    expect(result.success).toBe(true)
  })

  it('rejette une commande vide', () => {
    expect(createOrderSchema.safeParse({ body: { items: [] } }).success).toBe(false)
  })

  it('rejette un uuid invalide et une quantité négative', () => {
    const base = '11111111-1111-1111-1111-111111111111'
    expect(createOrderSchema.safeParse({ body: { items: [{ productId: 'x', quantity: 1 }] } }).success).toBe(false)
    expect(createOrderSchema.safeParse({ body: { items: [{ productId: base, quantity: 0 }] } }).success).toBe(false)
  })

  it('validate une méthode de paiement', () => {
    const id = '11111111-1111-1111-1111-111111111111'
    expect(initPaymentSchema.safeParse({ params: { id }, body: { method: 'card' } }).success).toBe(true)
    expect(initPaymentSchema.safeParse({ params: { id }, body: { method: 'bitcoin' } }).success).toBe(false)
  })

  it('orderById exige un uuid', () => {
    const id = '11111111-1111-1111-1111-111111111111'
    expect(orderByIdSchema.safeParse({ params: { id } }).success).toBe(true)
    expect(orderByIdSchema.safeParse({ params: { id: 'zz' } }).success).toBe(false)
  })

  it('confirme un paiement avec un code valide (4-6 chiffres)', () => {
    const id = '11111111-1111-1111-1111-111111111111'
    expect(confirmPaymentSchema.safeParse({ params: { id } }).success).toBe(true)
    expect(confirmPaymentSchema.safeParse({ params: { id }, body: { code: '123456' } }).success).toBe(true)
    expect(confirmPaymentSchema.safeParse({ params: { id }, body: { code: '12' } }).success).toBe(false)
    expect(confirmPaymentSchema.safeParse({ params: { id }, body: { code: 'abc' } }).success).toBe(false)
  })
})

describe('review.validators', () => {
  it('accepte une note entre 1 et 5', () => {
    const pid = '11111111-1111-1111-1111-111111111111'
    expect(createReviewSchema.safeParse({ body: { productId: pid, rating: 5 } }).success).toBe(true)
    expect(createReviewSchema.safeParse({ body: { productId: pid, rating: 6 } }).success).toBe(false)
    expect(createReviewSchema.safeParse({ body: { productId: pid, rating: 0 } }).success).toBe(false)
  })
})

describe('contact.validators', () => {
  it('exige les quatre champs', () => {
    const ok = contactMessageSchema.safeParse({
      body: { name: 'Eve', email: 'eve@example.com', subject: 'Devis', message: 'Bonjour' },
    })
    expect(ok.success).toBe(true)
    expect(contactMessageSchema.safeParse({ body: { name: 'Eve', email: 'bad' } }).success).toBe(false)
  })
})

describe('admin.validators (produits)', () => {
  const base = {
    name: 'Chêne premium',
    essence: 'Teck',
    price_eur: 10000,
    price_usd: 12000,
    price_fcfa: 60000,
    stock: 12,
  }

  it('accepte un produit valide', () => {
    expect(createProductSchema.safeParse({ body: base }).success).toBe(true)
  })

  it('rejette un prix négatif ou une essence inconnue', () => {
    expect(createProductSchema.safeParse({ body: { ...base, price_eur: -1 } }).success).toBe(false)
    expect(createProductSchema.safeParse({ body: { ...base, essence: 'Bambou' } }).success).toBe(false)
  })
})