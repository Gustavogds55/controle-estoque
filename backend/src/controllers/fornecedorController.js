import * as fornecedorService from '../services/fornecedorService.js';

export const listar = async (req, res) => {
  try {
    const fornecedores = await fornecedorService.listar();
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const fornecedor = await fornecedorService.buscarPorId(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { nome, cnpj, telefone, email, endereco } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const fornecedor = await fornecedorService.criar({ nome, cnpj, telefone, email, endereco });
    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { nome, cnpj, telefone, email, endereco } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const fornecedor = await fornecedorService.atualizar(req.params.id, { nome, cnpj, telefone, email, endereco });
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const sucesso = await fornecedorService.deletar(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
