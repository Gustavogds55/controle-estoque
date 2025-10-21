import express from 'express';
import * as alertaController from '../controllers/alertaController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Alertas
 *   description: Alertas de validade de lotes
 */

/**
 * @swagger
 * /api/alertas/vencendo:
 *   get:
 *     summary: Lista lotes próximos ao vencimento
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Número de dias para considerar próximo ao vencimento
 *     responses:
 *       200:
 *         description: Lista de lotes próximos ao vencimento
 */
router.get('/vencendo', authMiddleware, alertaController.listarLotesVencendo);

/**
 * @swagger
 * /api/alertas/vencidos:
 *   get:
 *     summary: Lista lotes vencidos
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lotes vencidos
 */
router.get('/vencidos', authMiddleware, alertaController.listarLotesVencidos);

/**
 * @swagger
 * /api/alertas/contadores:
 *   get:
 *     summary: Retorna contadores de alertas
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contadores de lotes por status de validade
 */
router.get('/contadores', authMiddleware, alertaController.contarAlertas);

export default router;
