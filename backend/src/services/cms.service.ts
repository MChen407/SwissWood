import { cmsRepository } from '@/repositories/cms.repository'
import { toCmsContentDto, type CmsContentDto } from '@/dto/public.dto'

export const cmsService = {
  async getAll(): Promise<CmsContentDto[]> {
    const entries = await cmsRepository.findAll()
    return entries.map(toCmsContentDto)
  },
}