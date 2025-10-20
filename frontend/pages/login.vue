<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Senha</label>
          <input 
            v-model="form.senha" 
            type="password" 
            required
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
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
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
