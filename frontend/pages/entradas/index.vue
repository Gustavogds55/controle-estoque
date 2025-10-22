<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-between items-center mb-6">
        <h2 data-testid="page-title" class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Entrada de Mercadorias</h2>
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
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Fornecedor</th>
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
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.fornecedor_nome || '-' }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.usuario_nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ entrada.observacao || '-' }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="editar(entrada)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" :class="darkMode ? 'hover:bg-blue-900/20' : ''" title="Editar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="deletar(entrada.id)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" :class="darkMode ? 'hover:bg-red-900/20' : ''" title="Excluir">
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
      <div @click.stop class="rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">{{ entradaEditando ? 'Editar Entrada' : 'Nova Entrada' }}</h3>
        
        <form @submit.prevent="salvar">
          <!-- Dados do Produto -->
          <div v-if="!entradaEditando" class="mb-6 p-4 border rounded" :class="darkMode ? 'border-gray-600' : 'border-gray-300'">
            <h4 class="font-semibold mb-3" :class="darkMode ? 'text-purple-300' : 'text-gray-700'">1. Produto</h4>
            
            <div class="mb-3">
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Nome do Produto *</label>
              <input v-model="form.produto_nome" data-testid="produto-nome" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.produto_nome ? 'border-red-500' : '']" />
              <p v-if="errors.produto_nome" data-testid="error-produto-nome" class="text-red-500 text-sm mt-1">{{ errors.produto_nome }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Categoria</label>
                <input v-model="form.produto_categoria" data-testid="produto-categoria" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
              </div>
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Unidade de Medida *</label>
                <input v-model="form.produto_unidade" data-testid="produto-unidade" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.produto_unidade ? 'border-red-500' : '']" />
                <p v-if="errors.produto_unidade" data-testid="error-produto-unidade" class="text-red-500 text-sm mt-1">{{ errors.produto_unidade }}</p>
              </div>
            </div>
          </div>

          <!-- Dados do Lote -->
          <div v-if="!entradaEditando" class="mb-6 p-4 border rounded" :class="darkMode ? 'border-gray-600' : 'border-gray-300'">
            <h4 class="font-semibold mb-3" :class="darkMode ? 'text-purple-300' : 'text-gray-700'">2. Lote</h4>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Número do Lote *</label>
                <input v-model="form.numero_lote" data-testid="numero-lote" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.numero_lote ? 'border-red-500' : '']" />
                <p v-if="errors.numero_lote" data-testid="error-numero-lote" class="text-red-500 text-sm mt-1">{{ errors.numero_lote }}</p>
              </div>
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Data de Validade *</label>
                <input v-model="form.data_validade" data-testid="data-validade" type="date" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.data_validade ? 'border-red-500' : '']" />
                <p v-if="errors.data_validade" data-testid="error-data-validade" class="text-red-500 text-sm mt-1">{{ errors.data_validade }}</p>
              </div>
            </div>
          </div>

          <!-- Dados da Entrada -->
          <div class="mb-4 p-4 border rounded" :class="darkMode ? 'border-gray-600' : 'border-gray-300'">
            <h4 class="font-semibold mb-3" :class="darkMode ? 'text-purple-300' : 'text-gray-700'">{{ entradaEditando ? 'Entrada' : '3. Entrada' }}</h4>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div v-if="!entradaEditando">
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Número da Nota Fiscal *</label>
                <input v-model="form.numero_nf" data-testid="numero-nf" type="number" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.numero_nf ? 'border-red-500' : '']" />
                <p v-if="errors.numero_nf" data-testid="error-numero-nf" class="text-red-500 text-sm mt-1">{{ errors.numero_nf }}</p>
              </div>
              <div :class="entradaEditando ? 'col-span-2' : ''">
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Fornecedor *</label>
                <div>
                  <div class="flex gap-2">
                    <select v-model="form.fornecedor_id" data-testid="fornecedor-select" class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.fornecedor_id ? 'border-red-500' : '']">
                      <option value="">Selecione um fornecedor</option>
                      <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">
                        {{ fornecedor.nome }}
                      </option>
                    </select>
                    <button type="button" @click="abrirModalFornecedor" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                      +
                    </button>
                  </div>
                  <p v-if="errors.fornecedor_id" data-testid="error-fornecedor" class="text-red-500 text-sm mt-1">{{ errors.fornecedor_id }}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Quantidade *</label>
                <input v-model="form.quantidade" data-testid="quantidade" type="number" step="0.01" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.quantidade ? 'border-red-500' : '']" />
                <p v-if="errors.quantidade" data-testid="error-quantidade" class="text-red-500 text-sm mt-1">{{ errors.quantidade }}</p>
              </div>
              <div>
                <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Data e Hora *</label>
                <input v-model="form.data_movimentacao" data-testid="data-hora" type="datetime-local" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', errors.data_movimentacao ? 'border-red-500' : '']" />
                <p v-if="errors.data_movimentacao" data-testid="error-data-hora" class="text-red-500 text-sm mt-1">{{ errors.data_movimentacao }}</p>
              </div>
            </div>

            <div>
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Observação</label>
              <textarea v-model="form.observacao" rows="2" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
            <button type="submit" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">{{ entradaEditando ? 'Atualizar' : 'Cadastrar' }}</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal Novo Fornecedor -->
    <div v-if="mostrarModalFornecedor" @click="fecharModalFornecedor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div @click.stop class="rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">Novo Fornecedor</h3>
        
        <form @submit.prevent="salvarFornecedor">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Nome</label>
            <input v-model="formFornecedor.nome" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">CPF/CNPJ</label>
              <input v-model="formFornecedor.cnpj" @input="formatarCpfCnpjFornecedor" maxlength="18" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
            </div>
            <div>
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Telefone</label>
              <input v-model="formFornecedor.telefone" @input="formatarTelefoneFornecedor" maxlength="15" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModalFornecedor" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
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

