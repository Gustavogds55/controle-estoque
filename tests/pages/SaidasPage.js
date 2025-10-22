export class SaidasPage {
  constructor(page) {
    this.page = page
  }

  async abrirModalNovaSaida() {
    await this.page.getByRole('button', { name: '+ Nova Saída' }).click()
  }

  async selecionarLote(loteTexto) {
    const option = await this.page.locator('select option').filter({ hasText: loteTexto }).first()
    const value = await option.getAttribute('value')
    await this.page.locator('select').selectOption(value)
  }

  async preencherQuantidade(quantidade) {
    await this.page.locator('input[type="number"]').fill(quantidade)
  }

  async preencherDataHora(dataHora) {
    await this.page.locator('input[type="datetime-local"]').fill(dataHora)
  }

  async preencherObservacao(observacao) {
    await this.page.locator('textarea').fill(observacao)
  }

  async salvar() {
    await this.page.getByRole('button', { name: 'Salvar' }).click()
  }

  async cancelar() {
    await this.page.getByRole('button', { name: 'Cancelar' }).click()
  }

  async excluirPrimeiraSaida() {
    await this.page.locator('tbody tr').first().locator('button[title="Excluir"]').click()
  }
}
