const fetch = require('node-fetch')

const API_URL = 'http://localhost:3000/api'
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlc3RvcXVlLmNvbSIsImlhdCI6MTczNzU3MzY5NywiZXhwIjoxNzM3NjYwMDk3fQ.8vQYqKqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYqYqY' // Token de exemplo

async function limparProdutos() {
  try {
    console.log('Iniciando limpeza de produtos...')
    
    // Buscar todos os produtos
    const produtosResponse = await fetch(`${API_URL}/produtos`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    })
    const produtos = await produtosResponse.json()
    console.log(`Encontrados ${produtos.length} produtos`)
    
    // Deletar cada produto
    let deletados = 0
    for (const produto of produtos) {
      try {
        const response = await fetch(`${API_URL}/produtos/${produto.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${TOKEN}` }
        })
        if (response.ok) {
          deletados++
          console.log(`✓ Produto "${produto.nome}" deletado`)
        }
      } catch (error) {
        console.log(`✗ Erro ao deletar "${produto.nome}":`, error.message)
      }
    }
    
    console.log(`\n✅ Limpeza concluída! ${deletados}/${produtos.length} produtos deletados`)
  } catch (error) {
    console.error('❌ Erro ao limpar produtos:', error.message)
    console.log('\nDica: Certifique-se de que:')
    console.log('1. O backend está rodando em http://localhost:3000')
    console.log('2. Você está logado e tem um token válido')
    console.log('3. Execute: node helpers/limpar-produtos.js')
  }
}

limparProdutos()
