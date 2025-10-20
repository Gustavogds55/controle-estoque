<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Saídas de Estoque</h2>
        <button @click="abrirModal()" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          + Nova Saída
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="saidas.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma saída registrada
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
          <tr v-for="saida in saidas" :key="saida.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ formatarDataHora(saida.data_movimentacao) }}</td>
            <td class="px-4 py-3">{{ saida.produto_nome }}</td>
            <td class="px-4 py-3">{{ saida.numero_lote }}</td>
            <td class="px-4 py-3 text-red-600 font-semibold">-{{ saida.quantidade }}</td>
            <td class="px-4 py-3">{{ saida.usuario_nome }}</td>
            <td class="px-4 py-3">{{ saida.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deletar(saida.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Nova Saída</h3>
        
        <form @submit.prevent="salvar">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Lote</label>
            <select v-model="form.lote_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Selecione um lote</option>
              <option v-for="lote in lotes" :key="lote.id" :value="lote.id">
                {{ lote.produto_nome }} - {{ lote.numero_lote }} (Estoque: {{ lote.quantidade_atual }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Quantidade</label>
            <input v-model="form.quantidade" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Data e Hora</label>
            <input v-model="form.data_movimentacao" type="datetime-local" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Observação</label>
            <textarea v-model="form.observacao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Salvar</button>
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
    fecharModal()
    await carregar()
  } catch (error) {
    console.error('Erro ao salvar saída:', error)
    alert(error.data?.error || 'Erro ao salvar saída')
  }
}

const deletar = async (id) => {
  if (!confirm('Deseja realmente excluir esta saída? O estoque será revertido.')) return
  
  try {
    await api(`/movimentacoes/${id}`, { method: 'DELETE' })
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
