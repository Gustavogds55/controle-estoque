import db from '../config/database.js';

export const listar = async (filtros = {}) => {
  let query = `
    SELECT m.*, l.numero_lote, p.nome as produto_nome, u.nome as usuario_nome, f.nome as fornecedor_nome
    FROM movimentacoes m
    INNER JOIN lotes l ON m.lote_id = l.id
    INNER JOIN produtos p ON l.produto_id = p.id
    INNER JOIN usuarios u ON m.usuario_id = u.id
    LEFT JOIN fornecedores f ON m.fornecedor_id = f.id
    WHERE 1=1
  `;
  const params = [];

  if (filtros.tipo) {
    query += ' AND m.tipo = ?';
    params.push(filtros.tipo);
  }

  if (filtros.lote_id) {
    query += ' AND m.lote_id = ?';
    params.push(filtros.lote_id);
  }

  if (filtros.produto_id) {
    query += ' AND l.produto_id = ?';
    params.push(filtros.produto_id);
  }

  query += ' ORDER BY m.data_movimentacao DESC';

  const [movimentacoes] = await db.query(query, params);
  return movimentacoes;
};

export const buscarPorId = async (id) => {
  const [movimentacoes] = await db.query(`
    SELECT m.*, l.numero_lote, p.nome as produto_nome, u.nome as usuario_nome, f.nome as fornecedor_nome
    FROM movimentacoes m
    INNER JOIN lotes l ON m.lote_id = l.id
    INNER JOIN produtos p ON l.produto_id = p.id
    INNER JOIN usuarios u ON m.usuario_id = u.id
    LEFT JOIN fornecedores f ON m.fornecedor_id = f.id
    WHERE m.id = ?
  `, [id]);
  return movimentacoes[0];
};

export const criar = async ({ lote_id, usuario_id, tipo, quantidade, data_movimentacao, observacao, fornecedor_id }) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const [lotes] = await connection.query('SELECT quantidade_atual FROM lotes WHERE id = ?', [lote_id]);
    if (!lotes[0]) throw new Error('Lote não encontrado');

    const quantidadeAtual = parseFloat(lotes[0].quantidade_atual);
    const quantidadeMovimentacao = parseFloat(quantidade);
    let novaQuantidade;

    if (tipo === 'ENTRADA') {
      novaQuantidade = quantidadeAtual + quantidadeMovimentacao;
    } else if (tipo === 'SAIDA') {
      if (quantidadeAtual < quantidadeMovimentacao) {
        throw new Error('Quantidade insuficiente em estoque');
      }
      novaQuantidade = quantidadeAtual - quantidadeMovimentacao;
    } else {
      throw new Error('Tipo de movimentação inválido');
    }

    const [result] = await connection.query(
      `INSERT INTO movimentacoes (lote_id, usuario_id, tipo, quantidade, data_movimentacao, observacao, fornecedor_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [lote_id, usuario_id, tipo, quantidade, data_movimentacao, observacao, fornecedor_id]
    );

    await connection.query(
      'UPDATE lotes SET quantidade_atual = ? WHERE id = ?',
      [novaQuantidade, lote_id]
    );

    await connection.commit();
    return buscarPorId(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const atualizar = async (id, { quantidade, data_movimentacao, observacao, fornecedor_id }) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const [movimentacoes] = await connection.query('SELECT * FROM movimentacoes WHERE id = ?', [id]);
    if (!movimentacoes[0]) {
      await connection.rollback();
      return null;
    }

    const movimentacaoAtual = movimentacoes[0];
    const [lotes] = await connection.query('SELECT quantidade_atual FROM lotes WHERE id = ?', [movimentacaoAtual.lote_id]);
    
    if (!lotes[0]) {
      await connection.rollback();
      throw new Error('Lote não encontrado');
    }

    let novaQuantidadeLote = parseFloat(lotes[0].quantidade_atual);

    if (quantidade !== undefined && parseFloat(quantidade) !== parseFloat(movimentacaoAtual.quantidade)) {
      const quantidadeAnterior = parseFloat(movimentacaoAtual.quantidade);
      const quantidadeNova = parseFloat(quantidade);
      
      if (movimentacaoAtual.tipo === 'ENTRADA') {
        novaQuantidadeLote = novaQuantidadeLote - quantidadeAnterior + quantidadeNova;
      } else {
        novaQuantidadeLote = novaQuantidadeLote + quantidadeAnterior - quantidadeNova;
      }
      
      if (novaQuantidadeLote < 0) {
        throw new Error('Quantidade insuficiente em estoque');
      }

      await connection.query('UPDATE lotes SET quantidade_atual = ? WHERE id = ?', [novaQuantidadeLote, movimentacaoAtual.lote_id]);
    }

    const updates = [];
    const params = [];

    if (quantidade !== undefined) {
      updates.push('quantidade = ?');
      params.push(quantidade);
    }
    if (data_movimentacao) {
      updates.push('data_movimentacao = ?');
      params.push(data_movimentacao);
    }
    if (observacao !== undefined) {
      updates.push('observacao = ?');
      params.push(observacao);
    }
    if (fornecedor_id !== undefined) {
      updates.push('fornecedor_id = ?');
      params.push(fornecedor_id);
    }

    if (updates.length > 0) {
      params.push(id);
      await connection.query(`UPDATE movimentacoes SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    await connection.commit();
    return buscarPorId(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deletar = async (id) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Buscar movimentação antes de deletar
    const [movimentacoes] = await connection.query(
      'SELECT * FROM movimentacoes WHERE id = ?', 
      [id]
    );
    
    if (!movimentacoes[0]) {
      await connection.rollback();
      return false;
    }

    const movimentacao = movimentacoes[0];

    // Buscar quantidade atual do lote
    const [lotes] = await connection.query(
      'SELECT quantidade_atual FROM lotes WHERE id = ?', 
      [movimentacao.lote_id]
    );

    if (!lotes[0]) {
      await connection.rollback();
      throw new Error('Lote não encontrado');
    }

    const quantidadeAtual = parseFloat(lotes[0].quantidade_atual);
    const quantidadeMovimentacao = parseFloat(movimentacao.quantidade);
    let novaQuantidade;

    // Reverter a movimentação
    if (movimentacao.tipo === 'ENTRADA') {
      // Se foi ENTRADA, ao deletar devemos DIMINUIR o estoque
      novaQuantidade = quantidadeAtual - quantidadeMovimentacao;
      if (novaQuantidade < 0) {
        throw new Error('Não é possível deletar: estoque ficaria negativo');
      }
    } else {
      // Se foi SAIDA, ao deletar devemos AUMENTAR o estoque
      novaQuantidade = quantidadeAtual + quantidadeMovimentacao;
    }

    // Atualizar quantidade do lote
    await connection.query(
      'UPDATE lotes SET quantidade_atual = ? WHERE id = ?',
      [novaQuantidade, movimentacao.lote_id]
    );

    // Deletar movimentação
    await connection.query('DELETE FROM movimentacoes WHERE id = ?', [id]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
