import { cmsRepository } from '../repositories/cms.repository.js'
import { toCmsContentDto, type CmsContentDto } from '../dto/public.dto.js'
import { BadRequestError, NotFoundError } from '../utils/httpErrors.js'

export const cmsService = {
  async getAll(): Promise<CmsContentDto[]> {
    const entries = await cmsRepository.findAll()
    return entries.map(toCmsContentDto)
  },

  async updateById(id: string, data: { value?: string; label?: string }): Promise<CmsContentDto> {
    if (data.value === undefined && data.label === undefined) {
      throw new BadRequestError('Aucune modification fournie')
    }
    const existing = await cmsRepository.findById(id)
    if (!existing) {
      throw new NotFoundError('Contenu CMS introuvable')
    }
    const updated = await cmsRepository.updateById(id, data)
    return toCmsContentDto(updated)
  },
}