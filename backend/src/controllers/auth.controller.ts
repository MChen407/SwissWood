import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authService } from '@/services/auth.service'
import { googleOAuthService, createOAuthState, verifyOAuthState } from '@/services/googleOAuth.service'
import { ApiResponse } from '@/utils/apiResponse'
import { asyncHandler } from '@/utils/asyncHandler'
import { BadRequestError } from '@/utils/httpErrors'
import { env } from '@/config/env'
import type { LoginDto, RegisterDto } from '@/validators/auth.validator'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as RegisterDto)
  ApiResponse.success(res, result, StatusCodes.CREATED)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginDto)
  ApiResponse.success(res, result)
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refresh((req.body as { refreshToken: string }).refreshToken)
  ApiResponse.success(res, result)
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = (req.body as { refreshToken?: string } | undefined)?.refreshToken
  await authService.logout(token)
  ApiResponse.success(res, null)
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.me(req.user!.id)
  ApiResponse.success(res, result)
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.updateProfile(req.user!.id, req.body)
  ApiResponse.success(res, result)
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user!.id, req.body)
  ApiResponse.success(res, null)
})

export const googleRedirect = asyncHandler(async (_req: Request, res: Response) => {
  const state = createOAuthState()
  res.redirect(googleOAuthService.buildAuthorizationUrl(state))
})

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined
  const state = req.query.state as string | undefined

  if (!code || !state || !verifyOAuthState(state)) {
    return res.redirect(`${env.FRONTEND_URL}/connexion?error=invalid_state`)
  }

  const user = await googleOAuthService.authenticate(code)
  const session = await authService.issueSession(user.id)

  const redirectUrl = new URL('/connexion', env.FRONTEND_URL)
  redirectUrl.searchParams.set('access_token', session.tokens.accessToken)
  redirectUrl.searchParams.set('refresh_token', session.tokens.refreshToken)

  res.redirect(redirectUrl.toString())
})

export const googleStatus = asyncHandler(async (_req: Request, res: Response) => {
  if (!googleOAuthService.isConfigured()) {
    throw new BadRequestError('OAuth Google non configuré sur le serveur')
  }
  ApiResponse.success(res, {
    url: googleOAuthService.buildAuthorizationUrl(createOAuthState()),
  })
})