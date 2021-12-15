import 'dotenv/config';
import logger from '../utils/logger';
import axios from 'axios';
import {
        paginate,
        allowedQueries,
        validateQueryValues,
        handleMap,
        extractValueOperator,
        filterCondition,
        GROUPED_DAILY_STOCKS_LIST_QUERIES,
} from '../utils/helper';

import { sendErrorResponse } from '../utils/responseHandler';
const { BASE_URL, API_KEY } = process.env;

class StockService {
        static async getGroupedDailyStocks(req) {
                logger.info(`req: ${JSON.stringify(req)}`);

                const isValid = allowedQueries(GROUPED_DAILY_STOCKS_LIST_QUERIES, req.query);

                if (!isValid) return sendErrorResponse(res, 400, 'Invalid Query');

                let {
                        page = 1,
                        limit = 10,
                        cost = { gte: '2' },
                        percentPer = { lte: '3' },
                        gain,
                        name,
                } = req.query || {};

                const valid = validateQueryValues({ page, limit });

                if (!valid)
                        return sendErrorResponse(
                                res,
                                400,
                                'Error parsing query parameters from URL'
                        );

                logger.info(
                        `About to call ${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/2021-10-14`
                );

                const { status, data } = await axios.get(
                        `${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/2021-10-14`,
                        {
                                params: {
                                        adjusted: false,
                                },
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${API_KEY}`,
                                },
                        }
                );

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
                                        filteredCondition = filterCondition(result.g, gain);

                                        if (!filteredCondition) return;
                                }

                                return filteredCondition;
                        });
                }

                const resultData = paginate(results, parseInt(page), parseInt(limit));

                return { resultData, status };
        }
}

export default StockService;
