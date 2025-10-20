<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Entradas de Estoque</h2>
        <button @click="abrirModal()" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Nova Entrada
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="entradas.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma entrada registrada
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lote</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantidade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuário</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Observação</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="entrada in entradas" :key="entrada.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ formatarDataHora(entrada.data_movimentacao) }}</td>
            <td class="px-4 py-3">{{ entrada.produto_nome }}</td>
            <td class="px-4 py-3">{{ entrada.numero_lote }}</td>
            <td class="px-4 py-3 text-green-600 font-semibold">+{{ entrada.quantidade }}</td>
            <td class="px-4 py-3">{{ entrada.usuario_nome }}</td>
            <td class="px-4 py-3">{{ entrada.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deletar(entrada.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Nova Entrada</h3>
        
        <form @submit.prevent="salvar">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Lote</label>
            <select v-model="form.lote_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Selecione um lote</option>
              <option v-for="lote in lotes" :key="lote.id" :value="lote.id">
                {{ lote.produto_nome }} - {{ lote.numero_lote }} (Estoque: {{ lote.quantidade_atual }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Quantidade</label>
            <input v-model="form.quantidade" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Data e Hora</label>
            <input v-model="form.data_movimentacao" type="datetime-local" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Observação</label>
            <textarea v-model="form.observacao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Salvar</button>
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
