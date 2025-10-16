<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()

await navigateTo(authStore.isAuthenticated ? '/produtos' : '/login', { replace: true })
</script>
