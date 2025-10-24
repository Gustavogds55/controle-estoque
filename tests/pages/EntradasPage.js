class EntradasPage {
  constructor(page) {
    this.page = page;
    this.novaEntradaButton = page.getByRole('button', { name: '+ Nova Entrada' });
    this.modalTitle = page.getByRole('heading', { name: 'Nova Entrada' });
    this.cancelarButton = page.getByRole('button', { name: 'Cancelar' });
    this.cadastrarButton = page.getByRole('button', { name: 'Cadastrar' });
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Entradas', exact: true }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('h2:has-text("Entrada de Mercadorias")');
  }

  async goto() {
    await this.page.goto('http://localhost:3001/entradas');
  }

  async abrirModalNovaEntrada() {
    await this.novaEntradaButton.click();
  }

  async preencherProduto(nome, categoria, unidade) {
    await this.page.getByTestId('produto-nome').fill(nome);
    if (categoria) await this.page.getByTestId('produto-categoria').fill(categoria);
    await this.page.getByTestId('produto-unidade').fill(unidade);
  }

  async preencherLote(numeroLote, dataValidade) {
    await this.page.getByTestId('numero-lote').fill(numeroLote);
    await this.page.getByTestId('data-validade').fill(dataValidade);
  }

  async preencherEntrada(numeroNF, fornecedorIndex, quantidade, dataHora, observacao) {
    await this.page.getByTestId('numero-nf').fill(numeroNF);
    await this.page.getByTestId('fornecedor-select').selectOption({ index: fornecedorIndex });
    await this.page.getByTestId('quantidade').fill(quantidade);
    await this.page.getByTestId('data-hora').fill(dataHora);
    if (observacao) await this.page.locator('textarea').fill(observacao);
  }

  async salvar() {
    await this.cadastrarButton.click();
  }

  async cancelar() {
    await this.cancelarButton.click();
  }

  async preencherNomeProduto(nome) {
    await this.page.getByTestId('produto-nome').fill(nome);
  }

  async selecionarCategoria(categoria) {
    await this.page.getByTestId('produto-categoria').fill(categoria);
  }

  async selecionarUnidadeMedida(unidade) {
    await this.page.getByTestId('produto-unidade').fill(unidade);
  }

  async preencherNumeroLote(numeroLote) {
    await this.page.getByTestId('numero-lote').fill(numeroLote);
  }

  async preencherDataValidade(dataValidade) {
    await this.page.getByTestId('data-validade').fill(dataValidade);
  }

  async preencherNumeroNF(numeroNF) {
    await this.page.getByTestId('numero-nf').fill(numeroNF);
  }

  async selecionarFornecedor(nomeFornecedor) {
    await this.page.getByTestId('fornecedor-select').selectOption({ label: nomeFornecedor });
  }

  async preencherQuantidade(quantidade) {
    await this.page.getByTestId('quantidade').fill(quantidade);
  }

  async preencherDataHora(dataHora) {
    await this.page.getByTestId('data-hora').fill(dataHora);
  }

  async excluirEntrada(nomeProduto) {
    const entradaRow = this.page.locator('tr', { hasText: nomeProduto });
    await entradaRow.locator('button[title="Excluir"]').click();
  }
}

module.exports = { EntradasPage }
