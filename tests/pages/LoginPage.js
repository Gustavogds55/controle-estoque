export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('submit-button');
    this.errorMessage = page.getByText('Email ou senha inválidos');
    this.loadingText = page.getByText('Entrando...');
  }

  async goto() {
    await this.page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async isEmailValid() {
    return await this.emailInput.evaluate(el => el.validity.valid);
  }

  async isButtonDisabled() {
    return await this.submitButton.isDisabled();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }

  async isLoadingTextVisible() {
    return await this.loadingText.isVisible();
  }
}
