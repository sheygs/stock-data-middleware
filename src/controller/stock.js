import 'dotenv/config';
import logger from '../utils/logger';
import axios from 'axios';

import {
        paginate,
        allowedQueries,
        clientQuery,
        validateQueryValues,
        handleMap,
        extractValueOperator,
        filterCondition,
        AGGREGATE_STOCKS_LIST_QUERIES,
        GROUPED_DAILY_STOCKS_LIST_QUERIES,
        DAILY_OPEN_CLOSE_LIST_QUERIES,
} from '../utils/helper';

import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler';

import { asyncMiddleware } from '../middleware/async';

const { BASE_URL } = process.env;

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

        logger.info(`Result from aggregate stocks: ${JSON.stringify(response)}`);

        const { status, data } = response;

        logger.info(`${data}`);

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const groupedDailyStocks = asyncMiddleware(async (req, res) => {
        const { date } = req.params;

        let { page = 1, limit = 10, adjusted, cost, percentPer, gain, name } = req.query;

        const isValid = allowedQueries(GROUPED_DAILY_STOCKS_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid Query');

        const params = {};

        if (adjusted) params.adjusted = adjusted;

        const valid = validateQueryValues({ page, limit });

        if (!valid) return sendErrorResponse(res, 400, 'Error parsing query parameters from URL');

        logger.info(`About to call ${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/${date}`);

        const { status, data } = await axios.get(
                `${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/${date}`,
                {
                        params,
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${req.API_KEY}`,
                        },
                }
        );

        logger.info(`Response Code: ${status}`);

        let results = data.results.map(handleMap);

        cost = extractValueOperator(cost);
        percentPer = extractValueOperator(percentPer);
        name = extractValueOperator(name);
        gain = extractValueOperator(gain);

        logger.info(`${JSON.stringify({ cost, percentPer, name, gain })}`);

        if (cost.value || percentPer.value || name.value || gain.value) {
                results = results.filter((result) => {
                        let filteredCondition;

                        if (cost.value) {
                                filteredCondition = filterCondition(result.c, cost);
                                if (!filteredCondition) return;
                        }

                        if (percentPer.value) {
                                filteredCondition = filterCondition(result.p, percentPer);

                                if (!filteredCondition) return;
                        }

                        if (name.value) {
                                filteredCondition = filterCondition(result.T, name);

                                if (!filteredCondition) return;
                        }

                        if (gain.value) {
                                filteredCondition = filterCondition(result.d, gain);

                                if (!filteredCondition) return;
                        }

                        return filteredCondition;
                });
        }

        if (status === 200) {
                const resultData = paginate(results, parseInt(page), parseInt(limit));

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
                        Authorization: `Bearer ${req.API_KEY}`,
                },
        });

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const getPreviousCloseStocks = asyncMiddleware(async (req, res) => {
        const { ticker } = req.params;

        const isValid = allowedQueries(DAILY_OPEN_CLOSE_LIST_QUERIES, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = clientQuery(req.query);

        const { status, data } = await axios.get(`${BASE_URL}/v2/aggs/ticker/${ticker}/prev`, {
                params,
                headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${req.API_KEY}`,
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
