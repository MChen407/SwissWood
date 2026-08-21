import { createI18n } from 'vue-i18n'
import fr from './locales/fr'
import en from './locales/en'
import es from './locales/es'
import de from './locales/de'

export type Locale = 'fr' | 'en' | 'es' | 'de'

export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en', 'es', 'de']

const savedLocale = (localStorage.getItem('swisswood_locale') as Locale) || 'fr'

const i18n = createI18n({
  legacy: false,
  locale: SUPPORTED_LOCALES.includes(savedLocale) ? savedLocale : 'fr',
  fallbackLocale: 'fr',
  messages: { fr, en, es, de },
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('swisswood_locale', locale)
  document.documentElement.lang = locale
}

export default i18n