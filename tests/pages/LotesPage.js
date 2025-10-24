class LotesPage {
  constructor(page) {
    this.page = page
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Lotes', exact: true }).first().click()
  }

  async abrirModalEditar(numeroLote) {
    const loteRow = this.page.locator('tr', { hasText: numeroLote })
    await loteRow.locator('button[title="Editar"]').click()
  }

  async excluirLote(numeroLote) {
    const loteRow = this.page.locator('tr', { hasText: numeroLote })
    await loteRow.locator('button[title="Excluir"]').click()
  }

  async editarNumeroLote(novoNumero) {
    await this.page.locator('input[type="text"]').fill(novoNumero)
  }

  async salvar() {
    await this.page.getByRole('button', { name: 'Salvar' }).click()
  }

  async cancelar() {
    await this.page.getByRole('button', { name: 'Cancelar' }).click()
  }

  getLoteRow(numeroLote) {
    return this.page.locator('tr', { hasText: numeroLote })
  }
}

module.exports = { LotesPage }
