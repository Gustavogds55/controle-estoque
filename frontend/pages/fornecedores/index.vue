<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Gerenciamento de Fornecedores</h2>
        <button @click="abrirModal()" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          + Novo Fornecedor
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="fornecedores.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhum fornecedor cadastrado
      </div>

      <table v-else class="w-full">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Nome</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">CNPJ</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Telefone</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Email</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="fornecedor in fornecedores" :key="fornecedor.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ fornecedor.nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ fornecedor.cnpj || '-' }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ fornecedor.telefone || '-' }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ fornecedor.email || '-' }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="editarFornecedor(fornecedor)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" :class="darkMode ? 'hover:bg-blue-900/20' : ''" title="Editar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="deletarFornecedor(fornecedor.id)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" :class="darkMode ? 'hover:bg-red-900/20' : ''" title="Excluir">
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
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">{{ fornecedorEditando ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</h3>
        
        <form @submit.prevent="salvar">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Nome <span class="text-red-500">*</span></label>
            <input v-model="form.nome" @blur="validarCampo('nome')" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', erros.nome ? 'border-red-500' : '']" />
            <p v-if="erros.nome" class="text-red-500 text-sm mt-1">{{ erros.nome }}</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">CPF/CNPJ <span class="text-red-500">*</span></label>
              <input v-model="form.cnpj" @input="formatarCpfCnpj" @blur="validarCampo('cnpj')" maxlength="18" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', erros.cnpj ? 'border-red-500' : '']" />
              <p v-if="erros.cnpj" class="text-red-500 text-sm mt-1">{{ erros.cnpj }}</p>
            </div>
            <div>
              <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Telefone</label>
              <input v-model="form.telefone" @input="formatarTelefone" maxlength="15" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Endereço</label>
            <textarea v-model="form.endereco" rows="2" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"></textarea>
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

const fornecedores = ref([])
const loading = ref(true)
const mostrarModal = ref(false)
const fornecedorEditando = ref(null)

const form = ref({
  nome: '',
  cnpj: '',
  telefone: '',
  email: '',
  endereco: ''
})

const erros = ref({
  nome: '',
  cnpj: ''
})

const carregar = async () => {
  loading.value = true
  try {
    fornecedores.value = await api('/fornecedores')
  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error)
  } finally {
    loading.value = false
  }
}

const abrirModal = () => {
  fornecedorEditando.value = null
  form.value = {
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: ''
  }
  mostrarModal.value = true
}

const editarFornecedor = (fornecedor) => {
  fornecedorEditando.value = fornecedor
  form.value = { ...fornecedor }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
  fornecedorEditando.value = null
}

const validarCampo = (campo) => {
  if (campo === 'nome' && !form.value.nome.trim()) {
    erros.value.nome = 'Este campo é obrigatório'
  } else if (campo === 'nome') {
    erros.value.nome = ''
  }

  if (campo === 'cnpj' && !form.value.cnpj.trim()) {
    erros.value.cnpj = 'Este campo é obrigatório'
  } else if (campo === 'cnpj') {
    erros.value.cnpj = ''
  }
}

const validarFormulario = () => {
  erros.value = { nome: '', cnpj: '' }
  let valido = true

  if (!form.value.nome.trim()) {
    erros.value.nome = 'Este campo é obrigatório'
    valido = false
  }

  if (!form.value.cnpj.trim()) {
    erros.value.cnpj = 'Este campo é obrigatório'
    valido = false
  }

  return valido
}

const salvar = async () => {
  if (!validarFormulario()) return

  try {
    if (fornecedorEditando.value) {
      await api(`/fornecedores/${fornecedorEditando.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      showToast('Fornecedor atualizado com sucesso')
    } else {
      await api('/fornecedores', {
        method: 'POST',
        body: form.value
      })
      showToast('Fornecedor cadastrado com sucesso')
    }
    fecharModal()
    await carregar()
  } catch (error) {
    console.error('Erro ao salvar fornecedor:', error)
    alert(error.data?.error || 'Erro ao salvar fornecedor')
  }
}

const formatarCpfCnpj = (e) => {
  let valor = e.target.value.replace(/\D/g, '')
  
  if (valor.length <= 11) {
    // CPF: 000.000.000-00
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    // CNPJ: 00.000.000/0000-00
    valor = valor.replace(/(\d{2})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1/$2')
    valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
  
  form.value.cnpj = valor
}

const formatarTelefone = (e) => {
  let valor = e.target.value.replace(/\D/g, '')
  
  // (00) 00000-0000 ou (00) 0000-0000
  valor = valor.replace(/^(\d{2})(\d)/, '($1) $2')
  valor = valor.replace(/(\d{4,5})(\d{4})$/, '$1-$2')
  
  form.value.telefone = valor
}

const deletarFornecedor = async (id) => {
  try {
    await api(`/fornecedores/${id}`, { method: 'DELETE' })
    showToast('Fornecedor excluído com sucesso')
    await carregar()
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error)
    alert(error.data?.error || 'Erro ao deletar fornecedor')
  }
}

onMounted(() => {
  carregar()
})
</script>
