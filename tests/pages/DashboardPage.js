export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.lotesTable = page.locator('table');
    this.editarButton = page.getByRole('button', { name: /editar|concluir/i });
    this.adicionarAcaoButton = page.locator('button:has(svg path[d*="M12 6v6m0 0v6"])');
    this.modalTitle = page.getByText('Nova Ação Rápida');
  }

  async goto() {
    await this.page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle' });
  }

  async clickAcaoRapida(titulo) {
    await this.page.getByText(titulo).click();
  }

  async clickEditarAcoes() {
    await this.editarButton.click();
  }

  async isInEditMode() {
    const text = await this.editarButton.textContent();
    return text.includes('Concluir');
  }

  async removerAcao(index) {
    const removeButtons = await this.page.locator('button:has-text("×")').all();
    if (removeButtons[index]) {
      await removeButtons[index].click();
    }
  }

  async abrirModalNovaAcao() {
    await this.adicionarAcaoButton.click();
  }

  async selecionarFuncionalidade(funcionalidade) {
    await this.page.getByTestId('funcionalidade-select').selectOption(funcionalidade);
  }

  async salvarNovaAcao() {
    await this.page.locator('button[type="submit"]').last().click();
  }

  async getLotesVencendoCount() {
    const rows = await this.page.locator('tbody tr').count();
    return rows;
  }

  async hasLotesVencendo() {
    const noDataMessage = await this.page.getByText('Nenhum lote próximo ao vencimento').isVisible().catch(() => false);
    return !noDataMessage;
  }
}
