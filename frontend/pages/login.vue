<template>
  <div class="min-h-screen flex items-center justify-center" :class="darkMode ? 'bg-gray-900' : 'bg-purple-50'">
    <div class="p-8 rounded-lg shadow-lg w-96 border-t-4 border-purple-400" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-center mb-6">
        <div class="bg-purple-600 p-3 rounded-lg">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-bold mb-6 text-center" :class="darkMode ? 'text-purple-400' : 'text-black'">Controle de Estoque</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"
          />
        </div>
        
        <div class="mb-6">
          <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Senha</label>
          <input 
            v-model="form.senha" 
            type="password" 
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"
          />
        </div>

        <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { darkMode, initDarkMode } = useDarkMode()
const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const form = ref({ email: '', senha: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: form.value
    })
    
    authStore.setAuth(response.user, response.token)
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Email ou senha inválidos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initDarkMode()
})
</script>
