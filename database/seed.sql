-- ============================================
-- DADOS DE EXEMPLO
-- ============================================

USE controle_estoque;

-- Usuários de exemplo (senha: 123456)
INSERT INTO usuarios (nome, email, senha) VALUES
('Administrador', 'admin@estoque.com', '$2b$10$kZMvFEuzbVkS1RVSlLoENe6sua2qXn/fYZritvn3ghM7pfkzDqqnW'),
('João Silva', 'joao@estoque.com', '$2b$10$kZMvFEuzbVkS1RVSlLoENe6sua2qXn/fYZritvn3ghM7pfkzDqqnW');

-- Produtos de exemplo
INSERT INTO produtos (nome, categoria, descricao, unidade_medida) VALUES
('Paracetamol 500mg', 'Medicamentos', 'Analgésico e antitérmico', 'UN'),
('Leite Integral', 'Laticínios', 'Leite integral 1L', 'UN'),
('Arroz Branco', 'Alimentos', 'Arroz branco tipo 1', 'KG'),
('Dipirona 500mg', 'Medicamentos', 'Analgésico e antitérmico', 'UN'),
('Iogurte Natural', 'Laticínios', 'Iogurte natural 170g', 'UN');

-- Lotes de exemplo
INSERT INTO lotes (produto_id, numero_lote, quantidade_inicial, quantidade_atual, data_entrada, data_validade) VALUES
(1, 'LOTE001', 100, 85, '2024-01-15', '2025-06-30'),
(2, 'LOTE002', 50, 30, '2024-01-20', '2024-02-15'),
(3, 'LOTE003', 200, 180, '2024-01-10', '2025-12-31'),
(4, 'LOTE004', 80, 80, '2024-01-25', '2024-03-01'),
(5, 'LOTE005', 60, 45, '2024-01-18', '2024-02-10');

-- Movimentações de exemplo
INSERT INTO movimentacoes (lote_id, usuario_id, tipo, quantidade, observacao) VALUES
(1, 1, 'SAIDA', 15, 'Venda para cliente'),
(2, 1, 'SAIDA', 20, 'Venda para cliente'),
(3, 2, 'SAIDA', 20, 'Venda para cliente'),
(5, 2, 'SAIDA', 15, 'Venda para cliente');
