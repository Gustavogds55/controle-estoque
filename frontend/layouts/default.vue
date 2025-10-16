<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">Controle de Estoque</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/produtos" class="text-gray-700 hover:text-gray-900">Produtos</NuxtLink>
            <span class="text-gray-600">{{ authStore.user?.nome }}</span>
            <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
