import express from 'express';
import { verifyAuth } from '../middleware/auth';
import StockController from '../controller/stock';

const router = express.Router();

router.get(
        '/aggs/ticker/:tickerId/:multiplier/:timespan/:from/:to',
        verifyAuth,
        StockController.aggregateStocks
);

router.get('/aggs/stocks/:date', verifyAuth, StockController.groupedDailyStocks);

router.get('/open-close/:ticker/:date', verifyAuth, StockController.getDailyOpenCloseStocks);

router.get('/aggs/ticker/:ticker/prev', verifyAuth, StockController.getPreviousCloseStocks);

export default router;
