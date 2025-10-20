<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Entradas de Estoque</h2>
        <button @click="abrirModal()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          + Nova Entrada
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="entradas.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhuma entrada registrada
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
          <tr v-for="entrada in entradas" :key="entrada.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ formatarDataHora(entrada.data_movimentacao) }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.produto_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.numero_lote }}</td>
            <td class="px-4 py-3 text-green-600 font-semibold">+{{ entrada.quantidade }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.usuario_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deletar(entrada.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="rounded-lg p-6 w-full max-w-md" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">Nova Entrada</h3>
        
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
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { api } = useApi()
const { darkMode } = useDarkMode()

const entradas = ref([])
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
    entradas.value = await api('/movimentacoes?tipo=ENTRADA')
  } catch (error) {
    console.error('Erro ao carregar entradas:', error)
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
        tipo: 'ENTRADA'
      }
    })
    fecharModal()
    await carregar()
  } catch (error) {
    console.error('Erro ao salvar entrada:', error)
    alert(error.data?.error || 'Erro ao salvar entrada')
  }
}

const deletar = async (id) => {
  if (!confirm('Deseja realmente excluir esta entrada? O estoque será revertido.')) return
  
  try {
    await api(`/movimentacoes/${id}`, { method: 'DELETE' })
    await carregar()
  } catch (error) {
    console.error('Erro ao deletar entrada:', error)
    alert(error.data?.error || 'Erro ao deletar entrada')
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
