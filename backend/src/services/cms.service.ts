import { Prisma } from '@prisma/client'
import { cmsRepository } from '../repositories/cms.repository.js'
import { toCmsContentDto, normalizeLocale, type CmsContentDto } from '../dto/public.dto.js'
import { BadRequestError, NotFoundError } from '../utils/httpErrors.js'

export interface CmsUpdateInput {
  value?: string
  label?: string
  locale?: unknown
}

export const cmsService = {
  async getAll(locale?: unknown): Promise<CmsContentDto[]> {
    const entries = await cmsRepository.findAll()
    const loc = normalizeLocale(locale)
    return entries.map((entry) => toCmsContentDto(entry, loc))
  },

  async updateById(id: string, data: CmsUpdateInput): Promise<CmsContentDto> {
    const hasValue = data.value !== undefined
    if (!hasValue && data.label === undefined) {
      throw new BadRequestError('Aucune modification fournie')
    }
    const existing = await cmsRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Contenu CMS introuvable')
    }

    const update: { value?: string; label?: string; translations?: Prisma.InputJsonValue } = {}
    if (data.label !== undefined) update.label = data.label

    if (hasValue) {
      const locale = normalizeLocale(data.locale)
      if (locale && locale !== 'fr') {
        // Écriture dans la langue cible sans toucher à la valeur française.
        const all = { ...((existing.translations ?? {}) as Record<string, { value?: string }>) }
        all[locale] = { ...(all[locale] ?? {}), value: data.value! }
        update.translations = all as Prisma.InputJsonValue
      } else {
        update.value = data.value!
      }
    }

    const updated = await cmsRepository.updateById(id, update)
    return toCmsContentDto(updated)
  },
}
