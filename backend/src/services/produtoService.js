import db from '../config/database.js';

export const listar = async () => {
  const [produtos] = await db.query('SELECT * FROM produtos ORDER BY nome');
  return produtos;
};

export const buscarPorId = async (id) => {
  const [produtos] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
  return produtos[0];
};

export const criar = async ({ nome, categoria, descricao, unidade_medida }) => {
  const [result] = await db.query(
    'INSERT INTO produtos (nome, categoria, descricao, unidade_medida) VALUES (?, ?, ?, ?)',
    [nome, categoria, descricao, unidade_medida]
  );
  
  return { id: result.insertId, nome, categoria, descricao, unidade_medida };
};

export const atualizar = async (id, { nome, categoria, descricao, unidade_medida }) => {
  const [result] = await db.query(
    'UPDATE produtos SET nome = ?, categoria = ?, descricao = ?, unidade_medida = ? WHERE id = ?',
    [nome, categoria, descricao, unidade_medida, id]
  );
  
  if (result.affectedRows === 0) return null;
  
  return buscarPorId(id);
};

export const deletar = async (id) => {
  const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
