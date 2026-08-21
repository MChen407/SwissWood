<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import { api, type UserPublicDto } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'

const { t } = useI18n()
const auth = useAuthStore()
const localeStore = useLocaleStore()
const clients = ref<UserPublicDto[]>([])
const loading = ref(true)
const roleTarget = ref<{ client: UserPublicDto; role: UserPublicDto['role'] } | null>(null)
const rolePending = ref(false)
const roleError = ref('')

const canManageRoles = computed(() => auth.profile?.role === 'super_admin')

function roleLabel(role: string) {
  if (role === 'admin') return t('admin.roleAdmin')
  if (role === 'super_admin') return t('admin.roleSuperAdmin')
  return t('admin.roleCustomer')
}

const roleOptions = computed(() => (['customer', 'admin', 'super_admin'] as const).map((value) => ({ value, label: roleLabel(value) })))

onMounted(async () => {
  clients.value = await api.admin.clients()
  loading.value = false
})

function requestRoleChange(client: UserPublicDto, role: UserPublicDto['role']) {
  roleError.value = ''
  roleTarget.value = { client, role }
}

async function confirmRoleChange() {
  const target = roleTarget.value
  if (!target) return
  rolePending.value = true
  roleError.value = ''
  try {
    const updated = await api.admin.updateClientRole(target.client.id, target.role)
    const idx = clients.value.findIndex((c) => c.id === updated.id)
    if (idx >= 0) clients.value[idx] = updated
    roleTarget.value = null
  } catch (err) {
    roleError.value = err instanceof Error ? err.message : t('admin.roleUpdateFailed')
  } finally {
    rolePending.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">{{ t('admin.clientsTitle') }}</h1>
    <p v-if="canManageRoles" class="text-sm text-wood-500 mb-4">{{ t('admin.superAdminHint') }}</p>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">{{ t('common.loading') }}</div>
      <div v-else-if="clients.length === 0" class="p-10 text-center text-wood-400">{{ t('admin.noClients') }}</div>

      <div v-else>
        <!-- Mobile cards -->
        <div class="sm:hidden divide-y divide-wood-100">
          <div v-for="c in clients" :key="c.id" class="p-4 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <p class="font-medium text-primary-500 text-sm break-all">{{ c.first_name }} {{ c.last_name }}</p>
              <div v-if="canManageRoles && c.id !== auth.profile?.id" class="w-32">
                <SearchableSelect size="sm" :model-value="c.role" :disabled="rolePending"
                  :options="[...roleOptions]"
                  @update:model-value="requestRoleChange(c, $event as UserPublicDto['role'])" />
              </div>
              <span v-else class="text-xs px-2 py-1 rounded-full" :class="{
                'bg-primary-100 text-primary-500': c.role === 'admin' || c.role === 'super_admin',
                'bg-wood-100 text-wood-500': c.role === 'customer',
              }">{{ roleLabel(c.role) }}</span>
            </div>
            <div class="flex items-center justify-between gap-2 text-sm">
              <span class="text-wood-500">{{ c.phone || '—' }}</span>
              <span class="text-xs text-wood-400">{{ new Date(c.created_at).toLocaleDateString(localeStore.locale) }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-wood-100 text-wood-500 text-left">
              <tr><th class="px-4 py-3 font-medium">{{ t('admin.nameCol') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.phone') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.role') }}</th><th class="px-4 py-3 font-medium">{{ t('admin.registeredOn') }}</th></tr>
            </thead>
            <tbody class="divide-y divide-wood-100">
              <tr v-for="c in clients" :key="c.id" class="hover:bg-wood-50">
                <td class="px-4 py-3 font-medium text-primary-500">{{ c.first_name }} {{ c.last_name }}</td>
                <td class="px-4 py-3 text-wood-500">{{ c.phone || '—' }}</td>
                <td class="px-4 py-3">
                  <div v-if="canManageRoles && c.id !== auth.profile?.id" class="w-36">
                    <SearchableSelect size="sm" :model-value="c.role" :disabled="rolePending"
                      :options="[...roleOptions]"
                      @update:model-value="requestRoleChange(c, $event as UserPublicDto['role'])" />
                  </div>
                  <span v-else class="text-xs px-2 py-1 rounded-full" :class="{
                    'bg-primary-100 text-primary-500': c.role === 'admin' || c.role === 'super_admin',
                    'bg-wood-100 text-wood-500': c.role === 'customer',
                  }">{{ roleLabel(c.role) }}</span>
                </td>
                <td class="px-4 py-3 text-wood-500">{{ new Date(c.created_at).toLocaleDateString(localeStore.locale) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ConfirmModal
      :open="!!roleTarget"
      variant="confirm"
      :title="t('admin.changeRole')"
      :message="roleError || t('admin.confirmRoleChange', { name: `${roleTarget?.client.first_name} ${roleTarget?.client.last_name}`, role: roleTarget ? roleLabel(roleTarget.role) : '' })"
      :confirm-label="t('common.confirm')"
      :loading="rolePending"
      @confirm="confirmRoleChange"
      @cancel="roleTarget = null; roleError = ''"
    />
  </div>
</template>
