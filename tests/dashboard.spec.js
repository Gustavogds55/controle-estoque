import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Dashboard', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.goto();
    await loginPage.login('admin@estoque.com', '123456');
    await page.waitForURL('http://localhost:3001/dashboard');
  });

  test('deve exibir o dashboard após login', async () => {
    await expect(dashboardPage.heading).toBeVisible();
  });

  test('deve exibir tabela de lotes próximos ao vencimento', async ({ page }) => {
    const hasLotes = await dashboardPage.hasLotesVencendo();
    
    if (hasLotes) {
      await expect(dashboardPage.lotesTable).toBeVisible();
    } else {
      await expect(page.getByText('Nenhum lote próximo ao vencimento')).toBeVisible();
    }
  });

  test('deve navegar para produtos ao clicar em ação rápida', async ({ page }) => {
    await dashboardPage.clickAcaoRapida('Gerenciar Produtos');
    await expect(page).toHaveURL('http://localhost:3001/produtos');
  });

  test('deve navegar para lotes ao clicar em ação rápida', async ({ page }) => {
    await dashboardPage.clickAcaoRapida('Gerenciar Lotes');
    await expect(page).toHaveURL('http://localhost:3001/lotes');
  });

  test('deve entrar em modo de edição de ações rápidas', async () => {
    await dashboardPage.clickEditarAcoes();
    
    const isEditMode = await dashboardPage.isInEditMode();
    expect(isEditMode).toBe(true);
  });

  test('deve sair do modo de edição ao clicar em concluir', async () => {
    await dashboardPage.clickEditarAcoes();
    await dashboardPage.clickEditarAcoes();
    
    const isEditMode = await dashboardPage.isInEditMode();
    expect(isEditMode).toBe(false);
  });

  test('deve abrir modal para adicionar nova ação', async () => {
    await dashboardPage.clickEditarAcoes();
    await dashboardPage.abrirModalNovaAcao();
    
    await expect(dashboardPage.modalTitle).toBeVisible();
  });

  test('deve adicionar nova ação rápida', async ({ page }) => {
    await dashboardPage.clickEditarAcoes();
    await dashboardPage.abrirModalNovaAcao();
    
    await dashboardPage.selecionarFuncionalidade('/entradas');
    await dashboardPage.salvarNovaAcao();
    
    await page.waitForTimeout(500);
    await expect(page.getByText('Registrar Entradas')).toBeVisible();
  });

  test('deve remover ação rápida', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    await dashboardPage.clickEditarAcoes();
    
    const initialCount = await page.locator('a[href]').count();
    
    await dashboardPage.removerAcao(0);
    
    await page.waitForTimeout(500);
    
    const finalCount = await page.locator('a[href]').count();
    expect(finalCount).toBeLessThan(initialCount);
  });

  test('deve persistir ações rápidas após novo login', async ({ page }) => {
    await dashboardPage.clickEditarAcoes();
    await dashboardPage.abrirModalNovaAcao();
    
    await dashboardPage.selecionarFuncionalidade('/saidas');
    await dashboardPage.salvarNovaAcao();
    
    await expect(page.getByText('Registrar Saídas')).toBeVisible();
    
    await page.goto('http://localhost:3001/login');
    await loginPage.login('admin@estoque.com', '123456');
    await page.waitForURL('http://localhost:3001/dashboard');
    
    await expect(page.getByText('Registrar Saídas')).toBeVisible();
  });

  test('deve alternar entre modo claro e escuro', async ({ page }) => {
    const container = page.locator('div.min-h-screen').first();
    const themeButton = page.getByTestId('theme-toggle');
    
    await expect(container).toHaveClass(/bg-purple-50/);
    
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(container).toHaveClass(/bg-gray-900/);
    
    await themeButton.click();
    await page.waitForTimeout(300);
    await expect(container).toHaveClass(/bg-purple-50/);
  });
});
