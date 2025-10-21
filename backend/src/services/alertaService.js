import db from '../config/database.js';

export const listarLotesVencendo = async (dias = 30) => {
  const [lotes] = await db.query(`
    SELECT l.*, p.nome as produto_nome, p.categoria, p.unidade_medida,
           DATEDIFF(l.data_validade, CURDATE()) as dias_restantes
    FROM lotes l
    INNER JOIN produtos p ON l.produto_id = p.id
    WHERE l.quantidade_atual > 0
      AND DATEDIFF(l.data_validade, CURDATE()) <= ?
    ORDER BY l.data_validade ASC
  `, [dias]);
  
  return lotes;
};

export const listarLotesVencidos = async () => {
  const [lotes] = await db.query(`
    SELECT l.*, p.nome as produto_nome, p.categoria, p.unidade_medida,
           DATEDIFF(l.data_validade, CURDATE()) as dias_restantes
    FROM lotes l
    INNER JOIN produtos p ON l.produto_id = p.id
    WHERE l.quantidade_atual > 0
      AND l.data_validade < CURDATE()
    ORDER BY l.data_validade ASC
  `);
  
  return lotes;
};

export const contarAlertas = async () => {
  const [result] = await db.query(`
    SELECT 
      COUNT(CASE WHEN DATEDIFF(data_validade, CURDATE()) < 0 THEN 1 END) as vencidos,
      COUNT(CASE WHEN DATEDIFF(data_validade, CURDATE()) BETWEEN 0 AND 7 THEN 1 END) as vence_7_dias,
      COUNT(CASE WHEN DATEDIFF(data_validade, CURDATE()) BETWEEN 8 AND 15 THEN 1 END) as vence_15_dias,
      COUNT(CASE WHEN DATEDIFF(data_validade, CURDATE()) BETWEEN 16 AND 30 THEN 1 END) as vence_30_dias
    FROM lotes
    WHERE quantidade_atual > 0
  `);
  
  return result[0];
};
