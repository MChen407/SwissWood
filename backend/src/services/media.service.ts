import { env } from '../config/env.js'
import { destroyImage, uploadBuffer } from '../config/cloudinary.js'

export type UploadedImage = { publicId: string; url: string }

export async function storeImageFiles(files: Express.Multer.File[]): Promise<UploadedImage[]> {
  const images: UploadedImage[] = []

  for (const file of files) {
    const uploaded = await uploadBuffer(file.buffer, { folder: env.CLOUDINARY_FOLDER })
    images.push(uploaded)
  }

  return images
}

export async function deleteImage(publicId: string): Promise<void> {
  await destroyImage(publicId)
}
