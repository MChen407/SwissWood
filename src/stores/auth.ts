import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/api'
import type { UserPublicDto, UpdateProfileInput } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserPublicDto | null>(null)
  const profile = ref<UserPublicDto | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin' || profile.value?.role === 'super_admin')
  const fullName = computed(() => `${profile.value?.first_name ?? ''} ${profile.value?.last_name ?? ''}`.trim())

  async function init() {
    if (!getAccessToken()) {
      loading.value = false
      return
    }
    try {
      const me = await api.auth.me()
      user.value = me
      profile.value = me
    } catch {
      clearTokens()
      user.value = null
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    const result = await api.auth.register({ email, password, firstName, lastName })
    setTokens(result.tokens.accessToken, result.tokens.refreshToken)
    user.value = result.user
    profile.value = result.user
    return result
  }

  async function signIn(email: string, password: string) {
    const result = await api.auth.login({ email, password })
    setTokens(result.tokens.accessToken, result.tokens.refreshToken)
    user.value = result.user
    profile.value = result.user
    return result
  }

  async function signOut() {
    await api.auth.logout(getRefreshToken() ?? undefined)
    clearTokens()
    user.value = null
    profile.value = null
  }

  async function updateProfile(updates: UpdateProfileInput) {
    const updated = await api.auth.updateProfile(updates)
    user.value = updated
    profile.value = updated
    return updated
  }

  return { user, profile, loading, isAuthenticated, isAdmin, fullName, init, signUp, signIn, signOut, updateProfile }
})
