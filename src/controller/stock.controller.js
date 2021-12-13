import 'dotenv/config';
import axios from 'axios';
import {
        pagination,
        ALLOWED_AGGREGATE_BARS_QUERY,
        ALLOWED_GROUPED_DAILY_BARS_QUERY,
        ALLOWED_DAILY_OPEN_CLOSE,
        allowedQueries,
        clientQuery,
        validateQueryValues,
} from '../utils/helper';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import { asyncMiddleware } from '../middleware/async';

const { BASE_URL } = process.env;

const aggregateBars = asyncMiddleware(async (req, res) => {
        const { symbol, multiplier, timespan, from, to } = req.params;

        const isValid = allowedQueries(ALLOWED_AGGREGATE_BARS_QUERY, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = clientQuery(req.query);

        if (!symbol || !multiplier || !timespan || !from || !to)
                return sendErrorResponse(res, 400, 'One or more parameters not supplied');

        const response = await axios.get(
                `${BASE_URL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`,
                {
                        params,
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${req.API_KEY}`,
                        },
                }
        );

        const { status, data } = response;

        if (status === 200) return sendSuccessResponse(res, 200, data);
});

const groupedDaily = asyncMiddleware(async (req, res) => {
        const { date } = req.params;

        const { page = 1, limit = 10, adjusted } = req.query;

        const isValid = allowedQueries(ALLOWED_GROUPED_DAILY_BARS_QUERY, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = {};

        if (adjusted) params.adjusted = adjusted;

        if (!date) return sendErrorResponse(res, 400, 'Date parameter not supplied');

        const valid = validateQueryValues({ page, limit });

        if (!valid) return sendErrorResponse(res, 400, 'Error parsing query parameters from URL');

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

        if (status === 200) {
                const results = pagination(data['results'], parseInt(page), parseInt(limit));

                return sendSuccessResponse(res, 200, results);
        }
});

const dailyOpenClose = asyncMiddleware(async (req, res) => {
        const { date, ticker } = req.params;

        const isValid = allowedQueries(ALLOWED_DAILY_OPEN_CLOSE, req.query);

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

const previousClose = asyncMiddleware(async (req, res) => {
        const { ticker } = req.params;

        const isValid = allowedQueries(ALLOWED_DAILY_OPEN_CLOSE, req.query);

        if (!isValid) return sendErrorResponse(res, 400, 'Invalid query syntax');

        const params = clientQuery(req.query);

        if (!ticker) return sendErrorResponse(res, 400, 'ticker parameter is required');

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
        aggregateBars,
        groupedDaily,
        dailyOpenClose,
        previousClose,
};

export default StockController;
