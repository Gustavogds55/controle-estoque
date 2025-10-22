<template>
  <div class="min-h-screen flex" :class="darkMode ? 'bg-gray-900' : 'bg-purple-50'">
    <!-- Sidebar -->
    <aside class="w-64 shadow-lg" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="p-4 border-b" :class="darkMode ? 'border-gray-700' : 'border-purple-200'">
        <div class="flex items-center space-x-3">
          <div class="bg-purple-600 p-2 rounded-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Controle de</h1>
            <h1 class="text-lg font-bold -mt-1" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Estoque</h1>
          </div>
        </div>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/dashboard" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/entradas" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Entradas
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/saidas" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Saídas
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/lotes" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Lotes
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/fornecedores" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Fornecedores
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/produtos" class="flex items-center p-3 rounded" :class="darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-purple-50'" active-class="bg-purple-600 text-white">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Produtos
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="shadow-sm h-16 flex items-center justify-between px-6 border-b-2" :class="darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'">
        <h2 class="text-lg font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">{{ pageTitle }}</h2>
        <div class="flex items-center space-x-4">
          <button @click="toggleDarkMode" data-testid="theme-toggle" class="p-2 rounded-lg" :class="darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'">
            <svg v-if="darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <span data-testid="user-name" class="font-medium" :class="darkMode ? 'text-gray-300' : 'text-purple-600'">{{ authStore.user?.nome }}</span>
          <button @click="handleLogout" data-testid="logout-button" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
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

const { darkMode, toggleDarkMode, initDarkMode } = useDarkMode()

onMounted(() => {
  initDarkMode()
})

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/entradas': 'Entradas',
    '/saidas': 'Saídas',
    '/lotes': 'Lotes',
    '/fornecedores': 'Fornecedores',
    '/produtos': 'Produtos'
  }
  return titles[route.path] || 'Controle de Estoque'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
