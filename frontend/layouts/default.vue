<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-gray-800">Controle de Estoque</h1>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/dashboard" class="flex items-center p-3 rounded hover:bg-gray-100" active-class="bg-blue-50 text-blue-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/produtos" class="flex items-center p-3 rounded hover:bg-gray-100" active-class="bg-blue-50 text-blue-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Produtos
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/lotes" class="flex items-center p-3 rounded hover:bg-gray-100" active-class="bg-blue-50 text-blue-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Lotes
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/entradas" class="flex items-center p-3 rounded hover:bg-gray-100" active-class="bg-blue-50 text-blue-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Entradas
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/saidas" class="flex items-center p-3 rounded hover:bg-gray-100" active-class="bg-blue-50 text-blue-600">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Saídas
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6">
        <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">{{ authStore.user?.nome }}</span>
          <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Sair
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/produtos': 'Produtos',
    '/lotes': 'Lotes',
    '/entradas': 'Entradas',
    '/saidas': 'Saídas'
  }
  return titles[route.path] || 'Controle de Estoque'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
