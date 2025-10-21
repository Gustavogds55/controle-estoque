import * as loteService from '../services/loteService.js';

export const listar = async (req, res) => {
  try {
    const lotes = await loteService.listar();
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const lote = await loteService.buscarPorId(req.params.id);
    if (!lote) {
      return res.status(404).json({ error: 'Lote não encontrado' });
    }
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorProduto = async (req, res) => {
  try {
    const lotes = await loteService.buscarPorProduto(req.params.produtoId);
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { produto_id, numero_lote, quantidade_inicial, data_entrada, data_validade } = req.body;

    if (!produto_id || !numero_lote || quantidade_inicial === undefined || !data_entrada || !data_validade) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const lote = await loteService.criar({ produto_id, numero_lote, quantidade_inicial, data_entrada, data_validade });
    res.status(201).json(lote);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Número de lote já existe para este produto' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade } = req.body;
    const lote = await loteService.atualizar(req.params.id, { numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade });
    
    if (!lote) {
      return res.status(404).json({ error: 'Lote não encontrado' });
    }
    
    res.json(lote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const deletado = await loteService.deletar(req.params.id);
    
    if (!deletado) {
      return res.status(404).json({ error: 'Lote não encontrado' });
    }
    
    res.json({ message: 'Lote deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
