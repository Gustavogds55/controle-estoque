import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    await loginPage.login('admin@estoque.com', '123456');
    
    await page.waitForURL('http://localhost:3001/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('deve mostrar erro com email incorreto', async () => {
    await loginPage.login('emailinexistente@teste.com', '123456');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.page).toHaveURL('http://localhost:3001/login');
  });

  test('deve mostrar erro com senha incorreta', async () => {
    await loginPage.login('admin@estoque.com', 'senhaerrada');
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar campos obrigatórios - ambos vazios', async () => {
    await loginPage.submitButton.click();
    
    await expect(loginPage.page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar email vazio', async () => {
    await loginPage.passwordInput.fill('123456');
    await loginPage.submitButton.click();
    
    await expect(loginPage.page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar senha vazia', async () => {
    await loginPage.emailInput.fill('admin@estoque.com');
    await loginPage.submitButton.click();
    
    await expect(loginPage.page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar formato de email inválido', async () => {
    await loginPage.emailInput.fill('emailinvalido');
    await loginPage.passwordInput.fill('123456');
    
    const isValid = await loginPage.isEmailValid();
    expect(isValid).toBe(false);
  });

  test('deve desabilitar botão durante o login', async () => {
    await loginPage.login('admin@estoque.com', '123456');
    
    await expect(loginPage.submitButton).toBeDisabled();
  });

  test('deve mostrar texto "Entrando..." durante o login', async () => {
    await loginPage.login('admin@estoque.com', '123456');
    
    await expect(loginPage.loadingText).toBeVisible();
  });

  test('deve limpar mensagem de erro ao tentar novamente', async ({ page }) => {
    await loginPage.login('invalido@teste.com', 'senhaerrada');
    await expect(loginPage.errorMessage).toBeVisible();
    
    await loginPage.login('admin@estoque.com', '123456');
    
    await page.waitForURL('http://localhost:3001/dashboard', { timeout: 10000 });
  });
});
