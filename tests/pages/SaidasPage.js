export class SaidasPage {
  constructor(page) {
    this.page = page;
    this.novaSaidaButton = page.getByRole('button', { name: '+ Nova Saída' });
    this.cancelarButton = page.getByRole('button', { name: 'Cancelar' });
    this.salvarButton = page.getByRole('button', { name: 'Salvar' });
  }

  async goto() {
    await this.page.goto('http://localhost:3001/saidas');
  }

  async abrirModalNovaSaida() {
    await this.novaSaidaButton.click();
  }

  async selecionarLote(numeroLote) {
    const option = await this.page.locator(`select option:has-text("${numeroLote}")`).first();
    const value = await option.getAttribute('value');
    await this.page.locator('select').selectOption(value);
  }

  async preencherQuantidade(quantidade) {
    await this.page.locator('input[type="number"]').fill(quantidade);
  }

  async preencherDataHora(dataHora) {
    await this.page.locator('input[type="datetime-local"]').fill(dataHora);
  }

  async preencherObservacao(observacao) {
    await this.page.locator('textarea').fill(observacao);
  }

  async salvar() {
    await this.salvarButton.click();
  }

  async cancelar() {
    await this.cancelarButton.click();
  }
}
