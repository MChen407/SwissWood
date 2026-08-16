import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export function uploadBuffer(
  buffer: Buffer,
  options: { folder: string; publicId?: string } = { folder: env.CLOUDINARY_FOLDER }
): Promise<{ publicId: string; url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: 'image',
        transformation: [{ fetch_format: 'auto', quality: 'auto' }],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({ publicId: result.public_id, url: result.secure_url })
        } else {
          reject(new Error('Cloudinary : upload sans résultat'))
        }
      }
    )
    stream.end(buffer)
  })
}

export function destroyImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else if (result && result.result === 'ok') {
        resolve()
      } else {
        reject(new Error('Cloudinary : suppression impossible'))
      }
    })
  })
}