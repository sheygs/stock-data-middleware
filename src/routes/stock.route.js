import express from 'express';
import StockController from '../controller/stock';
import validator from '../utils/inputValidators';

const router = express.Router();

router.get(
        '/stocks/agg',
        validator.validateTicker,
        validator.validateStartDate,
        validator.validateEndDate,
        validator.validationHandler,
        StockController.getAggregateStocks
);

router.get(
        '/stocks',
        validator.validateGetStocks,
        validator.validationHandler,
        StockController.groupedDailyStocks
);

router.get(
        '/open-close/:ticker/:date',
        validator.validateDailyOpenCloseDate,
        validator.validateDailyOpenCloseTicker,
        validator.validationHandler,
        StockController.getDailyOpenCloseStocks
);

router.get(
        '/ticker/:ticker/prev',
        validator.validateDailyOpenCloseTicker,
        validator.validationHandler,
        StockController.getPreviousCloseStocks
);

router.get(
        '/ticker/:ticker',
        validator.validateDailyOpenCloseTicker,
        validator.validationHandler,
        StockController.getStockTickerDetails
);

router.get(
        '/stocks/report/:startDate/:endDate',
        validator.validateStockEntityReportStartDate,
        validator.validateStockEntityReportEndDate,
        validator.validationHandler,
        StockController.getStockReportEntity
);

export default router;
