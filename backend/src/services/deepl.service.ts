import { env } from '../config/env.js'
import type { Locale } from '../dto/public.dto.js'

// DeepL cible des langues en majuscules (EN, ES, DE, FR...).
function toDeeplLang(locale: Locale): string {
  return locale.toUpperCase()
}

const DEFAULT_FREE_URL = 'https://api-free.deepl.com'
const DEFAULT_PRO_URL = 'https://api.deepl.com'

export class DeeplNotConfiguredError extends Error {
  constructor() {
    super('La clé DEEPL_API_KEY n\'est pas configurée.')
    this.name = 'DeeplNotConfiguredError'
  }
}

function resolveDeeplBaseUrl(): string {
  const explicit = env.DEEPL_API_URL?.trim()
  // Si une URL est explicitement fournie et différente du défaut free, on l'honore
  if (explicit && explicit !== DEFAULT_FREE_URL) {
    return explicit.replace(/\/$/, '')
  }
  // Sinon on déduit du type de clé : clé Free finit par :fx
  return env.DEEPL_API_KEY?.endsWith(':fx') ? DEFAULT_FREE_URL : DEFAULT_PRO_URL
}

export const deeplService = {
  isConfigured(): boolean {
    return Boolean(env.DEEPL_API_KEY)
  },

  /**
   * Traduit un tableau de textes vers `target` depuis `source` (français par défaut).
   * Les textes vides sont préservés tels quels (non envoyés à l'API).
   * Renvoie un tableau de même longueur que `texts`.
   */
  async translateTexts(texts: string[], target: Locale, source: Locale = 'fr'): Promise<string[]> {
    if (!env.DEEPL_API_KEY) {
      throw new DeeplNotConfiguredError()
    }
    if (texts.length === 0) {
      return []
    }

    const result = [...texts]
    const pending: { index: number; text: string }[] = []
    texts.forEach((text, index) => {
      if (text.trim() !== '') {
        pending.push({ index, text })
      }
    })
    if (pending.length === 0) {
      return result
    }

    const baseUrl = resolveDeeplBaseUrl()
    const body = {
      auth_key: env.DEEPL_API_KEY,
      text: pending.map((p) => p.text),
      target_lang: toDeeplLang(target),
      source_lang: toDeeplLang(source),
    }

    const res = await fetch(`${baseUrl}/v2/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${env.DEEPL_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      let detail = ''
      try {
        const errJson = await res.json()
        detail = errJson.message ?? JSON.stringify(errJson)
      } catch {
        detail = await res.text().catch(() => '')
      }
      throw new Error(`DeepL (${res.status}) : ${detail || res.statusText}`)
    }

    const data = (await res.json()) as { translations?: { text: string }[] }
    const translated = data.translations ?? []
    if (translated.length !== pending.length) {
      throw new Error('Réponse DeepL inattendue : nombre de traductions incorrect.')
    }

    pending.forEach((p, i) => {
      result[p.index] = translated[i]?.text ?? p.text
    })
    return result
  },
}