<template>
  <div>
    <!-- Lotes Próximos ao Vencimento -->
    <div class="rounded-lg shadow-lg p-6 mb-6 border-l-4 border-purple-400" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-lg font-semibold mb-4" :class="darkMode ? 'text-purple-400' : 'text-black'">Lotes Próximos ao Vencimento</h3>
      
      <div v-if="lotesVencendo.length === 0" class="text-center py-4" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Nenhum lote próximo ao vencimento
      </div>

      <table v-else class="w-full">
        <thead :class="darkMode ? 'bg-gray-700' : 'bg-purple-50'">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Produto</th>
            <th class="px-4 py-2 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Lote</th>
            <th class="px-4 py-2 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Estoque</th>
            <th class="px-4 py-2 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Validade</th>
            <th class="px-4 py-2 text-left text-sm font-semibold" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="lote in lotesVencendo" :key="lote.id" :class="darkMode ? 'hover:bg-gray-700' : 'hover:bg-purple-50'">
            <td class="px-4 py-2" :class="darkMode ? 'text-gray-300' : ''">{{ lote.produto_nome }}</td>
            <td class="px-4 py-2" :class="darkMode ? 'text-gray-300' : ''">{{ lote.numero_lote }}</td>
            <td class="px-4 py-2" :class="darkMode ? 'text-gray-300' : ''">{{ lote.quantidade_atual }}</td>
            <td class="px-4 py-2" :class="darkMode ? 'text-gray-300' : ''">{{ formatarData(lote.data_validade) }}</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 rounded text-xs font-semibold" :class="getStatusClass(lote.data_validade)">
                {{ getStatusTexto(lote.data_validade) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ações Rápidas -->
    <div class="rounded-lg shadow-lg p-6 border-l-4 border-purple-400" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold" :class="darkMode ? 'text-purple-400' : 'text-black'">Ações Rápidas</h3>
        <button @click="modoEdicao = !modoEdicao" class="text-sm px-3 py-1 rounded" :class="modoEdicao ? 'bg-purple-100 text-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'">
          {{ modoEdicao ? 'Concluir' : 'Editar' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(acao, index) in acoesRapidas" :key="index" class="relative">
          <NuxtLink :to="acao.link" class="flex items-center p-4 border rounded-lg transition" :class="darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-purple-200 hover:bg-purple-50'">
            <div class="mr-3" :class="acao.corIcone">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="acao.icone"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold" :class="darkMode ? 'text-gray-200' : 'text-gray-800'">{{ acao.titulo }}</p>
              <p class="text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">{{ acao.descricao }}</p>
            </div>
          </NuxtLink>
          <button v-if="modoEdicao" @click="removerAcao(index)" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
            ×
          </button>
        </div>

        <button v-if="modoEdicao" @click="abrirModalAcao" class="flex items-center justify-center p-4 border-2 border-dashed rounded-lg transition" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-purple-400' : 'border-purple-300 hover:bg-purple-50 text-purple-400'">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Adicionar Ação -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="rounded-lg p-6 w-full max-w-md border-t-4 border-purple-400" :class="darkMode ? 'bg-gray-800' : 'bg-white'">
        <h3 class="text-xl font-bold mb-4" :class="darkMode ? 'text-purple-400' : 'text-purple-700'">Nova Ação Rápida</h3>
        
        <form @submit.prevent="adicionarAcao">
          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Título</label>
            <input v-model="novaAcao.titulo" data-testid="titulo-input" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-purple-200'" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Descrição</label>
            <input v-model="novaAcao.descricao" data-testid="descricao-input" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-purple-200'" />
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Funcionalidade</label>
            <select v-model="novaAcao.link" @change="preencherPadrao" data-testid="funcionalidade-select" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-purple-200'">
              <option value="">(Selecione)</option>
              <option value="/produtos">Produtos</option>
              <option value="/lotes">Lotes</option>
              <option value="/entradas">Entradas</option>
              <option value="/saidas">Saídas</option>
              <option value="/movimentacoes">Movimentações</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-2" :class="darkMode ? 'text-gray-300' : 'text-gray-700'">Cor do Ícone</label>
            <select v-model="novaAcao.corIcone" data-testid="cor-select" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-purple-200'">
              <option value="text-blue-600">Azul</option>
              <option value="text-green-600">Verde</option>
              <option value="text-red-600">Vermelho</option>
              <option value="text-yellow-600">Amarelo</option>
              <option value="text-purple-600">Roxo</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="fecharModal" class="px-4 py-2 border rounded" :class="darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100'">Cancelar</button>
            <button type="submit" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Adicionar</button>
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

const lotesVencendo = ref([])

const modoEdicao = ref(false)
const mostrarModal = ref(false)

const acoesRapidas = ref([
  {
    titulo: 'Gerenciar Produtos',
    descricao: 'Adicionar, editar ou remover produtos',
    link: '/produtos',
    corIcone: 'text-blue-600',
    icone: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  {
    titulo: 'Gerenciar Lotes',
    descricao: 'Controlar lotes e validades',
    link: '/lotes',
    corIcone: 'text-green-600',
    icone: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  }
])

const novaAcao = ref({
  titulo: '',
  descricao: '',
  link: '',
  corIcone: 'text-blue-600',
  icone: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
})

const carregarLotes = async () => {
  try {
    const lotes = await api('/lotes')
    const hoje = new Date()
    const trintaDias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    lotesVencendo.value = lotes
      .filter(lote => new Date(lote.data_validade) <= trintaDias)
      .sort((a, b) => new Date(a.data_validade) - new Date(b.data_validade))
      .slice(0, 5)
  } catch (error) {
    console.error('Erro ao carregar lotes:', error)
  }
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const getStatusTexto = (dataValidade) => {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  const dias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24))
  
  if (dias < 0) return 'Vencido'
  if (dias === 0) return 'Vence Hoje'
  if (dias <= 7) return `${dias} dias`
  if (dias <= 30) return `${dias} dias`
  return `${dias} dias`
}

const getStatusClass = (dataValidade) => {
  const hoje = new Date()
  const validade = new Date(dataValidade)
  const dias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24))
  
  if (dias < 0) return 'bg-gray-200 text-gray-700'
  if (dias <= 7) return 'bg-red-100 text-red-700'
  if (dias <= 15) return 'bg-orange-100 text-orange-700'
  return 'bg-yellow-100 text-yellow-700'
}

const padroes = {
  '/produtos': {
    titulo: 'Gerenciar Produtos',
    descricao: 'Adicionar, editar ou remover produtos',
    corIcone: 'text-blue-600',
    icone: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
  },
  '/lotes': {
    titulo: 'Gerenciar Lotes',
    descricao: 'Controlar lotes e validades',
    corIcone: 'text-green-600',
    icone: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  },
  '/entradas': {
    titulo: 'Registrar Entradas',
    descricao: 'Adicionar entradas de estoque',
    corIcone: 'text-green-600',
    icone: 'M7 11l5-5m0 0l5 5m-5-5v12'
  },
  '/saidas': {
    titulo: 'Registrar Saídas',
    descricao: 'Adicionar saídas de estoque',
    corIcone: 'text-red-600',
    icone: 'M17 13l-5 5m0 0l-5-5m5 5V6'
  },
  '/movimentacoes': {
    titulo: 'Ver Movimentações',
    descricao: 'Histórico completo de movimentações',
    corIcone: 'text-purple-600',
    icone: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  }
}

const preencherPadrao = () => {
  const padrao = padroes[novaAcao.value.link]
  if (padrao) {
    novaAcao.value.titulo = padrao.titulo
    novaAcao.value.descricao = padrao.descricao
    novaAcao.value.corIcone = padrao.corIcone
    novaAcao.value.icone = padrao.icone
  }
}

const abrirModalAcao = () => {
  novaAcao.value = {
    titulo: '',
    descricao: '',
    link: '',
    corIcone: 'text-blue-600',
    icone: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
  }
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

const adicionarAcao = () => {
  acoesRapidas.value.push({ ...novaAcao.value })
  salvarAcoes()
  fecharModal()
}

const removerAcao = (index) => {
  if (confirm('Deseja remover esta ação?')) {
    acoesRapidas.value.splice(index, 1)
    salvarAcoes()
  }
}

const salvarAcoes = () => {
  localStorage.setItem('acoesRapidas', JSON.stringify(acoesRapidas.value))
}

const carregarAcoes = () => {
  const salvas = localStorage.getItem('acoesRapidas')
  if (salvas) {
    acoesRapidas.value = JSON.parse(salvas)
  }
}

onMounted(() => {
  carregarLotes()
  carregarAcoes()
})
</script>
