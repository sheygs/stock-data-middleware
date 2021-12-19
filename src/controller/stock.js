import 'dotenv/config';
import logger from '../utils/logger';
import { sendSuccessResponse } from '../utils/responseHandler';
import { asyncMiddleware } from '../middleware/async';
import StockService from '../services/stocks';

const getAggregateStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getAggregateStocks(req.query);

        logger.info(`status: ${status}, data: ${JSON.stringify(data)}`);

        return sendSuccessResponse(res, status, 'Aggregate stocks retrieved', data);
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { resultData, status } = await StockService.getGroupedDailyStocks(req.query);

        logger.info(`Result: ${JSON.stringify(resultData)}`);

        const { results } = resultData;

        if (status === 200) {
                const message = results.length
                        ? 'Daily stocks retrieved'
                        : 'No record exist for the moment';
                return sendSuccessResponse(res, status, message, resultData);
        }
});

const getDailyOpenCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getDailyOpenCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, status, 'Stock prices retrieved', data);
});

const getPreviousCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getPreviousCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200)
                return sendSuccessResponse(res, status, 'Previous close stocks retrieved', data);
});

const getStockTickerDetails = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getStockTickerDetails(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200)
                return sendSuccessResponse(res, status, 'Stock ticker details retrieved', data);
});

const getStockReportEntity = asyncMiddleware(async (req, res) => {
        logger.info(`Req params: ${JSON.stringify(req.params)}`);

        const result = await StockService.getStockReportEntity(req.params);

        logger.info(`Stock report: ${JSON.stringify(result)}`);

        const message = result.length
                ? 'Stock report entity details retrieved'
                : 'No record exists for the moment';

        return sendSuccessResponse(res, 200, message, result);
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
