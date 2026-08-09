import { statsRepository } from '../repositories/stats.repository.js'
import { orderRepository } from '../repositories/order.repository.js'
import { paymentRepository } from '../repositories/payment.repository.js'
import { toOrderDto } from '../dto/order.dto.js'
import type { Role } from '../constants/index.js'
import { userRepository } from '../repositories/user.repository.js'
import { NotFoundError } from '../utils/httpErrors.js'
import { toUserPublicDto } from '../dto/auth.dto.js'

export const adminService = {
  async stats() {
    const [revenue, orderCount, customerCount, productCount, recentOrders] = await Promise.all([
      statsRepository.revenuePaid(),
      statsRepository.countOrders(),
      statsRepository.countCustomers(),
      statsRepository.countActiveProducts(),
      orderRepository.listAll({ take: 6 }),
    ])

    return {
      revenue,
      orders: orderCount,
      customers: customerCount,
      products: productCount,
      recent_orders: recentOrders.map(toOrderDto),
    }
  },

  async listPayments() {
    const payments = await paymentRepository.listAll()
    return payments.map((payment) => ({
      id: payment.id,
      order_id: payment.orderId,
      method: payment.method,
      status: payment.status,
      amount_eur: payment.amountEur,
      reference: payment.reference,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
      order_number: payment.order.orderNumber,
    }))
  },

  async listClients() {
    const users = await userRepository.list()
    return users.map(toUserPublicDto)
  },

  async updateRole(id: string, role: Role) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable')
    }
    return toUserPublicDto(await userRepository.update(id, { role }))
  },
}