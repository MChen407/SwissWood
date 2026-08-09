import { env } from '../config/env.js'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { userRepository } from '../repositories/user.repository.js'
import { UnauthorizedError } from '../utils/httpErrors.js'

interface GoogleUserInfo {
  sub: string
  email: string
  email_verified: boolean
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  scope?: string
}

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

function isGoogleConfigured(): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL)
}

export function createOAuthState(): string {
  const options: SignOptions = { expiresIn: '10m' }
  return jwt.sign({ purpose: 'google_oauth' }, env.JWT_ACCESS_SECRET, options)
}

export function verifyOAuthState(state: string): boolean {
  try {
    const decoded = jwt.verify(state, env.JWT_ACCESS_SECRET) as { purpose?: string }
    return decoded.purpose === 'google_oauth'
  } catch {
    return false
  }
}

export function buildGoogleAuthorizationUrl(state: string): string {
  if (!isGoogleConfigured()) {
    throw new Error('OAuth Google non configuré')
  }
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: env.GOOGLE_CALLBACK_URL!,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  })
  return `${GOOGLE_AUTHORIZATION_URL}?${params.toString()}`
}

async function exchangeCode(code: string): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID!,
    client_secret: env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: env.GOOGLE_CALLBACK_URL!,
    grant_type: 'authorization_code',
  })

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!response.ok) {
    throw new UnauthorizedError('Échec de l’échange du code Google')
  }

  return (await response.json()) as GoogleTokenResponse
}

async function fetchGoogleProfile(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new UnauthorizedError('Impossible de récupérer le profil Google')
  }

  return (await response.json()) as GoogleUserInfo
}

async function findOrCreateGoogleUser(profile: GoogleUserInfo) {
  const existing = await userRepository.findByEmailOrGoogle(profile.email, profile.sub)

  if (existing) {
    if (!existing.googleId && profile.email === existing.email) {
      return userRepository.update(existing.id, {
        googleId: profile.sub,
        emailVerified: true,
        avatarUrl: profile.picture ?? undefined,
      })
    }
    return existing
  }

  return userRepository.create({
    email: profile.email,
    googleId: profile.sub,
    firstName: profile.given_name ?? profile.name?.split(' ')[0] ?? '',
    lastName: profile.family_name ?? profile.name?.split(' ').slice(1).join(' ') ?? '',
    emailVerified: Boolean(profile.email_verified),
    avatarUrl: profile.picture,
  })
}

export const googleOAuthService = {
  isConfigured: isGoogleConfigured,

  buildAuthorizationUrl(state: string): string {
    return buildGoogleAuthorizationUrl(state)
  },

  async authenticate(code: string) {
    if (!isGoogleConfigured()) {
      throw new UnauthorizedError('OAuth Google non configuré')
    }

    const { access_token: accessToken } = await exchangeCode(code)
    const profile = await fetchGoogleProfile(accessToken)
    const user = await findOrCreateGoogleUser(profile)
    return user
  },
}