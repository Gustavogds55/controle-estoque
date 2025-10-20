<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gerenciamento de Produtos</h2>
        <button @click="showModal = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Novo Produto
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">Carregando...</div>

      <div v-else-if="produtos.length === 0" class="text-center py-8 text-gray-500">
        Nenhum produto cadastrado
      </div>

      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unidade</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="produto in produtos" :key="produto.id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ produto.nome }}</td>
            <td class="px-4 py-3">{{ produto.categoria }}</td>
            <td class="px-4 py-3">{{ produto.unidade_medida }}</td>
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
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">{{ editMode ? 'Editar Produto' : 'Novo Produto' }}</h3>
        
        <form @submit.prevent="saveProduto">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Nome</label>
            <input v-model="form.nome" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Categoria</label>
            <input v-model="form.categoria" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Descrição</label>
            <textarea v-model="form.descricao" rows="3" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Unidade de Medida</label>
            <input v-model="form.unidade_medida" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
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
