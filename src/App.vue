<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import CartDrawer from '@/components/cart/CartDrawer.vue'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <RouterView />
  <CartDrawer />
</template>
