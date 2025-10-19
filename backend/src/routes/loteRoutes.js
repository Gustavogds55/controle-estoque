import express from 'express';
import * as loteController from '../controllers/loteController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', loteController.listar);
router.get('/:id', loteController.buscarPorId);
router.get('/produto/:produtoId', loteController.buscarPorProduto);
router.post('/', loteController.criar);
router.put('/:id', loteController.atualizar);
router.delete('/:id', loteController.deletar);

export default router;
