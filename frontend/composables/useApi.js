export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = async (url, options = {}) => {
    const token = authStore.token
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await $fetch(`${config.public.apiBase}${url}`, {
        ...options,
        headers
      })
      return response
    } catch (error) {
      if (error.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
      throw error
    }
  }

  return { api: apiFetch }
}