const entradas = ref([])
const lotes = ref([])
const fornecedores = ref([])
const mostrarModalFornecedor = ref(false)
const entradaEditando = ref(null)

const formFornecedor = ref({
  nome: '',
  cnpj: '',
  telefone: ''
})
const loading = ref(true)
const mostrarModal = ref(false)

const form = ref({
  produto_nome: '',
  produto_categoria: '',
  produto_unidade: '',
  numero_lote: '',
  data_validade: '',
  numero_nf: '',
  fornecedor_id: '',
  quantidade: '',
  data_movimentacao: '',
  observacao: ''
})

const errors = ref({
  produto_nome: '',
  produto_unidade: '',
  numero_lote: '',
  data_validade: '',
  numero_nf: '',
  fornecedor_id: '',
  quantidade: '',
  data_movimentacao: ''
})

const validateField = (field) => {
  if (!form.value[field]) {
    errors.value[field] = 'Este campo é obrigatório'
  } else {
    errors.value[field] = ''
  }
}

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

const carregarFornecedores = async () => {
  try {
    fornecedores.value = await api('/fornecedores')
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error)
  }
}

const abrirModal = () => {
  entradaEditando.value = null
  const agora = new Date()
  const dataHoraLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  
  form.value = {
    produto_nome: '',
    produto_categoria: '',
    produto_unidade: '',
    numero_lote: '',
    data_validade: '',
    numero_nf: '',
    fornecedor_id: '',
    quantidade: '',
    data_movimentacao: dataHoraLocal,
    observacao: ''
  }
  mostrarModal.value = true
}

