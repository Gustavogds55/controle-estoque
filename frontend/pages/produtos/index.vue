<template>
  <div>
    <div class="rounded-lg shadow p-6" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="mb-6">
        <h2 class="text-2xl font-bold" :class="darkMode ? 'text-purple-400' : 'text-gray-800'">Gerenciamento de Produtos</h2>
        <p class="text-sm mt-2" :class="darkMode ? 'text-gray-400' : 'text-gray-600'">Para cadastrar novos produtos, utilize a aba "Entradas"</p>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="produtos.length === 0" class="text-center py-8" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhum produto cadastrado
      </div>

      <table v-else class="w-full">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-gray-50'">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Nome</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Categoria</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Unidade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-gray-700'">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="produto in produtos" :key="produto.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'">
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ produto.nome }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ produto.categoria }}</td>
            <td class="px-4 py-3" :class="darkMode ? 'text-gray-300' : ''">{{ produto.unidade_medida }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="editProduto(produto)" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" :class="darkMode ? 'hover:bg-blue-900/20' : ''" title="Editar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="deleteProduto(produto.id)" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" :class="darkMode ? 'hover:bg-red-900/20' : ''" title="Excluir">
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
    <div v-if="showModal" @click="closeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div @click.stop class="rounded-lg p-6 w-full max-w-4xl" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">{{ editMode ? 'Editar Produto' : 'Novo Produto' }}</h3>
        
        <form @submit.prevent="saveProduto">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Nome <span class="text-red-500">*</span></label>
            <input v-model="form.nome" @blur="validarCampo('nome')" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', erros.nome ? 'border-red-500' : '']" />
            <p v-if="erros.nome" class="text-red-500 text-sm mt-1">{{ erros.nome }}</p>
          </div>
          
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Categoria</label>
            <input v-model="form.categoria" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>
          
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Descrição</label>
            <textarea v-model="form.descricao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Unidade de Medida <span class="text-red-500">*</span></label>
            <input v-model="form.unidade_medida" @blur="validarCampo('unidade_medida')" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="[darkMode ? 'bg-gray-700 border-gray-600 text-white' : '', erros.unidade_medida ? 'border-red-500' : '']" />
            <p v-if="erros.unidade_medida" class="text-red-500 text-sm mt-1">{{ erros.unidade_medida }}</p>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
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

const produtos = ref([])
const loading = ref(true)
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ nome: '', categoria: '', descricao: '', unidade_medida: '' })
const erros = ref({ nome: '', unidade_medida: '' })

const loadProdutos = async () => {
  loading.value = true
  try {
    produtos.value = await api('/produtos')
  } catch (e) {
    alert('Erro ao carregar produtos')
  } finally {
    loading.value = false
  }
}

const validarCampo = (campo) => {
  if (campo === 'nome' && !form.value.nome.trim()) {
    erros.value.nome = 'Este campo é obrigatório'
  } else if (campo === 'nome') {
    erros.value.nome = ''
  }

  if (campo === 'unidade_medida' && !form.value.unidade_medida.trim()) {
    erros.value.unidade_medida = 'Este campo é obrigatório'
  } else if (campo === 'unidade_medida') {
    erros.value.unidade_medida = ''
  }
}

const validarFormulario = () => {
  erros.value = { nome: '', unidade_medida: '' }
  let valido = true

  if (!form.value.nome.trim()) {
    erros.value.nome = 'Este campo é obrigatório'
    valido = false
  }

  if (!form.value.unidade_medida.trim()) {
    erros.value.unidade_medida = 'Este campo é obrigatório'
    valido = false
  }

  return valido
}

const saveProduto = async () => {
  if (!validarFormulario()) return

  try {
    if (editMode.value) {
      await api(`/produtos/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      showToast('Produto atualizado com sucesso')
    } else {
      await api('/produtos', {
        method: 'POST',
        body: form.value
      })
      showToast('Produto cadastrado com sucesso')
    }
    closeModal()
    await loadProdutos()
  } catch (e) {
    alert('Erro ao salvar produto')
  }
}

const editProduto = (produto) => {
  form.value = { ...produto }
  editMode.value = true
  showModal.value = true
}

const deleteProduto = async (id) => {
  try {
    await api(`/produtos/${id}`, { method: 'DELETE' })
    showToast('Produto excluído com sucesso')
    await loadProdutos()
  } catch (e) {
    alert('Erro ao excluir produto')
  }
}

const closeModal = () => {
  showModal.value = false
  editMode.value = false
  form.value = { nome: '', categoria: '', descricao: '', unidade_medida: '' }
  erros.value = { nome: '', unidade_medida: '' }
}

onMounted(() => {
  loadProdutos()
})
</script>
