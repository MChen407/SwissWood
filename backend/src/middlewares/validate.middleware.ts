import type { NextFunction, Request, Response } from 'express'
import type { AnyZodObject, ZodEffects } from 'zod'
import { ValidationError } from '../utils/httpErrors.js'

export type ZodSchema = AnyZodObject | ZodEffects<AnyZodObject>

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      return next(new ValidationError('Données invalides', details))
    }

    Object.assign(req, result.data)
    next()
  }
}