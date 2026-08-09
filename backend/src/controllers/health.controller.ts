import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/apiResponse.js'

export function getHealth(_req: Request, res: Response): void {
  ApiResponse.success(
    res,
    {
      status: 'ok',
      message: 'API SwissWood opérationnelle',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    },
    StatusCodes.OK
  )
}