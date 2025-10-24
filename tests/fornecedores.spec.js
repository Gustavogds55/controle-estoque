const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./pages/LoginPage')
const { FornecedoresPage } = require('./pages/FornecedoresPage')
const { EntradasPage } = require('./pages/EntradasPage')

test.describe('Fornecedores', () => {
  let loginPage
  let fornecedoresPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    fornecedoresPage = new FornecedoresPage(page)
    await loginPage.goto()
    await loginPage.login('admin@estoque.com', '123456')
    await page.waitForLoadState('networkidle')
  })

  test('deve exibir a tela de fornecedores', async ({ page }) => {
    await fornecedoresPage.navigate()
    await expect(page.getByRole('heading', { name: 'Gerenciamento de Fornecedores' })).toBeVisible()
  })

  test('deve abrir modal de novo fornecedor', async ({ page }) => {
    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Novo Fornecedor' })).toBeVisible()
  })

  test('deve fechar modal ao clicar em cancelar', async ({ page }) => {
    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Novo Fornecedor' })).toBeVisible()
    await fornecedoresPage.cancelar()
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Novo Fornecedor' })).not.toBeVisible()
  })

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Novo Fornecedor' })).toBeVisible()
    await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('h3.text-xl.font-bold', { hasText: 'Novo Fornecedor' })).not.toBeVisible()
  })

  test('deve validar campo "Nome" obrigatório', async ({ page }) => {
    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherCNPJ('12345678901234')
    await fornecedoresPage.salvar()
    await expect(page.getByText('Este campo é obrigatório').first()).toBeVisible()
  })

  test('deve validar campo "CNPJ" obrigatório', async ({ page }) => {
    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome('Fornecedor Teste')
    await fornecedoresPage.salvar()
    await expect(page.getByText('Este campo é obrigatório')).toBeVisible()
  })

  test('deve cadastrar fornecedor completo', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Completo ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.preencherTelefone('11987654321')
    await fornecedoresPage.preencherEmail('fornecedor@teste.com')
    await fornecedoresPage.preencherEndereco('Rua Teste, 123')
    await fornecedoresPage.salvar()

    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()
    await expect(page.getByText(nomeFornecedor)).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve formatar CNPJ automaticamente', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor CNPJ ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    
    const cnpjInput = page.getByRole('textbox').nth(1)
    const valorFormatado = await cnpjInput.inputValue()
    expect(valorFormatado).toContain('.')
    expect(valorFormatado).toContain('/')
    expect(valorFormatado).toContain('-')

    await fornecedoresPage.cancelar()
  })

  test('deve formatar telefone automaticamente', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Tel ' + timestamp

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherTelefone('11987654321')
    
    const telefoneInput = page.getByRole('textbox').nth(2)
    const valorFormatado = await telefoneInput.inputValue()
    expect(valorFormatado).toContain('(')
    expect(valorFormatado).toContain(')')
    expect(valorFormatado).toContain('-')

    await fornecedoresPage.cancelar()
  })

  test('deve excluir fornecedor com sucesso', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Excluir ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()

    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()
    await expect(page.getByText(nomeFornecedor)).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
    
    await expect(page.getByText('Fornecedor excluído com sucesso')).toBeVisible()
    await expect(page.getByText(nomeFornecedor)).not.toBeVisible()
  })

  test('deve usar fornecedor cadastrado em uma entrada', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Entrada ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')
    const nomeProduto = 'Produto Teste ' + timestamp
    const numeroLote = 'LOTE' + timestamp

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const entradasPage = new EntradasPage(page)
    await entradasPage.navigate()
    await entradasPage.abrirModalNovaEntrada()
    await entradasPage.preencherNomeProduto(nomeProduto)
    await entradasPage.selecionarCategoria('Alimentos')
    await entradasPage.selecionarUnidadeMedida('kg')
    await entradasPage.preencherNumeroLote(numeroLote)
    await entradasPage.preencherDataValidade('2025-12-31')
    await entradasPage.preencherNumeroNF('12345')
    await entradasPage.selecionarFornecedor(nomeFornecedor)
    await entradasPage.preencherQuantidade('10')
    await entradasPage.preencherDataHora('2024-01-01T10:00')
    await entradasPage.salvar()
    await page.waitForTimeout(1000)

    await expect(page.getByText(nomeProduto)).toBeVisible()

    await entradasPage.excluirEntrada(nomeProduto)
    await page.waitForTimeout(500)
    await fornecedoresPage.navigate()
    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve editar nome do fornecedor', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Editar Nome ' + timestamp
    const novoNome = 'Nome Editado ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const fornecedorRow = page.locator('tr', { hasText: nomeFornecedor })
    await fornecedorRow.locator('button[title="Editar"]').click()
    await page.getByRole('textbox').nth(0).fill(novoNome)
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Fornecedor atualizado com sucesso')).toBeVisible()
    await expect(page.getByText(novoNome)).toBeVisible()

    await fornecedoresPage.excluirFornecedor(novoNome)
    await page.waitForTimeout(500)
  })

  test('deve editar CNPJ do fornecedor', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Editar CNPJ ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')
    const novoCnpj = (timestamp + 1).toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const fornecedorRow = page.locator('tr', { hasText: nomeFornecedor })
    await fornecedorRow.locator('button[title="Editar"]').click()
    await page.getByRole('textbox').nth(1).fill(novoCnpj)
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Fornecedor atualizado com sucesso')).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve editar telefone do fornecedor', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Editar Tel ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.preencherTelefone('11987654321')
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const fornecedorRow = page.locator('tr', { hasText: nomeFornecedor })
    await fornecedorRow.locator('button[title="Editar"]').click()
    await page.getByRole('textbox').nth(2).fill('11999887766')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Fornecedor atualizado com sucesso')).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve editar email do fornecedor', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Editar Email ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.preencherEmail('antigo@teste.com')
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const fornecedorRow = page.locator('tr', { hasText: nomeFornecedor })
    await fornecedorRow.locator('button[title="Editar"]').click()
    await page.getByRole('textbox').nth(3).fill('novo@teste.com')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Fornecedor atualizado com sucesso')).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve editar endereço do fornecedor', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Editar End ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.preencherEndereco('Rua Antiga, 100')
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()

    const fornecedorRow = page.locator('tr', { hasText: nomeFornecedor })
    await fornecedorRow.locator('button[title="Editar"]').click()
    await page.getByRole('textbox').nth(4).fill('Rua Nova, 200')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByText('Fornecedor atualizado com sucesso')).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve cadastrar fornecedor apenas com campos obrigatórios', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Minimo ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()

    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()
    await expect(page.getByText(nomeFornecedor)).toBeVisible()

    await fornecedoresPage.excluirFornecedor(nomeFornecedor)
    await page.waitForTimeout(500)
  })

  test('deve formatar CPF automaticamente', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor CPF ' + timestamp
    const cpf = timestamp.toString().slice(-11).padStart(11, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cpf)
    
    const cpfInput = page.getByRole('textbox').nth(1)
    const valorFormatado = await cpfInput.inputValue()
    expect(valorFormatado).toContain('.')
    expect(valorFormatado).toContain('-')
    expect(valorFormatado).not.toContain('/')

    await fornecedoresPage.cancelar()
  })

  test('deve exibir tabela com colunas corretas', async ({ page }) => {
    await fornecedoresPage.navigate()
    await expect(page.locator('th:has-text("Nome")')).toBeVisible()
    await expect(page.locator('th:has-text("CNPJ")')).toBeVisible()
    await expect(page.locator('th:has-text("Telefone")')).toBeVisible()
    await expect(page.locator('th:has-text("Email")')).toBeVisible()
    await expect(page.locator('th:has-text("Ações")')).toBeVisible()
  })

  test('deve impedir cadastro de CNPJ duplicado', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor1 = 'Fornecedor 1 ' + timestamp
    const nomeFornecedor2 = 'Fornecedor 2 ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor1)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible()
    await expect(page.getByText(nomeFornecedor1)).toBeVisible()

    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor2)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.salvar()
    await page.waitForTimeout(500)

    await expect(page.getByText(nomeFornecedor2)).not.toBeVisible()

    await fornecedoresPage.cancelar()
    await fornecedoresPage.excluirFornecedor(nomeFornecedor1)
    await page.waitForTimeout(500)
  })

  test('deve validar formato de email inválido', async ({ page }) => {
    const timestamp = Date.now()
    const nomeFornecedor = 'Fornecedor Email ' + timestamp
    const cnpj = timestamp.toString().padStart(14, '0')

    await fornecedoresPage.navigate()
    await fornecedoresPage.abrirModalNovoFornecedor()
    await fornecedoresPage.preencherNome(nomeFornecedor)
    await fornecedoresPage.preencherCNPJ(cnpj)
    await fornecedoresPage.preencherEmail('emailinvalido')
    await fornecedoresPage.salvar()

    const emailInput = page.getByRole('textbox').nth(3)
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage)
    expect(validationMessage).toBeTruthy()

    await fornecedoresPage.cancelar()
  })
})
