const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./pages/LoginPage')
const { ProdutosPage } = require('./pages/ProdutosPage')
const { EntradasPage } = require('./pages/EntradasPage')

test.describe('Produtos', () => {
  let loginPage
  let produtosPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    produtosPage = new ProdutosPage(page)
    await loginPage.goto()
    await loginPage.login('admin@estoque.com', '123456')
    await page.waitForLoadState('networkidle')
  })

  test('deve exibir a tela de produtos', async ({ page }) => {
    await produtosPage.navigate()
    await expect(page.getByRole('heading', { name: 'Gerenciamento de Produtos' })).toBeVisible()
  })

  test('deve exibir mensagem informativa sobre cadastro via Entradas', async ({ page }) => {
    await produtosPage.navigate()
    await expect(page.getByText('Para cadastrar novos produtos, utilize a aba "Entradas"')).toBeVisible()
  })

  test('deve validar campo "Nome" obrigatório', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Validar Nome ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherNome('')
    await produtosPage.preencherUnidadeMedida('kg')
    await produtosPage.salvar()

    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()

    await produtosPage.cancelar()
    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Unidade de Medida" obrigatório', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Validar Unidade ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherUnidadeMedida('')
    await produtosPage.salvar()

    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()

    await produtosPage.cancelar()
    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve validar campos vazios simultaneamente', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Validar Ambos ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherNome('')
    await produtosPage.preencherUnidadeMedida('')
    await produtosPage.salvar()

    const erros = page.getByText('Este campo é obrigatório')
    await expect(erros).toHaveCount(2)

    await produtosPage.cancelar()
    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve validar asterisco em campos obrigatórios', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Asterisco ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)

    await expect(page.locator('label:has-text("Nome") span.text-red-500')).toBeVisible()
    await expect(page.locator('label:has-text("Unidade de Medida") span.text-red-500')).toBeVisible()

    await produtosPage.cancelar()
    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve refletir edição de produto nos lotes', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Lote Reflexo ' + timestamp
    const novoNome = 'Produto Editado Lote ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherNome(novoNome)
    await produtosPage.salvar()
    await page.waitForTimeout(500)

    await page.getByRole('link', { name: 'Lotes', exact: true }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(novoNome)).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(novoNome)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(novoNome)
    await page.waitForTimeout(500)
  })

  test('deve exibir tabela com colunas corretas', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Tabela ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await expect(page.locator('th:has-text("Nome")')).toBeVisible()
    await expect(page.locator('th:has-text("Categoria")')).toBeVisible()
    await expect(page.locator('th:has-text("Unidade")')).toBeVisible()
    await expect(page.locator('th:has-text("Ações")')).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve editar nome do produto', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Editar Nome ' + timestamp
    const novoNome = 'Nome Editado ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherNome(novoNome)
    await produtosPage.salvar()

    await expect(page.getByText('Produto atualizado com sucesso')).toBeVisible()
    await expect(page.getByText(novoNome)).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(novoNome)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(novoNome)
    await page.waitForTimeout(500)
  })

  test('deve editar categoria do produto', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Editar Cat ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherCategoria('Nova Categoria')
    await produtosPage.salvar()

    await expect(page.getByText('Produto atualizado com sucesso')).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve editar unidade de medida do produto', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Editar Un ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherUnidadeMedida('litros')
    await produtosPage.salvar()

    await expect(page.getByText('Produto atualizado com sucesso')).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve editar descrição do produto', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Editar Desc ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await produtosPage.preencherDescricao('Nova descrição do produto')
    await produtosPage.salvar()

    await expect(page.getByText('Produto atualizado com sucesso')).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve excluir produto com sucesso', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Excluir ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)

    await produtosPage.navigate()
    await expect(page.getByText(nomeProduto)).toBeVisible()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)

    await expect(page.getByText(nomeProduto)).not.toBeVisible()
  })

  test('deve cancelar edição de produto', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Cancelar ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Editar Produto' })).toBeVisible()
    await produtosPage.preencherNome('Nome Alterado')
    await produtosPage.cancelar()

    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Editar Produto' })).not.toBeVisible()
    await expect(page.getByText(nomeProduto)).toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    const timestamp = Date.now()
    const nomeProduto = 'Produto Modal ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 })
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await produtosPage.navigate()
    await produtosPage.editarProduto(nomeProduto)
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Editar Produto' })).toBeVisible()
    await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Editar Produto' })).not.toBeVisible()

    await entradasPage.navigate()
    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await produtosPage.navigate()
    await produtosPage.excluirProduto(nomeProduto)
    await page.waitForTimeout(500)
  })
})
