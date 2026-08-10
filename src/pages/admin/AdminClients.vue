<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { api, type UserPublicDto } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const clients = ref<UserPublicDto[]>([])
const loading = ref(true)
const roleTarget = ref<{ client: UserPublicDto; role: UserPublicDto['role'] } | null>(null)
const rolePending = ref(false)
const roleError = ref('')

const canManageRoles = computed(() => auth.profile?.role === 'super_admin')

const roleLabels: Record<string, string> = { customer: 'Client', admin: 'Admin', super_admin: 'Super Admin' }

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
    roleError.value = err instanceof Error ? err.message : 'Échec de la mise à jour du rôle'
  } finally {
    rolePending.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="font-display text-2xl font-medium text-primary-500 mb-6">Gestion des clients</h1>
    <p v-if="canManageRoles" class="text-sm text-wood-500 mb-4">En tant que super admin, vous pouvez attribuer les rôles administrateur pour la gestion des produits.</p>
    <div class="bg-white rounded-xl border border-wood-200 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-wood-400">Chargement...</div>
      <div v-else-if="clients.length === 0" class="p-10 text-center text-wood-400">Aucun client</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-wood-100 text-wood-500 text-left">
          <tr><th class="px-4 py-3 font-medium">Nom</th><th class="px-4 py-3 font-medium">Téléphone</th><th class="px-4 py-3 font-medium">Rôle</th><th class="px-4 py-3 font-medium">Inscrit le</th></tr>
        </thead>
        <tbody class="divide-y divide-wood-100">
          <tr v-for="c in clients" :key="c.id" class="hover:bg-wood-50">
            <td class="px-4 py-3 font-medium text-primary-500">{{ c.first_name }} {{ c.last_name }}</td>
            <td class="px-4 py-3 text-wood-500">{{ c.phone || '—' }}</td>
            <td class="px-4 py-3">
              <select v-if="canManageRoles && c.id !== auth.profile?.id"
                :value="c.role"
                :disabled="rolePending"
                @change="requestRoleChange(c, ($event.target as HTMLSelectElement).value as UserPublicDto['role'])"
                class="text-xs px-2 py-1 rounded-lg border border-wood-200 bg-white focus:outline-none focus:border-primary-500 disabled:opacity-50">
                <option value="customer">Client</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <span v-else class="text-xs px-2 py-1 rounded-full capitalize" :class="{
                'bg-primary-100 text-primary-500': c.role === 'admin' || c.role === 'super_admin',
                'bg-wood-100 text-wood-500': c.role === 'customer',
              }">{{ roleLabels[c.role] || c.role }}</span>
            </td>
            <td class="px-4 py-3 text-wood-500">{{ new Date(c.created_at).toLocaleDateString('fr-FR') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      :open="!!roleTarget"
      variant="confirm"
      title="Changer le rôle"
      :message="roleError || `Confirmer le changement de rôle de « ${roleTarget?.client.first_name} ${roleTarget?.client.last_name} » vers « ${roleTarget ? roleLabels[roleTarget.role] : ''} » ?`"
      confirm-label="Confirmer"
      :loading="rolePending"
      @confirm="confirmRoleChange"
      @cancel="roleTarget = null; roleError = ''"
    />
  </div>
</template>