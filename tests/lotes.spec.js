const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./pages/LoginPage')
const { EntradasPage } = require('./pages/EntradasPage')
const { LotesPage } = require('./pages/LotesPage')

test.describe('Lotes', () => {
  let loginPage
  let entradasPage
  let lotesPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    entradasPage = new EntradasPage(page)
    lotesPage = new LotesPage(page)
    await loginPage.goto()
    await loginPage.login('admin@estoque.com', '123456')
    await page.waitForLoadState('networkidle')
  })

  test('deve exibir a tela de lotes', async ({ page }) => {
    await lotesPage.navigate()
    await expect(page.getByRole('heading', { name: 'Gerenciamento de Lotes' })).toBeVisible()
  })

  test('deve exibir tabela com colunas corretas', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Tabela ' + timestamp
    const numeroLote = 'LOTE-TABELA-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('99999', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await page.waitForSelector('table thead', { timeout: 10000 })
    const thead = page.locator('thead th')
    await expect(thead.nth(0)).toContainText('Produto')
    await expect(thead.nth(1)).toContainText('Número Lote')
    await expect(thead.nth(2)).toContainText('Qtd Atual')
    await expect(thead.nth(3)).toContainText('Data Entrada')
    await expect(thead.nth(4)).toContainText('Validade')
    await expect(thead.nth(5)).toContainText('Status')
    await expect(thead.nth(6)).toContainText('Ações')

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir status "Válido" para lote com validade futura', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Lote ' + timestamp
    const numeroLote = 'LOTE-VALIDO-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('11111', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('span', { hasText: 'Válido' })).toBeVisible()
    await expect(loteRow.locator('.bg-green-100')).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir status "Vencido" para lote com validade passada', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Vencido ' + timestamp
    const numeroLote = 'LOTE-VENCIDO-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2020-01-01')
    await entradasPage.preencherEntrada('22222', 1, '50', '2019-12-01T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('span', { hasText: 'Vencido' })).toBeVisible()
    await expect(loteRow.locator('.bg-red-100')).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir status "Próximo ao vencimento" para lote vencendo em 30 dias', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Vencendo ' + timestamp
    const numeroLote = 'LOTE-VENCENDO-' + timestamp
    
    const dataVencimento = new Date()
    dataVencimento.setDate(dataVencimento.getDate() + 15)
    const dataFormatada = dataVencimento.toISOString().split('T')[0]

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, dataFormatada)
    await entradasPage.preencherEntrada('33333', 1, '75', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('span', { hasText: 'Próximo ao vencimento' })).toBeVisible()
    await expect(loteRow.locator('.bg-yellow-100')).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve abrir modal de edição ao clicar em editar', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Editar ' + timestamp
    const numeroLote = 'LOTE-EDIT-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('44444', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await expect(page.getByText('Editar Lote')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toHaveValue(numeroLote)

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve editar lote com sucesso', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Editar ' + timestamp
    const numeroLote = 'LOTE-EDIT-' + timestamp
    const novoNumeroLote = 'LOTE-EDITADO-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('55555', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)
    await lotesPage.editarNumeroLote(novoNumeroLote)
    await lotesPage.salvar()

    await expect(page.getByText('Lote atualizado com sucesso')).toBeVisible()
    await expect(page.getByText(novoNumeroLote)).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve excluir lote com sucesso', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Excluir ' + timestamp
    const numeroLote = 'LOTE-DEL-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('66666', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.excluirLote(numeroLote)

    await expect(page.getByText('Lote excluído com sucesso')).toBeVisible()
    await expect(page.getByText(numeroLote)).not.toBeVisible()
    // Não precisa limpar: exclusão do lote remove entrada e produto automaticamente
  })

  test('deve fechar modal ao clicar em cancelar', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Modal ' + timestamp
    const numeroLote = 'LOTE-MODAL-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('77777', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await expect(page.getByText('Editar Lote')).toBeVisible()
    await lotesPage.cancelar()
    await expect(page.getByText('Editar Lote')).not.toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir quantidade atual atualizada após movimentações', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Qtd ' + timestamp
    const numeroLote = 'LOTE-QTD-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('88888', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('td').nth(2)).toHaveText('100.00')

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar formatação de data no formato dd/mm/yyyy', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Data ' + timestamp
    const numeroLote = 'LOTE-DATA-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('12345', 1, '50', '2024-06-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('td').nth(3)).toContainText('15/06/2024')
    await expect(loteRow.locator('td').nth(4)).toContainText('31/12/2025')

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar formatação de quantidade com 2 casas decimais', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Decimal ' + timestamp
    const numeroLote = 'LOTE-DECIMAL-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('54321', 1, '123.45', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    const loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('td').nth(2)).toHaveText('123.45')

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve criar múltiplos lotes do mesmo produto com validades diferentes', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Multi ' + timestamp
    const lote1 = 'LOTE-MULTI-1-' + timestamp
    const lote2 = 'LOTE-MULTI-2-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(lote1, '2025-06-30')
    await entradasPage.preencherEntrada('11111', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(lote2, '2025-12-31')
    await entradasPage.preencherEntrada('22222', 1, '75', '2024-01-20T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await expect(page.getByText(lote1)).toBeVisible()
    await expect(page.getByText(lote2)).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const rows = page.locator('tr', { hasText: productName })
    const count = await rows.count()
    for (let i = 0; i < count; i++) {
      page.once('dialog', dialog => dialog.accept())
      await rows.first().locator('button[title="Excluir"]').click()
      await page.waitForTimeout(500)
    }
  })

  test('deve editar data de validade e validar mudança de status', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Status ' + timestamp
    const numeroLote = 'LOTE-STATUS-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('99999', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    let loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('span', { hasText: 'Válido' })).toBeVisible()

    await lotesPage.abrirModalEditar(numeroLote)
    const dataVencendo = new Date()
    dataVencendo.setDate(dataVencendo.getDate() + 15)
    const dataFormatada = dataVencendo.toISOString().split('T')[0]
    await page.locator('input[type="date"]').last().fill(dataFormatada)
    await lotesPage.salvar()
    await page.waitForTimeout(500)

    loteRow = lotesPage.getLoteRow(numeroLote)
    await expect(loteRow.locator('span', { hasText: 'Próximo ao vencimento' })).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Produto" obrigatório no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto ValidProd ' + timestamp
    const numeroLote = 'LOTE-VALIDPROD-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('11111', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await page.locator('select').first().selectOption('')
    await lotesPage.salvar()
    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Número do Lote" obrigatório no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto ValidLote ' + timestamp
    const numeroLote = 'LOTE-VALIDLOTE-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('22222', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await page.locator('input[type="text"]').fill('')
    await lotesPage.salvar()
    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Quantidade Inicial" obrigatório no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto ValidQtd ' + timestamp
    const numeroLote = 'LOTE-VALIDQTD-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('33333', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await page.locator('input[type="number"]').first().fill('')
    await lotesPage.salvar()
    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Data de Entrada" obrigatório no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto ValidDataEnt ' + timestamp
    const numeroLote = 'LOTE-VALIDDATAENT-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('44444', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await page.locator('input[type="date"]').first().fill('')
    await lotesPage.salvar()
    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Data de Validade" obrigatório no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto ValidDataVal ' + timestamp
    const numeroLote = 'LOTE-VALIDDATAVAL-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('55555', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    await page.locator('input[type="date"]').last().fill('')
    await lotesPage.salvar()
    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar formato de data de validade no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto DataValid ' + timestamp
    const numeroLote = 'LOTE-DATAVALID-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('22222', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    const dataInput = page.locator('input[type="date"]').last()
    await expect(dataInput).toHaveAttribute('type', 'date')
    await expect(dataInput).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar quantidade negativa no modal de edição', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Negativo ' + timestamp
    const numeroLote = 'LOTE-NEG-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('33333', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await lotesPage.navigate()
    await lotesPage.abrirModalEditar(numeroLote)

    const qtdInput = page.locator('input[type="number"]').first()
    await qtdInput.fill('-10')
    await lotesPage.salvar()
    
    await expect(page.getByText('A quantidade não pode ser negativa')).toBeVisible()
    await expect(page.getByText('Editar Lote')).toBeVisible()

    await lotesPage.cancelar()
    await page.getByRole('link', { name: 'Entradas' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector(`text=${productName}`, { timeout: 10000 })
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

})

