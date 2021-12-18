import 'dotenv/config';
import logger from '../utils/logger';
import { sendSuccessResponse } from '../utils/responseHandler';
import { asyncMiddleware } from '../middleware/async';
import StockService from '../services/stocks';

const getAggregateStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getAggregateStocks(req.query);

        const { resultsCount } = data;

        logger.info(`resultsCount: ${resultsCount}, status: ${status}`);

        if (status === 200)
                return resultsCount
                        ? sendSuccessResponse(res, 200, 'Aggregate stocks retrieved', data)
                        : sendSuccessResponse(res, 200, 'No record exist for the moment', {});
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { resultData, status } = await StockService.getGroupedDailyStocks(req.query);

        logger.info(`Result: ${JSON.stringify(resultData)}`);

        if (status === 200)
                return sendSuccessResponse(res, 200, 'Daily stocks retrieved', resultData);
});

const getDailyOpenCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getDailyOpenCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200) return sendSuccessResponse(res, 200, 'Stock prices retrieved', data);
});

const getPreviousCloseStocks = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getPreviousCloseStocks(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200)
                return sendSuccessResponse(res, 200, 'Previous close stocks retrieved', data);
});

const getStockTickerDetails = asyncMiddleware(async (req, res) => {
        const { status, data } = await StockService.getStockTickerDetails(req.params);

        logger.info(`Result: ${JSON.stringify(data)}`);

        if (status === 200)
                return sendSuccessResponse(res, 200, 'Stock ticker details retrieved', data);
});

const getStockReportEntity = asyncMiddleware(async (req, res) => {
        logger.info(`Req params: ${JSON.stringify(req.params)}`);

        const result = await StockService.getStockReportEntity(req.params);

        logger.info(`Stock report: ${JSON.stringify(result)}`);

        return result.length
                ? sendSuccessResponse(res, 200, 'Stock report entity details retrieved', result)
                : sendSuccessResponse(res, 200, 'No record exists for the moment', result);
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
