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

import { config } from '../config/envConfig';

const { BASE_URL, API_KEY } = config;

const getAggregateStocks = asyncMiddleware(async (req, res) => {
        logger.info(`Query: ${JSON.stringify(req.query)}, API_KEY: ${API_KEY}`);

        const isValid = allowedQueries(AGGREGATE_STOCKS_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid Query');

        const response = await StockService.getAggregateStocks(req.query);

        logger.info(`response: ${JSON.stringify(response)}`);

        const { status, data } = response;

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { resultData, status } = await StockService.getGroupedDailyStocks(req.query);

        logger.info(`ResultData: ${JSON.stringify(resultData)}`);

        if (status === 200) {
                return sendSuccessResponse(res, 200, resultData);
        }
});

const getDailyOpenCloseStocks = asyncMiddleware(async (req, res) => {
        const { date, ticker } = req.params;

        const isValid = allowedQueries(DAILY_OPEN_CLOSE_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid Query');

        const params = clientQuery(req.query);

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

const getStockTickerDetails = asyncMiddleware(async (req, res) => {
        const { tickerId } = req.params;

        logger.info(`tickerId: ${tickerId}`);

        const { status, data } = await axios.get(
                `${BASE_URL}/v1/meta/symbols/${tickerId}/company`,
                {
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${API_KEY}`,
                        },
                }
        );

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const StockController = {
        getAggregateStocks,
        groupedDailyStocks,
        getDailyOpenCloseStocks,
        getPreviousCloseStocks,
        getStockTickerDetails,
};

export default StockController;
