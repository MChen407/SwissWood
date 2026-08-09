import { contactRepository } from '../repositories/contact.repository.js'
import type { ContactMessageDto } from '../validators/contact.validator.js'

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