import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/lib/supabase'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.product.price_eur * i.quantity, 0))

  function addItem(product: Product, quantity = 1, unit = 'pcs', customization: Record<string, string | number> = {}) {
    const key = JSON.stringify(customization)
    const existing = items.value.find(i => i.product.id === product.id && i.unit === unit && JSON.stringify(i.customization) === key)
    if (existing) existing.quantity += quantity
    else items.value.push({ product, quantity, unit, customization })
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQuantity(productId: string, qty: number) {
    const item = items.value.find(i => i.product.id === productId)
    if (!item) return
    if (qty <= 0) removeItem(productId)
    else item.quantity = qty
  }

  function clear() { items.value = [] }
  function toggleCart() { isOpen.value = !isOpen.value }

  return { items, isOpen, itemCount, subtotal, addItem, removeItem, updateQuantity, clear, toggleCart }
}, { persist: true })
