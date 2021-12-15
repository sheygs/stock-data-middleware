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

import { config } from '../config/envConfig';

const { BASE_URL, API_KEY } = config;

class StockService {
        static async getGroupedDailyStocks(query) {
                logger.info(`req: ${JSON.stringify(query)}`);

                const isValid = allowedQueries(GROUPED_DAILY_STOCKS_LIST_QUERIES, query);

                if (!isValid) throw 'Invalid';

                let { page = 1, limit = 10, cost, percentPer, gain, name } = query;

                const valid = validateQueryValues({ page, limit });

                logger.info(`valid: ${valid}`);

                logger.info(
                        `About to call ${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/2021-10-14`
                );

                try {
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
                                                filteredCondition = filterCondition(
                                                        result.p,
                                                        percentPer
                                                );

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
                } catch ({ message }) {
                        throw message;
                }
        }
}

export default StockService;
