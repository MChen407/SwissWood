import type { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ApiError, ApiSuccess } from '../interfaces/api.interface.js'

export abstract class ApiResponse {
  static success<T>(res: Response, data: T, status: number = StatusCodes.OK): Response<ApiSuccess<T>> {
    const body: ApiSuccess<T> = { success: true, data }
    return res.status(status).json(body)
  }

  static error(
    res: Response,
    status: number,
    code: string,
    message: string,
    details?: unknown
  ): Response<ApiError> {
    const body: ApiError = {
      success: false,
      error: { code, message, ...(details !== undefined ? { details } : {}) },
    }
    return res.status(status).json(body)
  }
}