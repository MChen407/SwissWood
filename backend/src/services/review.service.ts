import { reviewRepository } from '../repositories/review.repository.js'
import { productRepository } from '../repositories/product.repository.js'
import { toProductReviewDto, normalizeLocale, type Locale } from '../dto/public.dto.js'
import { deeplService, DeeplNotConfiguredError } from './deepl.service.js'
import { NotFoundError } from '../utils/httpErrors.js'

export interface CreateReviewInput {
  productId: string
  rating: number
  comment?: string
}

interface ReviewAuthor {
  id: string
  firstName: string
  lastName: string
}

function toReviewAuthor(user: ReviewAuthor) {
  return { id: user.id, first_name: user.firstName, last_name: user.lastName }
}

export const reviewService = {
  async getApprovedByProduct(productId: string, locale?: Locale) {
    const product = await productRepository.findById(productId)
    if (!product || !product.isActive) {
      throw new NotFoundError('Produit introuvable')
    }
    const loc = normalizeLocale(locale)
    const reviews = await reviewRepository.findApprovedByProduct(productId)
    return reviews.map((review) => ({
      ...toProductReviewDto(review, loc),
      user: toReviewAuthor(review.user),
    }))
  },

  async listLatestApproved(limit: number, locale?: Locale) {
    const loc = normalizeLocale(locale)
    const reviews = await reviewRepository.findLatestApproved(limit)
    return reviews.map((review) => ({
      ...toProductReviewDto(review, loc),
      product: review.product,
      user: toReviewAuthor(review.user),
    }))
  },

  async create(userId: string, input: CreateReviewInput) {
    const product = await productRepository.findById(input.productId)
    if (!product || !product.isActive) {
      throw new NotFoundError('Produit introuvable')
    }
    const review = await reviewRepository.create({
      userId,
      productId: input.productId,
      rating: input.rating,
      comment: input.comment,
    })

    if (deeplService.isConfigured() && review.comment) {
      try {
        const targets: Locale[] = ['en', 'es', 'de']
        const translations: Record<string, { comment?: string }> = {}
        for (const target of targets) {
          const [translated] = await deeplService.translateTexts([review.comment], target, 'fr')
          translations[target] = { comment: (translated ?? '').trim() }
        }
        await reviewRepository.updateTranslations(review.id, translations)
      } catch (err) {
        console.error('[DeepL] auto-translate review failed:', err)
      }
    }
    return toProductReviewDto(review)
  },

  async listMine(userId: string) {
    const reviews = await reviewRepository.findByUser(userId)
    return reviews.map((r) => toProductReviewDto(r))
  },

  async listAll(locale?: Locale) {
    const loc = normalizeLocale(locale)
    const reviews = await reviewRepository.listAll()
    return reviews.map((review) => ({
      ...toProductReviewDto(review, loc),
      product: review.product,
      user: toReviewAuthor(review.user),
    }))
  },

  async approve(id: string) {
    const existing = await reviewRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Avis introuvable')
    }
    const review = await reviewRepository.setModeration(id, { isApproved: true, isRejected: false })
    return toProductReviewDto(review)
  },

  async reject(id: string) {
    const existing = await reviewRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Avis introuvable')
    }
    const review = await reviewRepository.setModeration(id, { isApproved: false, isRejected: true })
    return toProductReviewDto(review)
  },

  /**
   * Traduit automatiquement (DeepL) les avis existants vers en/es/de.
   * Par défaut, ne traduit que les langues manquantes. Avec `force = true`, écrase.
   * Retourne un récapitulatif { translated, skipped, failed, lastError? }.
   */
  async translateAllMissing(force = false): Promise<{ translated: number; skipped: number; failed: number; lastError?: string }> {
    if (!deeplService.isConfigured()) {
      throw new DeeplNotConfiguredError()
    }

    const reviews = await reviewRepository.listAll()
    const targets: Locale[] = ['en', 'es', 'de']
    const summary = { translated: 0, skipped: 0, failed: 0, lastError: undefined as string | undefined }

    for (const review of reviews) {
      if (!review.comment || review.comment.trim() === '') {
        summary.skipped += 1
        continue
      }
      const existing = (review.translations ?? {}) as Record<string, { comment?: string }>
      const next: Record<string, { comment?: string }> = JSON.parse(JSON.stringify(existing))
      let changed = false
      try {
        for (const target of targets) {
          const current = next[target] ?? {}
          const hasComment = typeof current.comment === 'string' && current.comment.trim() !== ''
          if (!force && hasComment) {
            continue
          }

          const translated = await deeplService.translateTexts(
            [review.comment],
            target,
            'fr',
          )
          next[target] = { comment: (translated[0] ?? '').trim() }
          changed = true
        }
        if (changed) {
          await reviewRepository.updateTranslations(review.id, next)
          summary.translated += 1
        } else {
          summary.skipped += 1
        }
      } catch (err) {
        summary.failed += 1
        summary.lastError = err instanceof Error ? err.message : String(err)
        console.error('[DeepL] review translation failed:', err)
      }
    }

    return summary
  },
}