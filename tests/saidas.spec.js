const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./pages/LoginPage')
const { SaidasPage } = require('./pages/SaidasPage')
const { EntradasPage } = require('./pages/EntradasPage')

test.describe('Saídas de Estoque', () => {
  let loginPage
  let saidasPage
  let entradasPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    saidasPage = new SaidasPage(page)
    entradasPage = new EntradasPage(page)
    
    await loginPage.goto()
    await loginPage.login('admin@estoque.com', '123456')
    await page.getByRole('link', { name: 'Saídas' }).click()
  })

  test('deve abrir a tela de saídas', async ({ page }) => {
    await expect(page.getByText('Saídas de Estoque')).toBeVisible()
  })

  test('deve abrir modal de nova saída', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await expect(page.getByRole('heading', { name: 'Nova Saída' })).toBeVisible()
  })

  test('deve fechar modal ao clicar em cancelar', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.cancelar()
    await expect(page.getByText('Saídas de Estoque')).toBeVisible()
  })

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await page.locator('.fixed.inset-0.bg-black').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('heading', { name: 'Nova Saída' })).not.toBeVisible()
  })

  test('deve validar campo "Lote" obrigatório', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.preencherQuantidade('10')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()
    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()
  })

  test('deve validar campo "Quantidade" obrigatório', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Validacao Qtd ' + timestamp
    const numeroLote = 'LOTE-VAL-QTD-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('99999', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await page.waitForTimeout(1000)
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()
    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()
    await saidasPage.cancelar()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve validar campo "Data e Hora" obrigatório', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Validacao Data ' + timestamp
    const numeroLote = 'LOTE-VAL-DATA-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('88888', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await page.waitForTimeout(1000)
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('10')
    await page.locator('input[type="datetime-local"]').clear()
    await saidasPage.salvar()
    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()
    await saidasPage.cancelar()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve cadastrar saída completa', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Saida ' + timestamp
    const numeroLote = 'LOTE-SAIDA-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('11111', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('30')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.preencherObservacao('Teste de saída')
    await saidasPage.salvar()

    await expect(page.getByText('Saída cadastrada com sucesso')).toBeVisible()
    await expect(page.getByText(productName).first()).toBeVisible()

    const row = page.locator('tr', { hasText: productName }).first()
    await row.locator('button[title="Excluir"]').click()
    await expect(page.getByText('Saída excluída com sucesso')).toBeVisible()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve atualizar estoque ao cadastrar saída', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Estoque Saida ' + timestamp
    const numeroLote = 'LOTE-EST-SAIDA-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('22222', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Lotes' }).click()
    const loteRow = page.locator('tr', { hasText: numeroLote })
    await expect(loteRow.locator('td').nth(2)).toHaveText('100.00')

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('25')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    await page.getByRole('link', { name: 'Lotes' }).click()
    await page.waitForTimeout(500)
    await expect(loteRow.locator('td').nth(2)).toHaveText('75.00')

    await page.getByRole('link', { name: 'Saídas' }).click()
    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve reverter estoque ao excluir saída', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Reverter ' + timestamp
    const numeroLote = 'LOTE-REV-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('33333', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('40')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    await page.getByRole('link', { name: 'Lotes' }).click()
    const loteRow = page.locator('tr', { hasText: numeroLote })
    await expect(loteRow.locator('td').nth(2)).toHaveText('60.00')

    await page.getByRole('link', { name: 'Saídas' }).click()
    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()
    await expect(page.getByText('Saída excluída com sucesso')).toBeVisible()

    await page.getByRole('link', { name: 'Lotes' }).click()
    await page.waitForTimeout(1000)
    await expect(loteRow.locator('td').nth(2)).toHaveText('100.00')

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })
})
