import express from 'express';
import { verifyAuth } from '../middleware/auth';
import StockController from '../controller/stock';

const router = express.Router();

router.get(
        '/aggs/ticker/:tickerId/:multiplier/:timespan/:from/:to',
        StockController.aggregateStocks
);

router.get('/aggs/stocks/:date', StockController.groupedDailyStocks);

router.get('/open-close/:ticker/:date', StockController.getDailyOpenCloseStocks);

router.get('/aggs/ticker/:ticker/prev', StockController.getPreviousCloseStocks);

export default router;
