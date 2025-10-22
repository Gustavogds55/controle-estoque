import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { SaidasPage } from './pages/SaidasPage'
import { EntradasPage } from './pages/EntradasPage'

test.describe('Saídas', () => {
  let loginPage
  let saidasPage
  let entradasPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    saidasPage = new SaidasPage(page)
    entradasPage = new EntradasPage(page)

    await page.goto('http://localhost:3000/login')
    await loginPage.login('admin@teste.com', 'senha123')
    await page.waitForURL('**/dashboard')
    await page.getByRole('link', { name: 'Saídas' }).click()
  })

  test('deve exibir página de saídas', async ({ page }) => {
    await expect(page.getByText('Saídas de Estoque')).toBeVisible()
    await expect(page.getByRole('button', { name: '+ Nova Saída' })).toBeVisible()
  })

  test('deve abrir modal de nova saída', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await expect(page.getByText('Nova Saída')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
  })

  test('deve fechar modal ao clicar em cancelar', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await saidasPage.cancelar()
    await expect(page.getByText('Nova Saída')).not.toBeVisible()
  })

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    await page.locator('.fixed.inset-0.bg-black').click({ position: { x: 10, y: 10 } })
    await expect(page.getByText('Nova Saída')).not.toBeVisible()
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

    await page.getByRole('link', { name: 'Lotes' }).click()
    await page.waitForTimeout(500)
    await expect(loteRow.locator('td').nth(2)).toHaveText('100.00')

    await page.getByRole('link', { name: 'Entradas' }).click()
    const entradaRow = page.locator('tr', { hasText: productName }).first()
    page.once('dialog', dialog => dialog.accept())
    await entradaRow.locator('button[title="Excluir"]').click()
  })

  test('deve exibir quantidade negativa em vermelho', async ({ page }) => {
    const timestamp = Date.now()
    const productName = 'Produto Visual ' + timestamp
    const numeroLote = 'LOTE-VIS-' + timestamp

    await page.getByRole('link', { name: 'Entradas' }).click()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN')
    await entradasPage.preencherLote(numeroLote, '2025-12-31')
    await entradasPage.preencherEntrada('44444', 1, '50', '2024-01-15T10:00', '')
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
  })

  test('deve listar apenas lotes com estoque disponível', async ({ page }) => {
    await saidasPage.abrirModalNovaSaida()
    const options = await page.locator('select option').count()
    await expect(options).toBeGreaterThan(1)
  })
})
