import * as movimentacaoService from '../services/movimentacaoService.js';

export const listar = async (req, res) => {
  try {
    const filtros = {
      tipo: req.query.tipo,
      lote_id: req.query.lote_id,
      produto_id: req.query.produto_id
    };
    const movimentacoes = await movimentacaoService.listar(filtros);
    res.json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const movimentacao = await movimentacaoService.buscarPorId(req.params.id);
    if (!movimentacao) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }
    res.json(movimentacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { lote_id, tipo, quantidade, data_movimentacao, observacao, fornecedor_id } = req.body;
    
    if (!lote_id || !tipo || !quantidade || !data_movimentacao) {
      return res.status(400).json({ error: 'Campos obrigatórios: lote_id, tipo, quantidade, data_movimentacao' });
    }

    if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo deve ser ENTRADA ou SAIDA' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
    }

    const movimentacao = await movimentacaoService.criar({
      lote_id,
      usuario_id: req.userId,
      tipo,
      quantidade,
      data_movimentacao,
      observacao,
      fornecedor_id
    });

    res.status(201).json(movimentacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { quantidade, data_movimentacao, observacao, fornecedor_id } = req.body;
    const movimentacao = await movimentacaoService.atualizar(req.params.id, {
      quantidade,
      data_movimentacao,
      observacao,
      fornecedor_id
    });
    if (!movimentacao) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }
    res.json(movimentacao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const sucesso = await movimentacaoService.deletar(req.params.id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
