<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="mb-6">
        <h2 class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Gerenciamento de Lotes</h2>
        <p class="text-sm mt-2" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Para cadastrar novos lotes, utilize a aba "Entradas"</p>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="lotes.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhum lote cadastrado
      </div>

      <table v-else class="w-full">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Produto</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Número Lote</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Qtd Atual</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Data Entrada</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Validade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="lote in lotes" :key="lote.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ lote.produto_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ lote.numero_lote }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ lote.quantidade_atual }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ formatarData(lote.data_entrada) }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ formatarData(lote.data_validade) }}</td>
            <td class="px-4 py-3">
              <span :class="getStatusClass(lote.data_validade)" class="px-2 py-1 rounded text-xs font-semibold">
                {{ getStatusTexto(lote.data_validade) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="editarLote(lote)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" :class="darkMode ? 'hover:bg-blue-900/20' : ''" title="Editar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="deletarLote(lote.id)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" :class="darkMode ? 'hover:bg-red-900/20' : ''" title="Excluir">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" @click="fecharModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div @click.stop class="rounded-lg p-6 w-full max-w-4xl" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">{{ loteEditando ? 'Editar Lote' : 'Novo Lote' }}</h3>
        
        <form @submit.prevent="salvarLote">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Produto</label>
            <select v-model="form.produto_id" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''">
              <option value="">Selecione um produto</option>
              <option v-for="produto in produtos" :key="produto.id" :value="produto.id">
                {{ produto.nome }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Número do Lote</label>
            <input v-model="form.numero_lote" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">{{ loteEditando ? 'Quantidade Inicial' : 'Quantidade' }}</label>
            <input v-model="form.quantidade_inicial" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div v-if="loteEditando" class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Quantidade Atual</label>
            <input v-model="form.quantidade_atual" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Data de Entrada</label>
            <input v-model="form.data_entrada" type="date" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Data de Validade</label>
            <input v-model="form.data_validade" type="date" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
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
    data_entrada: lote.data_entrada.split('T')[0],
    data_validade: lote.data_validade.split('T')[0]
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
      const { quantidade_atual, ...dadosLote } = form.value
      await api('/lotes', {
        method: 'POST',
        body: dadosLote
      })
    }
    fecharModal()
    await carregarLotes()
  } catch (error) {
    console.error('Erro completo:', error)
    const mensagem = error.data?.error || error.message || 'Erro ao salvar lote'
    alert(mensagem)
  }
}

const deletarLote = async (id) => {
  if (!confirm('Deseja realmente excluir este lote?')) return
  
  try {
    await api(`/lotes/${id}`, { method: 'DELETE' })
    await carregarLotes()
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
