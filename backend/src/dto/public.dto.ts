import type { Product, ProductReview, CmsContent } from '@prisma/client'
import type { ProductEssence } from '@/constants'

export interface ProductDto {
  id: string
  name: string
  slug: string
  essence: ProductEssence
  description: string
  price_eur: number
  price_usd: number
  price_fcfa: number
  stock: number
  dimensions: object
  images: string[]
  characteristics: object
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    essence: product.essence,
    description: product.description,
    price_eur: product.priceEur,
    price_usd: product.priceUsd,
    price_fcfa: product.priceFcfa,
    stock: product.stock,
    dimensions: product.dimensions,
    images: Array.isArray(product.images) ? product.images : [],
    characteristics: product.characteristics,
    is_active: product.isActive,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  }
}

export interface ProductReviewDto {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  is_approved: boolean
  is_rejected: boolean
  created_at: Date
}

export function toProductReviewDto(review: ProductReview): ProductReviewDto {
  return {
    id: review.id,
    product_id: review.productId,
    user_id: review.userId,
    rating: review.rating,
    comment: review.comment,
    is_approved: review.isApproved,
    is_rejected: review.isRejected,
    created_at: review.createdAt,
  }
}

export interface CmsContentDto {
  id: string
  key: string
  value: string
  type: string
  label: string
  updated_at: Date
}

export function toCmsContentDto(content: CmsContent): CmsContentDto {
  return {
    id: content.id,
    key: content.key,
    value: content.value,
    type: content.type,
    label: content.label,
    updated_at: content.updatedAt,
  }
}