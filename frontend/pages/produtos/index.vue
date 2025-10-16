<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Produtos</h1>
      <button @click="showModal = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Novo Produto
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">Carregando...</div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="produto in produtos" :key="produto.id">
            <td class="px-6 py-4">{{ produto.nome }}</td>
            <td class="px-6 py-4">{{ produto.categoria }}</td>
            <td class="px-6 py-4">{{ produto.unidade_medida }}</td>
            <td class="px-6 py-4 space-x-2">
              <button @click="editProduto(produto)" class="text-blue-600 hover:text-blue-800">Editar</button>
              <button @click="deleteProduto(produto.id)" class="text-red-600 hover:text-red-800">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg w-96">
        <h2 class="text-2xl font-bold mb-4">{{ editMode ? 'Editar' : 'Novo' }} Produto</h2>
        
        <form @submit.prevent="saveProduto">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Nome</label>
            <input v-model="form.nome" required class="w-full px-3 py-2 border rounded" />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Categoria</label>
            <input v-model="form.categoria" class="w-full px-3 py-2 border rounded" />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Descrição</label>
            <textarea v-model="form.descricao" class="w-full px-3 py-2 border rounded"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Unidade de Medida</label>
            <input v-model="form.unidade_medida" required class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="flex space-x-2">
            <button type="submit" class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Salvar
            </button>
            <button type="button" @click="closeModal" class="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
              Cancelar
            </button>
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

const { apiFetch } = useApi()

const produtos = ref([])
const loading = ref(true)
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ nome: '', categoria: '', descricao: '', unidade_medida: '' })

const loadProdutos = async () => {
  loading.value = true
  try {
    produtos.value = await apiFetch('/produtos')
  } catch (e) {
    alert('Erro ao carregar produtos')
  } finally {
    loading.value = false
  }
}

const saveProduto = async () => {
  try {
    if (editMode.value) {
      await apiFetch(`/produtos/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
    } else {
      await apiFetch('/produtos', {
        method: 'POST',
        body: form.value
      })
    }
    closeModal()
    loadProdutos()
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
    await apiFetch(`/produtos/${id}`, { method: 'DELETE' })
    loadProdutos()
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
