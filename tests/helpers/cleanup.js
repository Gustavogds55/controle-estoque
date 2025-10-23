/**
 * Helper para limpeza de dados de teste
 */

export class TestCleanup {
  constructor(page) {
    this.page = page
    this.createdItems = {
      entradas: [],
      saidas: [],
      fornecedores: []
    }
  }

  register(type, identifier) {
    if (this.createdItems[type]) {
      this.createdItems[type].push(identifier)
    }
  }

  async cleanAll() {
    for (const productName of this.createdItems.saidas) {
      await this.deleteSaida(productName)
    }

    for (const productName of this.createdItems.entradas) {
      await this.deleteEntrada(productName)
    }

    for (const fornecedorName of this.createdItems.fornecedores) {
      await this.deleteFornecedor(fornecedorName)
    }
  }

  async deleteSaida(productName) {
    try {
      await this.page.goto('http://localhost:3001/saidas')
      await this.page.waitForTimeout(500)
      
      const saidaRow = this.page.locator('tr', { hasText: productName }).first()
      const exists = await saidaRow.count() > 0
      
      if (exists) {
        await saidaRow.locator('button[title="Excluir"]').click()
        await this.page.waitForTimeout(300)
      }
    } catch (error) {
      console.log(`Erro ao deletar saída ${productName}:`, error.message)
    }
  }

  async deleteEntrada(productName) {
    try {
      await this.page.goto('http://localhost:3001/entradas')
      await this.page.waitForTimeout(500)
      
      const entradaRow = this.page.locator('tr', { hasText: productName }).first()
      const exists = await entradaRow.count() > 0
      
      if (exists) {
        this.page.once('dialog', dialog => dialog.accept())
        await entradaRow.locator('button[title="Excluir"]').click()
        await this.page.waitForTimeout(300)
      }
    } catch (error) {
      console.log(`Erro ao deletar entrada ${productName}:`, error.message)
    }
  }

  async deleteFornecedor(fornecedorName) {
    try {
      await this.page.goto('http://localhost:3001/fornecedores')
      await this.page.waitForTimeout(500)
      
      const fornecedorRow = this.page.locator('tr', { hasText: fornecedorName }).first()
      const exists = await fornecedorRow.count() > 0
      
      if (exists) {
        this.page.once('dialog', dialog => dialog.accept())
        await fornecedorRow.locator('button[title="Excluir"]').click()
        await this.page.waitForTimeout(300)
      }
    } catch (error) {
      console.log(`Erro ao deletar fornecedor ${fornecedorName}:`, error.message)
    }
  }
}
