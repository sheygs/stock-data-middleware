import 'dotenv/config';
import logger from '../utils/logger';
import axios from 'axios';

import {
        allowedQueries,
        clientQuery,
        AGGREGATE_STOCKS_LIST_QUERIES,
        DAILY_OPEN_CLOSE_LIST_QUERIES,
} from '../utils/helper';

import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler';

import { asyncMiddleware } from '../middleware/async';

import StockService from '../services/stocks';

const { BASE_URL, API_KEY } = process.env;

const aggregateStocks = asyncMiddleware(async (req, res) => {
        const { tickerId, multiplier, timespan, from, to } = req.params;

        const isValid = allowedQueries(AGGREGATE_STOCKS_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = clientQuery(req.query);

        logger.info(`params: ${JSON.stringify(params)}`);

        logger.info(`Base URL:${BASE_URL}, key: ${req.API_KEY}`);

        logger.info(
                `About to call ${BASE_URL}/v2/aggs/ticker/${tickerId}/range/${multiplier}/${timespan}/${from}/${to}`
        );

        const response = await axios.get(
                `${BASE_URL}/v2/aggs/ticker/${tickerId}/range/${multiplier}/${timespan}/${from}/${to}`,
                {
                        params,
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${req.API_KEY}`,
                        },
                }
        );

        logger.info(`response: ${JSON.stringify(response)}`);

        const { status, data } = response;

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { resultData, status } = await StockService.getGroupedDailyStocks(req);

        logger.info(`ResultData: ${JSON.stringify(resultData)}`);

        if (status === 200) {
                return sendSuccessResponse(res, 200, resultData);
        }
});

const getDailyOpenCloseStocks = asyncMiddleware(async (req, res) => {
        const { date, ticker } = req.params;

        const isValid = allowedQueries(DAILY_OPEN_CLOSE_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = clientQuery(req.query);

        if (!date || !ticker)
                return sendErrorResponse(res, 400, 'date or ticker paramter not supplied');

        const { status, data } = await axios.get(`${BASE_URL}/v1/open-close/${ticker}/${date}`, {
                params,
                headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                },
        });

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const getPreviousCloseStocks = asyncMiddleware(async (req, res) => {
        const { ticker } = req.params;

        const isValid = allowedQueries(DAILY_OPEN_CLOSE_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid Query');

        const params = clientQuery(req.query);

        const { status, data } = await axios.get(`${BASE_URL}/v2/aggs/ticker/${ticker}/prev`, {
                params,
                headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_KEY}`,
                },
        });

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const StockController = {
        aggregateStocks,
        groupedDailyStocks,
        getDailyOpenCloseStocks,
        getPreviousCloseStocks,
};

export default StockController;
