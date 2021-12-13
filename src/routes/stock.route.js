import express from 'express';
import { verifyAuth } from '../middleware/auth';
import StockController from '../controller/stock.controller';

const router = express.Router();

router.get(
        '/aggs/ticker/:symbol/range/:multiplier/:timespan/:from/:to',
        verifyAuth,
        StockController.aggregateBars
);

router.get('/aggs/grouped/locale/us/market/stocks/:date', verifyAuth, StockController.groupedDaily);

router.get('/open-close/:ticker/:date', verifyAuth, StockController.dailyOpenClose);

router.get('/aggs/ticker/:ticker/prev', verifyAuth, StockController.previousClose);

export default router;
