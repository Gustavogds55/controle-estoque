import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const login = async (email, senha) => {
  const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  
  if (users.length === 0) {
    throw new Error('Credenciais inválidas');
  }

  const user = users[0];
  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  };
};

export const register = async (nome, email, senha) => {
  const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  
  if (existing.length > 0) {
    throw new Error('Email já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );

  return { id: result.insertId, nome, email };
};
