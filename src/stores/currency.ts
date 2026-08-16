import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type Currency = 'EUR' | 'USD' | 'FCFA'

const EUR_TO_USD = 1.08
const EUR_TO_FCFA = 655.957

export function convertEurToUsd(eur: number): number {
  return Math.round(eur * EUR_TO_USD)
}

export function convertEurToFcfa(eur: number): number {
  return Math.round(eur * EUR_TO_FCFA)
}

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>('EUR')
  const symbol = computed(() => currency.value === 'EUR' ? '€' : currency.value === 'USD' ? '$' : 'FCFA')

  function formatPrice(eur: number, usd: number, fcfa: number) {
    if (currency.value === 'EUR') return `${(eur / 100).toFixed(2)} €`
    if (currency.value === 'USD') return `$${(usd / 100).toFixed(2)}`
    return `${(fcfa / 100).toLocaleString('fr-FR')} FCFA`
  }

  function formatEur(eur: number) {
    return formatPrice(eur, convertEurToUsd(eur), convertEurToFcfa(eur))
  }

  function formatPriceWithFallback(eur: number, usd: number, fcfa: number) {
    if (currency.value === 'USD' && !usd) return `${(eur / 100).toFixed(2)} €`
    if (currency.value === 'FCFA' && !fcfa) return `${(eur / 100).toFixed(2)} €`
    return formatPrice(eur, usd, fcfa)
  }

  function setCurrency(c: Currency) { currency.value = c }

  return { currency, symbol, formatPrice, formatEur, formatPriceWithFallback, setCurrency }
}, { persist: true })
