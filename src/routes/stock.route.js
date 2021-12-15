import express from 'express';
import StockController from '../controller/stock';

const router = express.Router();

router.get('/stocks/agg', StockController.getAggregateStocks);

router.get('/stocks/:date', StockController.groupedDailyStocks);

router.get('/open-close/:ticker/:date', StockController.getDailyOpenCloseStocks);

router.get('/ticker/:ticker/prev', StockController.getPreviousCloseStocks);

router.get('/ticker/:tickerId', StockController.getStockTickerDetails);

export default router;
