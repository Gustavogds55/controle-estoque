import db from '../config/database.js';

export const listar = async () => {
  const [fornecedores] = await db.query('SELECT * FROM fornecedores ORDER BY nome');
  return fornecedores;
};

export const buscarPorId = async (id) => {
  const [fornecedores] = await db.query('SELECT * FROM fornecedores WHERE id = ?', [id]);
  return fornecedores[0];
};

export const criar = async ({ nome, cnpj, telefone, email, endereco }) => {
  const [result] = await db.query(
    'INSERT INTO fornecedores (nome, cnpj, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)',
    [nome, cnpj, telefone, email, endereco]
  );
  return buscarPorId(result.insertId);
};

export const atualizar = async (id, { nome, cnpj, telefone, email, endereco }) => {
  await db.query(
    'UPDATE fornecedores SET nome = ?, cnpj = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?',
    [nome, cnpj, telefone, email, endereco, id]
  );
  return buscarPorId(id);
};

export const deletar = async (id) => {
  const [result] = await db.query('DELETE FROM fornecedores WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
