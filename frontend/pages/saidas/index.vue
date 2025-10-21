<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Saídas de Estoque</h2>
        <button @click="abrirModal()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          + Nova Saída
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="saidas.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhuma saída registrada
      </div>

      <table v-else class="w-full">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Data</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Produto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Lote</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Quantidade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Usuário</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Observação</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="saida in saidas" :key="saida.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ formatarDataHora(saida.data_movimentacao) }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ saida.produto_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ saida.numero_lote }}</td>
            <td class="px-4 py-3 text-red-600 font-semibold">-{{ saida.quantidade }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ saida.usuario_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ saida.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deletar(saida.id)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" :class="darkMode ? 'hover:bg-red-900/20' : ''" title="Excluir">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" @click="fecharModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div @click.stop class="rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">Nova Saída</h3>
        
        <form @submit.prevent="salvar">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Lote</label>
            <select v-model="form.lote_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''">
              <option value="">Selecione um lote</option>
              <option v-for="lote in lotes" :key="lote.id" :value="lote.id">
                {{ lote.produto_nome }} - {{ lote.numero_lote }} (Estoque: {{ lote.quantidade_atual }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Quantidade</label>
            <input v-model="form.quantidade" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Data e Hora</label>
            <input v-model="form.data_movimentacao" type="datetime-local" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Observação</label>
            <textarea v-model="form.observacao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
            <button type="submit" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Salvar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="fixed top-4 right-4 z-50 animate-fade-in">
      <div :class="getToastClasses(toast.type)" class="px-8 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[320px]">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToastIcon(toast.type)"/>
        </svg>
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { api } = useApi()
const { darkMode } = useDarkMode()
const { toast, showToast, getToastClasses, getToastIcon } = useToast()

const saidas = ref([])
const lotes = ref([])
const loading = ref(true)
const mostrarModal = ref(false)

const form = ref({
  lote_id: '',
  quantidade: '',
  data_movimentacao: '',
  observacao: ''
})

const carregar = async () => {
  loading.value = true
  try {
    saidas.value = await api('/movimentacoes?tipo=SAIDA')
  } catch (error) {
    console.error('Erro ao carregar saídas:', error)
  } finally {
    loading.value = false
  }
}

const carregarLotes = async () => {
  try {
    lotes.value = await api('/lotes')
  } catch (error) {
    console.error('Erro ao carregar lotes:', error)
  }
}

const abrirModal = () => {
  const agora = new Date()
  const dataHoraLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  
  form.value = {
    lote_id: '',
    quantidade: '',
    data_movimentacao: dataHoraLocal,
    observacao: ''
  }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

const salvar = async () => {
  try {
    await api('/movimentacoes', {
      method: 'POST',
      body: {
        ...form.value,
        tipo: 'SAIDA'
      }
    })
    showToast('Saída cadastrada com sucesso')
    fecharModal()
    await carregar()
  } catch (error) {
    console.error('Erro ao salvar saída:', error)
    alert(error.data?.error || 'Erro ao salvar saída')
  }
}

const deletar = async (id) => {
  try {
    await api(`/movimentacoes/${id}`, { method: 'DELETE' })
    showToast('Saída excluída com sucesso')
    await carregar()
  } catch (error) {
    console.error('Erro ao deletar saída:', error)
    alert(error.data?.error || 'Erro ao deletar saída')
  }
}

const formatarDataHora = (data) => {
  return new Date(data).toLocaleString('pt-BR')
}

onMounted(() => {
  carregar()
  carregarLotes()
})
</script>