const editar = (entrada) => {
  entradaEditando.value = entrada
  const dataHora = new Date(entrada.data_movimentacao)
  const dataHoraLocal = new Date(dataHora.getTime() - dataHora.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  
  form.value = {
    quantidade: entrada.quantidade,
    data_movimentacao: dataHoraLocal,
    observacao: entrada.observacao?.replace(/^NF: \d+( \| )?/, '') || '',
    fornecedor_id: entrada.fornecedor_id || ''
  }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
  entradaEditando.value = null
}

const salvar = async () => {
  errors.value = {
    produto_nome: '',
    produto_unidade: '',
    numero_lote: '',
    data_validade: '',
    numero_nf: '',
    fornecedor_id: '',
    quantidade: '',
    data_movimentacao: ''
  }

  let hasError = false
  if (!entradaEditando.value) {
    if (!form.value.produto_nome) { errors.value.produto_nome = 'Este campo é obrigatório'; hasError = true }
    if (!form.value.produto_unidade) { errors.value.produto_unidade = 'Este campo é obrigatório'; hasError = true }
    if (!form.value.numero_lote) { errors.value.numero_lote = 'Este campo é obrigatório'; hasError = true }
    if (!form.value.data_validade) { errors.value.data_validade = 'Este campo é obrigatório'; hasError = true }
    if (!form.value.numero_nf) { errors.value.numero_nf = 'Este campo é obrigatório'; hasError = true }
  }
  if (!form.value.fornecedor_id) { errors.value.fornecedor_id = 'Este campo é obrigatório'; hasError = true }
  if (!form.value.quantidade) { errors.value.quantidade = 'Este campo é obrigatório'; hasError = true }
  if (!form.value.data_movimentacao) { errors.value.data_movimentacao = 'Este campo é obrigatório'; hasError = true }

  if (hasError) return

  try {
    if (entradaEditando.value) {
      const body = {
        quantidade: parseFloat(form.value.quantidade),
        data_movimentacao: form.value.data_movimentacao,
        observacao: form.value.observacao
      }
      if (form.value.fornecedor_id) {
        body.fornecedor_id = form.value.fornecedor_id
      }
      await api(`/movimentacoes/${entradaEditando.value.id}`, {
        method: 'PUT',
        body
      })
      showToast('Entrada atualizada com sucesso')
    } else {
      const produto = await api('/produtos', {
        method: 'POST',
        body: {
          nome: form.value.produto_nome,
          categoria: form.value.produto_categoria,
          unidade_medida: form.value.produto_unidade
        }
      })

      const lote = await api('/lotes', {
        method: 'POST',
        body: {
          produto_id: produto.id,
          numero_lote: form.value.numero_lote,
          quantidade_inicial: 0,
          data_entrada: form.value.data_movimentacao.split('T')[0],
          data_validade: form.value.data_validade
        }
      })

      await api('/movimentacoes', {
        method: 'POST',
        body: {
          lote_id: lote.id,
          tipo: 'ENTRADA',
          quantidade: form.value.quantidade,
          data_movimentacao: form.value.data_movimentacao,
          fornecedor_id: form.value.fornecedor_id,
          observacao: `NF: ${form.value.numero_nf}${form.value.observacao ? ' | ' + form.value.observacao : ''}`
        }
      })
      showToast('Cadastro realizado com sucesso')
    }

    fecharModal()
    await carregar()
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert(error.data?.error || 'Erro ao cadastrar')
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

const abrirModalFornecedor = () => {
  formFornecedor.value = {
    nome: '',
    cnpj: '',
    telefone: ''
  }
  mostrarModalFornecedor.value = true
}

const fecharModalFornecedor = () => {
  mostrarModalFornecedor.value = false
}

const formatarCpfCnpjFornecedor = (e) => {
  let valor = e.target.value.replace(/\D/g, '')
  
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    valor = valor.replace(/(\d{2})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1/$2')
    valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
  
  formFornecedor.value.cnpj = valor
}

const formatarTelefoneFornecedor = (e) => {
  let valor = e.target.value.replace(/\D/g, '')
  valor = valor.replace(/^(\d{2})(\d)/, '($1) $2')
  valor = valor.replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  formFornecedor.value.telefone = valor
}

const salvarFornecedor = async () => {
  try {
    const novoFornecedor = await api('/fornecedores', {
      method: 'POST',
      body: formFornecedor.value
    })
    await carregarFornecedores()
    form.value.fornecedor_id = novoFornecedor.id
    fecharModalFornecedor()
    showToast('Fornecedor cadastrado com sucesso')
  } catch (error) {
    console.error('Erro ao salvar fornecedor:', error)
    alert(error.data?.error || 'Erro ao salvar fornecedor')
  }
}

onMounted(() => {
  carregar()
  carregarLotes()
  carregarFornecedores()
})
</script>
