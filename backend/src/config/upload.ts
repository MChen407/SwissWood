import multer from 'multer'
import { BadRequestError } from '../utils/httpErrors.js'

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export const MAX_IMAGE_COUNT = 8
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new BadRequestError(`Type de fichier non autorisé : ${file.mimetype}`))
  }
  cb(null, true)
}

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_IMAGE_COUNT },
})
