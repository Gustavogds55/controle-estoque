<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

await navigateTo(authStore.isAuthenticated ? '/dashboard' : '/login', { replace: true })
</script>
