import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('deve fazer login com sucesso', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await expect(page.getByText('Controle de Estoque')).toBeVisible();
    
    await page.getByTestId('email-input').fill('admin@estoque.com');
    await page.getByTestId('password-input').fill('123456');
    
    await page.getByTestId('submit-button').click();
    
    await page.waitForURL('http://localhost:3001/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('deve mostrar erro com email incorreto', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('emailinexistente@teste.com');
    await page.getByTestId('password-input').fill('123456');
    
    await page.getByTestId('submit-button').click();
    
    await expect(page.getByText('Email ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('deve mostrar erro com senha incorreta', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('admin@estoque.com');
    await page.getByTestId('password-input').fill('senhaerrada');
    
    await page.getByTestId('submit-button').click();
    
    await expect(page.getByText('Email ou senha inválidos')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar campos obrigatórios - ambos vazios', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar email vazio', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar senha vazia', async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    
    await page.fill('input[type="email"]', 'admin@estoque.com');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3001/login');
  });

  test('deve validar formato de email inválido', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('emailinvalido');
    await page.getByTestId('password-input').fill('123456');
    
    const isInvalid = await page.getByTestId('email-input').evaluate(el => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('deve desabilitar botão durante o login', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('admin@estoque.com');
    await page.getByTestId('password-input').fill('123456');
    
    const submitButton = page.getByTestId('submit-button');
    
    await submitButton.click();
    
    await expect(submitButton).toBeDisabled();
  });

  test('deve mostrar texto "Entrando..." durante o login', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('admin@estoque.com');
    await page.getByTestId('password-input').fill('123456');
    
    await page.getByTestId('submit-button').click();
    
    await expect(page.getByText('Entrando...')).toBeVisible();
  });

  test('deve limpar mensagem de erro ao tentar novamente', async ({ page }) => {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    
    await page.getByTestId('email-input').fill('invalido@teste.com');
    await page.getByTestId('password-input').fill('senhaerrada');
    await page.getByTestId('submit-button').click();
    
    await expect(page.getByText('Email ou senha inválidos')).toBeVisible();
    
    await page.getByTestId('email-input').fill('admin@estoque.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('submit-button').click();
    
    await page.waitForURL('http://localhost:3001/dashboard', { timeout: 10000 });
  });
});
