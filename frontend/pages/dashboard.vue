<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Card Produtos -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total de Produtos</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalProdutos }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Card Lotes -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total de Lotes</p>
            <p class="text-3xl font-bold text-gray-800">{{ stats.totalLotes }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Card Alertas -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Alertas de Validade</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.alertas }}</p>
          </div>
          <div class="bg-red-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações Rápidas -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink to="/produtos" class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
          <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <div>
            <p class="font-semibold text-gray-800">Gerenciar Produtos</p>
            <p class="text-sm text-gray-500">Adicionar, editar ou remover produtos</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/lotes" class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition">
          <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <div>
            <p class="font-semibold text-gray-800">Gerenciar Lotes</p>
            <p class="text-sm text-gray-500">Controlar lotes e validades</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { api } = useApi()

const stats = ref({
  totalProdutos: 0,
  totalLotes: 0,
  alertas: 0
})

const carregarStats = async () => {
  try {
    const [produtos, lotes] = await Promise.all([
      api('/produtos'),
      api('/lotes')
    ])
    
    stats.value.totalProdutos = produtos.length
    stats.value.totalLotes = lotes.length
    
    // Calcular alertas (lotes vencendo em 30 dias)
    const hoje = new Date()
    const trintaDias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    stats.value.alertas = lotes.filter(lote => {
      const dataValidade = new Date(lote.data_validade)
      return dataValidade <= trintaDias
    }).length
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

onMounted(() => {
  carregarStats()
})
</script>
