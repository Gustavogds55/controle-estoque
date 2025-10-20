export default defineNuxtPlugin(() => {
  // Limpar autenticação ao iniciar
  if (process.client) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})
