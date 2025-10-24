class FornecedoresPage {
  constructor(page) {
    this.page = page
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Fornecedores', exact: true }).click()
  }

  async abrirModalNovoFornecedor() {
    await this.page.getByRole('button', { name: 'Novo Fornecedor' }).click()
  }

  async preencherNome(nome) {
    await this.page.getByRole('textbox').nth(0).fill(nome)
  }

  async preencherCNPJ(cnpj) {
    await this.page.getByRole('textbox').nth(1).fill(cnpj)
  }

  async preencherTelefone(telefone) {
    await this.page.getByRole('textbox').nth(2).fill(telefone)
  }

  async preencherEmail(email) {
    await this.page.getByRole('textbox').nth(3).fill(email)
  }

  async preencherEndereco(endereco) {
    await this.page.getByRole('textbox').nth(4).fill(endereco)
  }

  async salvar() {
    await this.page.getByRole('button', { name: 'Salvar' }).click()
  }

  async cancelar() {
    await this.page.getByRole('button', { name: 'Cancelar' }).click()
  }

  async excluirFornecedor(nome) {
    const fornecedorRow = this.page.locator('tr', { hasText: nome })
    await fornecedorRow.locator('button[title="Excluir"]').click()
  }

  getFornecedorRow(nome) {
    return this.page.locator('tr', { hasText: nome })
  }
}

module.exports = { FornecedoresPage }
