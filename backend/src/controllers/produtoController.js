import * as produtoService from '../services/produtoService.js';

export const listar = async (req, res) => {
  try {
    const produtos = await produtoService.listar();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const produto = await produtoService.buscarPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { nome, categoria, descricao, unidade_medida } = req.body;

    if (!nome || !unidade_medida) {
      return res.status(400).json({ error: 'Nome e unidade de medida são obrigatórios' });
    }

    const produto = await produtoService.criar({ nome, categoria, descricao, unidade_medida });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { nome, categoria, descricao, unidade_medida } = req.body;
    const produto = await produtoService.atualizar(req.params.id, { nome, categoria, descricao, unidade_medida });
    
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const deletado = await produtoService.deletar(req.params.id);
    
    if (!deletado) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
