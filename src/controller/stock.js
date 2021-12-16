import 'dotenv/config';
import logger from '../utils/logger';
import { sendSuccessResponse } from '../utils/responseHandler';
import { asyncMiddleware } from '../middleware/async';
import StockService from '../services/stocks';

const getAggregateStocks = asyncMiddleware(async (req, res) => {
        const response = await StockService.getAggregateStocks(req.query);

        const { status, data } = response;

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { resultData, status } = await StockService.getGroupedDailyStocks(req.query);

        logger.info(`Result: ${JSON.stringify(resultData)}`);

        if (status === 200) {
                return sendSuccessResponse(res, 200, resultData);
        }
});

const getDailyOpenCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getDailyOpenCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const getPreviousCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getPreviousCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const getStockTickerDetails = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getStockTickerDetails(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const getStockReportEntity = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getStockReportEntity(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const StockController = {
        getAggregateStocks,
        groupedDailyStocks,
        getDailyOpenCloseStocks,
        getPreviousCloseStocks,
        getStockTickerDetails,
        getStockReportEntity,
};

export default StockController;
