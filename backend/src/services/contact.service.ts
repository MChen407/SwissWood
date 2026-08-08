import { contactRepository } from '@/repositories/contact.repository'
import type { ContactMessageDto } from '@/validators/contact.validator'

export const contactService = {
  async send(data: ContactMessageDto) {
    const message = await contactRepository.create({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    })
    return {
      id: message.id,
      status: message.status,
      created_at: message.createdAt,
    }
  },
}