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
              <button @click="editProduto(produto)" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
              <button @click="deleteProduto(produto.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="rounded-lg p-6 w-full max-w-md" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : ''">{{ editMode ? 'Editar Produto' : 'Novo Produto' }}</h3>
        
        <form @submit.prevent="saveProduto">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Nome</label>
            <input v-model="form.nome" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
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
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Unidade de Medida</label>
            <input v-model="form.unidade_medida" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''" />
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
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

const produtos = ref([])
const loading = ref(true)
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ nome: '', categoria: '', descricao: '', unidade_medida: '' })

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

const saveProduto = async () => {
  try {
    if (editMode.value) {
      await api(`/produtos/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await api('/produtos', {
        method: 'POST',
        body: form.value
      })
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
  if (!confirm('Deseja excluir este produto?')) return
  
  try {
    await api(`/produtos/${id}`, { method: 'DELETE' })
    await loadProdutos()
  } catch (e) {
    alert('Erro ao excluir produto')
  }
}

const closeModal = () => {
  showModal.value = false
  editMode.value = false
  form.value = { nome: '', categoria: '', descricao: '', unidade_medida: '' }
}

onMounted(() => {
  loadProdutos()
})
</script>
