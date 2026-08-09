import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { BadRequestError } from '@/utils/httpErrors'

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export const MAX_IMAGE_COUNT = 8
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024

mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${Date.now()}-${randomUUID()}${ext}`)
  },
})

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new BadRequestError(`Type de fichier non autorisé : ${file.mimetype}`))
  }
  cb(null, true)
}

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_IMAGE_COUNT },
})
