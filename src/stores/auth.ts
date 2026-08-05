import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, type Profile } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<Profile | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin' || profile.value?.role === 'super_admin')
  const fullName = computed(() => `${profile.value?.first_name ?? ''} ${profile.value?.last_name ?? ''}`.trim())

  async function fetchProfile() {
    if (!user.value) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).maybeSingle()
    if (data) profile.value = data as Profile
  }

  async function init() {
    const { data: { session: s } } = await supabase.auth.getSession()
    session.value = s; user.value = s?.user ?? null
    if (user.value) await fetchProfile()
    loading.value = false

    supabase.auth.onAuthStateChange((_e: string, s: Session | null) => {
      (async () => {
        session.value = s; user.value = s?.user ?? null
        if (user.value) await fetchProfile()
        else profile.value = null
      })()
    })
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { first_name: firstName, last_name: lastName } }
    })
    if (error) throw error
    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null; profile.value = null; session.value = null
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user.value) return
    const { data, error } = await supabase.from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.value.id).select().maybeSingle()
    if (error) throw error
    if (data) profile.value = data as Profile
  }

  return { user, profile, session, loading, isAuthenticated, isAdmin, fullName, init, signUp, signIn, signOut, updateProfile }
})
