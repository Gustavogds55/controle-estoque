import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { EntradasPage } from './pages/EntradasPage';

test.describe.configure({ mode: 'parallel' });

test.describe('Entradas', () => {
  let loginPage;
  let entradasPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    entradasPage = new EntradasPage(page);
    
    await loginPage.goto();
    await loginPage.login('admin@estoque.com', '123456');
    await page.waitForURL('http://localhost:3001/dashboard');
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    await expect(page.getByText('Entrada de Mercadorias')).toBeVisible();
  });

  test('deve exibir página de entradas', async ({ page }) => {
    await expect(page.getByText('Entrada de Mercadorias')).toBeVisible();
  });

  test('deve abrir modal de nova entrada', async () => {
    await entradasPage.abrirModalNovaEntrada();
    await expect(entradasPage.modalTitle).toBeVisible();
  });

  test('deve fechar modal ao clicar em cancelar', async () => {
    await entradasPage.abrirModalNovaEntrada();
    await entradasPage.cancelar();
    await expect(entradasPage.modalTitle).not.toBeVisible();
  });

  test('deve fechar modal ao clicar fora dele', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await expect(entradasPage.modalTitle).toBeVisible();
    
    await page.locator('.fixed.inset-0.bg-black').click({ position: { x: 10, y: 10 } });
    await expect(entradasPage.modalTitle).not.toBeVisible();
  });

  test('deve validar campo obrigatório: nome do produto', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-produto-nome')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: unidade de medida', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-produto-unidade')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: número do lote', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-numero-lote')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: data de validade', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-data-validade')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: número da nota fiscal', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-numero-nf')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: quantidade', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-quantidade')).toHaveText('Este campo é obrigatório');
  });

  test('deve validar campo obrigatório: data e hora', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    await page.getByTestId('produto-nome').fill('Produto Teste');
    await page.getByTestId('produto-unidade').fill('UN');
    await page.getByTestId('numero-lote').fill('LOTE-001');
    await page.getByTestId('data-validade').fill('2025-12-31');
    await page.getByTestId('numero-nf').fill('12345');
    await page.getByTestId('fornecedor-select').selectOption({ index: 1 });
    await page.getByTestId('quantidade').fill('100');
    await page.getByTestId('data-hora').clear();
    
    await entradasPage.salvar();
    await expect(page.getByTestId('error-data-hora')).toHaveText('Este campo é obrigatório');
  });

  test('deve cadastrar nova entrada completa', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    
    const productName = 'Produto E2E ' + Date.now();
    await entradasPage.preencherProduto(productName, 'Categoria Teste', 'UN');
    await entradasPage.preencherLote('LOTE-E2E-' + Date.now(), '2025-12-31');
    await entradasPage.preencherEntrada('12345', 1, '100', '2024-01-15T10:00', 'Teste E2E');
    
    await entradasPage.salvar();
    await expect(page.getByText(productName).first()).toBeVisible();
    
    const row = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button[title="Excluir"]').click();
  });

  test('deve criar lote automaticamente ao cadastrar entrada', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    
    const timestamp = Date.now();
    const productName = 'Produto Lote ' + timestamp;
    const numeroLote = 'LOTE-AUTO-' + timestamp;
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN');
    await entradasPage.preencherLote(numeroLote, '2025-12-31');
    await entradasPage.preencherEntrada('99999', 1, '50', '2024-01-15T10:00', '');
    
    await entradasPage.salvar();
    await expect(page.getByText(productName).first()).toBeVisible();
    
    await page.getByRole('link', { name: 'Lotes' }).click();
    await expect(page.getByText(numeroLote)).toBeVisible();
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    const row = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button[title="Excluir"]').click();
  });

  test('deve criar produto automaticamente ao cadastrar entrada', async ({ page }) => {
    await entradasPage.abrirModalNovaEntrada();
    
    const timestamp = Date.now();
    const productName = 'Produto Auto ' + timestamp;
    await entradasPage.preencherProduto(productName, 'Categoria Auto', 'KG');
    await entradasPage.preencherLote('LOTE-PROD-' + timestamp, '2025-12-31');
    await entradasPage.preencherEntrada('88888', 1, '75', '2024-01-15T10:00', '');
    
    await entradasPage.salvar();
    await expect(page.getByText(productName).first()).toBeVisible();
    
    await page.getByRole('link', { name: 'Produtos' }).click();
    await expect(page.getByText(productName)).toBeVisible();
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    const row = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button[title="Excluir"]').click();
  });

  test('deve atualizar estoque corretamente: entrada → lote → saída', async ({ page }) => {
    const timestamp = Date.now();
    const productName = 'Produto Estoque ' + timestamp;
    const numeroLote = 'LOTE-EST-' + timestamp;
    const quantidadeEntrada = '100';
    const quantidadeSaida = '30';
    
    await entradasPage.abrirModalNovaEntrada();
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN');
    await entradasPage.preencherLote(numeroLote, '2025-12-31');
    await entradasPage.preencherEntrada('11111', 1, quantidadeEntrada, '2024-01-15T10:00', '');
    await entradasPage.salvar();
    
    await page.getByRole('link', { name: 'Lotes' }).click();
    const loteRow = page.locator('tr', { hasText: numeroLote });
    await expect(loteRow.locator('td').nth(2)).toHaveText('100.00');
    
    await page.getByRole('link', { name: 'Saídas' }).click();
    await page.getByRole('button', { name: '+ Nova Saída' }).click();
    const loteValue = await page.locator('select option').filter({ hasText: numeroLote }).getAttribute('value');
    await page.locator('select').selectOption(loteValue);
    await page.locator('input[type="number"]').fill(quantidadeSaida);
    await page.locator('input[type="datetime-local"]').fill('2024-01-16T10:00');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Saída cadastrada com sucesso')).toBeVisible();
    
    await page.getByRole('link', { name: 'Lotes' }).click();
    await page.waitForTimeout(500);
    await expect(loteRow.locator('td').nth(2)).toHaveText('70.00');
    
    await page.getByRole('link', { name: 'Saídas' }).click();
    const saidaRow = page.locator('tr', { hasText: productName }).first();
    await saidaRow.locator('button[title="Excluir"]').click();
    await expect(page.getByText('Saída excluída com sucesso')).toBeVisible();
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    const entradaRow = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await entradaRow.locator('button[title="Excluir"]').click();
  });

  test('deve criar fornecedor durante cadastro de entrada', async ({ page }) => {
    const timestamp = Date.now();
    const productName = 'Produto Forn ' + timestamp;
    const numeroLote = 'LOTE-FORN-' + timestamp;
    const fornecedorNome = 'Fornecedor E2E ' + timestamp;
    
    await entradasPage.abrirModalNovaEntrada();
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN');
    await entradasPage.preencherLote(numeroLote, '2025-12-31');
    
    await page.locator('button', { hasText: '+' }).click();
    await page.locator('input[type="text"]').first().fill(fornecedorNome);
    await page.locator('input[maxlength="18"]').fill('12.345.678/0001-90');
    await page.locator('input[maxlength="15"]').fill('(11) 98765-4321');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page.getByText('Fornecedor cadastrado com sucesso')).toBeVisible();
    
    await page.getByTestId('numero-nf').fill('33333');
    await page.getByTestId('quantidade').fill('80');
    await page.getByTestId('data-hora').fill('2024-01-15T10:00');
    await entradasPage.salvar();
    
    await page.getByRole('link', { name: 'Fornecedores' }).click();
    await expect(page.getByText(fornecedorNome)).toBeVisible();
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    const row = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button[title="Excluir"]').click();
  });

  test('deve excluir lote ao excluir entrada', async ({ page }) => {
    const timestamp = Date.now();
    const productName = 'Produto Del ' + timestamp;
    const numeroLote = 'LOTE-DEL-' + timestamp;
    
    await entradasPage.abrirModalNovaEntrada();
    await entradasPage.preencherProduto(productName, 'Categoria', 'UN');
    await entradasPage.preencherLote(numeroLote, '2025-12-31');
    await entradasPage.preencherEntrada('22222', 1, '50', '2024-01-15T10:00', '');
    await entradasPage.salvar();
    
    await page.getByRole('link', { name: 'Lotes' }).click();
    await expect(page.getByText(numeroLote)).toBeVisible();
    
    await page.getByRole('link', { name: 'Entradas' }).click();
    const row = page.locator('tr', { hasText: productName }).first();
    page.once('dialog', dialog => dialog.accept());
    await row.locator('button[title="Excluir"]').click();
    
    await page.getByRole('link', { name: 'Lotes' }).click();
    await expect(page.getByText(numeroLote)).not.toBeVisible();
  });
});
