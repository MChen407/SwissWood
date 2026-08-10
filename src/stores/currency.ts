import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type Currency = 'EUR' | 'USD' | 'FCFA'

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>('EUR')
  const symbol = computed(() => currency.value === 'EUR' ? '€' : currency.value === 'USD' ? '$' : 'FCFA')

  function formatPrice(eur: number, usd: number, fcfa: number) {
    if (currency.value === 'EUR') return `${(eur / 100).toFixed(2)} €`
    if (currency.value === 'USD') return `$${(usd / 100).toFixed(2)}`
    return `${(fcfa / 100).toLocaleString('fr-FR')} FCFA`
  }

  function formatPriceWithFallback(eur: number, usd: number, fcfa: number) {
    if (currency.value === 'USD' && !usd) return `${(eur / 100).toFixed(2)} €`
    if (currency.value === 'FCFA' && !fcfa) return `${(eur / 100).toFixed(2)} €`
    return formatPrice(eur, usd, fcfa)
  }

  function setCurrency(c: Currency) { currency.value = c }

  return { currency, symbol, formatPrice, formatPriceWithFallback, setCurrency }
}, { persist: true })
