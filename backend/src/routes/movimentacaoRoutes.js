import express from 'express';
import * as movimentacaoController from '../controllers/movimentacaoController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Gerenciamento de movimentações de estoque
 */

/**
 * @swagger
 * /api/movimentacoes:
 *   get:
 *     summary: Lista todas as movimentações
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ENTRADA, SAIDA]
 *         description: Filtrar por tipo de movimentação
 *       - in: query
 *         name: lote_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do lote
 *       - in: query
 *         name: produto_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do produto
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, movimentacaoController.listar);

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   get:
 *     summary: Busca uma movimentação por ID
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movimentação encontrada
 *       404:
 *         description: Movimentação não encontrada
 */
router.get('/:id', authMiddleware, movimentacaoController.buscarPorId);

/**
 * @swagger
 * /api/movimentacoes:
 *   post:
 *     summary: Cria uma nova movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lote_id
 *               - tipo
 *               - quantidade
 *               - data_movimentacao
 *             properties:
 *               lote_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [ENTRADA, SAIDA]
 *               quantidade:
 *                 type: number
 *               data_movimentacao:
 *                 type: string
 *                 format: date-time
 *               observacao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimentação criada
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, movimentacaoController.criar);

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   put:
 *     summary: Atualiza uma movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade:
 *                 type: number
 *               data_movimentacao:
 *                 type: string
 *                 format: date-time
 *               observacao:
 *                 type: string
 *               fornecedor_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movimentação atualizada
 *       404:
 *         description: Movimentação não encontrada
 */
router.put('/:id', authMiddleware, movimentacaoController.atualizar);

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   delete:
 *     summary: Deleta uma movimentação
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Movimentação deletada
 *       404:
 *         description: Movimentação não encontrada
 */
router.delete('/:id', authMiddleware, movimentacaoController.deletar);

export default router;
