import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type Currency = 'EUR' | 'USD'

const EUR_TO_USD = 1.08

export function convertEurToUsd(eur: number): number {
  return Math.round(eur * EUR_TO_USD)
}

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>('EUR')
  const symbol = computed(() => currency.value === 'EUR' ? '€' : '$')

  function formatPrice(eur: number, usd: number, _fcfa: number) {
    if (currency.value === 'EUR') return `${(eur / 100).toFixed(2)} €`
    return `$${(usd / 100).toFixed(2)}`
  }

  function formatEur(eur: number) {
    return formatPrice(eur, convertEurToUsd(eur), 0)
  }

  function formatPriceWithFallback(eur: number, usd: number, _fcfa: number) {
    if (currency.value === 'USD' && !usd) return `${(eur / 100).toFixed(2)} €`
    return formatPrice(eur, usd, _fcfa)
  }

  function setCurrency(c: Currency) { currency.value = c }

  return { currency, symbol, formatPrice, formatEur, formatPriceWithFallback, setCurrency }
}, { persist: true })
