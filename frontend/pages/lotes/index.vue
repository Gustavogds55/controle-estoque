<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gerenciamento de Lotes</h2>
        <button @click="abrirModal()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Novo Lote
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="lotes.length === 0" class="text-center py-8 text-gray-500">
        Nenhum lote cadastrado
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Número Lote</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qtd Atual</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Entrada</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Validade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="lote in lotes" :key="lote.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ lote.produto_nome }}</td>
            <td class="px-4 py-3">{{ lote.numero_lote }}</td>
            <td class="px-4 py-3">{{ lote.quantidade_atual }}</td>
            <td class="px-4 py-3">{{ formatarData(lote.data_entrada) }}</td>
            <td class="px-4 py-3">{{ formatarData(lote.data_validade) }}</td>
            <td class="px-4 py-3">
              <span :class="getStatusClass(lote.data_validade)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ getStatusTexto(lote.data_validade) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button @click="editarLote(lote)" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
              <button @click="deletarLote(lote.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">{{ loteEditando ? 'Editar Lote' : 'Novo Lote' }}</h3>
        
        <form @submit.prevent="salvarLote">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Produto</label>
            <select v-model="form.produto_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione um produto</option>
              <option v-for="produto in produtos" :key="produto.id" :value="produto.id">
                {{ produto.nome }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Número do Lote</label>
            <input v-model="form.numero_lote" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Quantidade Inicial</label>
            <input v-model="form.quantidade_inicial" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Quantidade Atual</label>
            <input v-model="form.quantidade_atual" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Data de Entrada</label>
            <input v-model="form.data_entrada" type="date" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Data de Validade</label>
            <input v-model="form.data_validade" type="date" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

const lotes = ref([])
const produtos = ref([])
const loading = ref(true)
const mostrarModal = ref(false)
const loteEditando = ref(null)

const form = ref({
  produto_id: '',
  numero_lote: '',
  quantidade_inicial: '',
  quantidade_atual: '',
  data_entrada: '',
  data_validade: ''
})

const carregarLotes = async () => {
  loading.value = true
  try {
    lotes.value = await api('/lotes')
  } catch (error) {
    console.error('Erro ao carregar lotes:', error)
  } finally {
    loading.value = false
  }
}

const carregarProdutos = async () => {
  try {
    produtos.value = await api('/produtos')
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
  }
}

const abrirModal = () => {
  loteEditando.value = null
  form.value = {
    produto_id: '',
    numero_lote: '',
    quantidade_inicial: '',
    quantidade_atual: '',
    data_entrada: '',
    data_validade: ''
  }
  mostrarModal.value = true
}

const editarLote = (lote) => {
  loteEditando.value = lote
  form.value = {
    produto_id: lote.produto_id,
    numero_lote: lote.numero_lote,
    quantidade_inicial: lote.quantidade_inicial,
    quantidade_atual: lote.quantidade_atual,
    data_entrada: lote.data_entrada,
    data_validade: lote.data_validade
  }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
  loteEditando.value = null
}

const salvarLote = async () => {
  try {
    if (loteEditando.value) {
      await api(`/lotes/${loteEditando.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await api('/lotes', {
        method: 'POST',
        body: form.value
      })
    }
    fecharModal()
    carregarLotes()
  } catch (error) {
    console.error('Erro ao salvar lote:', error)
    alert('Erro ao salvar lote')
  }
}

const deletarLote = async (id) => {
  if (!confirm('Deseja realmente excluir este lote?')) return
  
  try {
    await api(`/lotes/${id}`, { method: 'DELETE' })
    carregarLotes()
  } catch (error) {
    console.error('Erro ao deletar lote:', error)
    alert('Erro ao deletar lote')
  }
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getStatusTexto = (dataValidade) => {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  const diasRestantes = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24))
  
  if (diasRestantes < 0) return 'Vencido'
  if (diasRestantes <= 30) return 'Próximo ao vencimento'
  return 'Válido'
}

const getStatusClass = (dataValidade) => {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  const diasRestantes = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24))
  
  if (diasRestantes < 0) return 'bg-red-100 text-red-800'
  if (diasRestantes <= 30) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

onMounted(() => {
  carregarLotes()
  carregarProdutos()
})
</script>
