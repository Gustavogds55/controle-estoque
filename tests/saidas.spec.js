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

  test('deve exibir observação na tabela', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Obs ' + timestamp
    const numeroLote = 'LOTE-OBS-' + timestamp
    const observacao = 'Observação de teste ' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('55555', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('10')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.preencherObservacao(observacao)
    await saidasPage.salvar()

    await expect(page.getByText(observacao)).toBeVisible()

    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve zerar estoque após saída total', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Zerar ' + timestamp
    const numeroLote = 'LOTE-ZERO-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('66666', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('50')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    await page.getByRole('link', { name: 'Lotes' }).click()
    const loteRow = page.locator('tr', { hasText: numeroLote })
    await expect(loteRow.locator('td').nth(2)).toHaveText('0.00')

    await page.getByRole('link', { name: 'Saídas' }).click()
    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve processar múltiplas saídas do mesmo lote', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Multi ' + timestamp
    const numeroLote = 'LOTE-MULTI-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('77777', 1, '100', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('20')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('30')
    await saidasPage.preencherDataHora('2024-01-17T10:00')
    await saidasPage.salvar()

    await page.getByRole('link', { name: 'Lotes' }).click()
    const loteRow = page.locator('tr', { hasText: numeroLote })
    await expect(loteRow.locator('td').nth(2)).toHaveText('50.00')

    await page.getByRole('link', { name: 'Saídas' }).click()
    const rows = page.locator('tr', { hasText: productName })
    await expect(rows).toHaveCount(2)

    await rows.first().locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
    await rows.first().locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir quantidade negativa em vermelho na tabela', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Negativo ' + timestamp
    const numeroLote = 'LOTE-NEG-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('88888', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('20')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    const quantidadeCell = page.locator('tr', { hasText: productName }).first().locator('td').nth(3)
    await expect(quantidadeCell).toHaveText('-20')
    await expect(quantidadeCell).toHaveClass(/text-red-600/)

    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve exibir nome do produto na tabela de saídas', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Exibir ' + timestamp
    const numeroLote = 'LOTE-EXIB-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('99999', 1, '50', '2024-01-15T10:00', '')
    await entradasPage.salvar()

    await page.getByRole('link', { name: 'Saídas' }).click()
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.selecionarLote(numeroLote)
    await saidasPage.preencherQuantidade('15')
    await saidasPage.preencherDataHora('2024-01-16T10:00')
    await saidasPage.salvar()

    await expect(page.getByText(productName).first()).toBeVisible()
    await expect(page.getByText(numeroLote).first()).toBeVisible()

    const saidaRow = page.locator('tr', { hasText: productName }).first()
    await saidaRow.locator('button[title="Excluir"]').click()

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
    await page.waitForTimeout(500)
  })

  test('deve listar apenas lotes com estoque disponível no select', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await page.waitForTimeout(1000)
    const options = await page.locator('select option').count()
    await expect(options).toBeGreaterThan(1)
  })
})
