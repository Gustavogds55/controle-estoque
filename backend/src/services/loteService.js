import db from '../config/database.js';

export const listar = async () => {
  const [lotes] = await db.query(`
    SELECT l.*, p.nome as produto_nome, p.categoria, p.unidade_medida
    FROM lotes l
    INNER JOIN produtos p ON l.produto_id = p.id
    ORDER BY l.data_validade ASC
  `);
  return lotes;
};

export const buscarPorId = async (id) => {
  const [lotes] = await db.query(`
    SELECT l.*, p.nome as produto_nome, p.categoria, p.unidade_medida
    FROM lotes l
    INNER JOIN produtos p ON l.produto_id = p.id
    WHERE l.id = ?
  `, [id]);
  return lotes[0];
};

export const buscarPorProduto = async (produtoId) => {
  const [lotes] = await db.query(`
    SELECT * FROM lotes WHERE produto_id = ? ORDER BY data_validade ASC
  `, [produtoId]);
  return lotes;
};

export const criar = async ({ produto_id, numero_lote, quantidade_inicial, data_entrada, data_validade }) => {
  const [result] = await db.query(
    `INSERT INTO lotes (produto_id, numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade) 
     VALUES (?, ?, ?, 0, ?, ?)`,
    [produto_id, numero_lote, quantidade_inicial, data_entrada, data_validade]
  );
  
  return buscarPorId(result.insertId);
};

export const atualizar = async (id, { numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade }) => {
  const [result] = await db.query(
    `UPDATE lotes SET numero_lote = ?, quantidade_inicial = ?, quantidade_atual = ?, 
     data_entrada = ?, data_validade = ? WHERE id = ?`,
    [numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade, id]
  );
  
  if (result.affectedRows === 0) return null;
  
  return buscarPorId(id);
};

export const deletar = async (id) => {
  const [result] = await db.query('DELETE FROM lotes WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
