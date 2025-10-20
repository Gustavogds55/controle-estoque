<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Movimentações de Estoque</h2>
        <button @click="abrirModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Nova Movimentação
        </button>
      </div>

      <div class="mb-4 flex gap-4">
        <select v-model="filtroTipo" @change="carregarMovimentacoes" class="px-3 py-2 border rounded">
          <option value="">Todos os tipos</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="movimentacoes.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma movimentação registrada
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lote</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantidade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuário</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Observação</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="mov in movimentacoes" :key="mov.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ formatarDataHora(mov.data_movimentacao) }}</td>
            <td class="px-4 py-3">
              <span :class="mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                    class="px-2 py-1 rounded text-xs font-semibold">
                {{ mov.tipo }}
              </span>
            </td>
            <td class="px-4 py-3">{{ mov.produto_nome }}</td>
            <td class="px-4 py-3">{{ mov.numero_lote }}</td>
            <td class="px-4 py-3">{{ mov.quantidade }}</td>
            <td class="px-4 py-3">{{ mov.usuario_nome }}</td>
            <td class="px-4 py-3">{{ mov.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <button @click="deletarMovimentacao(mov.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Nova Movimentação</h3>
        
        <form @submit.prevent="salvarMovimentacao">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Tipo</label>
            <select v-model="form.tipo" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Lote</label>
            <select v-model="form.lote_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um lote</option>
              <option v-for="lote in lotes" :key="lote.id" :value="lote.id">
                {{ lote.produto_nome }} - {{ lote.numero_lote }} (Estoque: {{ lote.quantidade_atual }})
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Quantidade</label>
            <input v-model="form.quantidade" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Data e Hora</label>
            <input v-model="form.data_movimentacao" type="datetime-local" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Observação</label>
            <textarea v-model="form.observacao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
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

const movimentacoes = ref([])
const lotes = ref([])
const loading = ref(true)
const mostrarModal = ref(false)
const filtroTipo = ref('')

const form = ref({
  lote_id: '',
  tipo: '',
  quantidade: '',
  data_movimentacao: '',
  observacao: ''
})

const carregarMovimentacoes = async () => {
  loading.value = true
  try {
    const params = filtroTipo.value ? `?tipo=${filtroTipo.value}` : ''
    movimentacoes.value = await api(`/movimentacoes${params}`)
  } catch (error) {
    console.error('Erro ao carregar movimentações:', error)
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
    tipo: '',
    quantidade: '',
    data_movimentacao: dataHoraLocal,
    observacao: ''
  }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

const salvarMovimentacao = async () => {
  try {
    await api('/movimentacoes', {
      method: 'POST',
      body: form.value
    })
    fecharModal()
    carregarMovimentacoes()
  } catch (error) {
    console.error('Erro ao salvar movimentação:', error)
    alert(error.data?.error || 'Erro ao salvar movimentação')
  }
}

const deletarMovimentacao = async (id) => {
  if (!confirm('Deseja realmente excluir esta movimentação? O estoque será revertido.')) return
  
  try {
    await api(`/movimentacoes/${id}`, { method: 'DELETE' })
    carregarMovimentacoes()
  } catch (error) {
    console.error('Erro ao deletar movimentação:', error)
    alert(error.data?.error || 'Erro ao deletar movimentação')
  }
}

const formatarDataHora = (data) => {
  return new Date(data).toLocaleString('pt-BR')
}

onMounted(() => {
  carregarMovimentacoes()
  carregarLotes()
})
</script>
