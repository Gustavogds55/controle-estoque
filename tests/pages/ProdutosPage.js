class ProdutosPage {
  constructor(page) {
    this.page = page
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Produtos', exact: true }).click()
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('h2:has-text("Gerenciamento de Produtos")')
  }

  async abrirModalNovoProduto() {
    await this.page.getByRole('button', { name: 'Novo Produto' }).click()
  }

  async preencherNome(nome) {
    await this.page.getByRole('textbox').nth(0).fill(nome)
  }

  async preencherCategoria(categoria) {
    await this.page.getByRole('textbox').nth(1).fill(categoria)
  }

  async preencherDescricao(descricao) {
    await this.page.getByRole('textbox').nth(2).fill(descricao)
  }

  async preencherUnidadeMedida(unidade) {
    await this.page.getByRole('textbox').nth(3).fill(unidade)
  }

  async salvar() {
    await this.page.getByRole('button', { name: 'Salvar' }).click()
  }

  async cancelar() {
    await this.page.getByRole('button', { name: 'Cancelar' }).click()
  }

  async editarProduto(nomeProduto) {
    const produtoRow = this.page.locator('tr', { hasText: nomeProduto })
    await produtoRow.locator('button[title="Editar"]').click()
  }

  async excluirProduto(nomeProduto) {
    const produtoRow = this.page.locator('tr', { hasText: nomeProduto })
    await produtoRow.locator('button[title="Excluir"]').click()
  }

  getProdutoRow(nomeProduto) {
    return this.page.locator('tr', { hasText: nomeProduto })
  }
}

module.exports = { ProdutosPage }
