import * as alertaService from '../services/alertaService.js';

export const listarLotesVencendo = async (req, res) => {
  try {
    const dias = req.query.dias || 30;
    const lotes = await alertaService.listarLotesVencendo(dias);
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarLotesVencidos = async (req, res) => {
  try {
    const lotes = await alertaService.listarLotesVencidos();
    res.json(lotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const contarAlertas = async (req, res) => {
  try {
    const contadores = await alertaService.contarAlertas();
    res.json(contadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
