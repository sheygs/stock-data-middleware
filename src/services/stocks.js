import 'dotenv/config';
import logger from '../utils/logger';
import axios from 'axios';
import {
        paginate,
        handleMap,
        extractValueOperator,
        filterCondition,
} from '../utils/helper';

import { config } from '../config/envConfig';

const { BASE_URL, API_KEY } = config;

class StockService {
        static async getGroupedDailyStocks(query) {
                try {
                        logger.info(`req: ${JSON.stringify(query)}`);

                        let { page = 1, limit = 10, cost, percentPer, gain, name } = query;

                        logger.info(
                                `About to call ${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/2020-10-14`
                        );

                        const { status, data } = await axios.get(
                                `${BASE_URL}/v2/aggs/grouped/locale/us/market/stocks/2020-10-14`,
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
                } catch ({ message, code, stack }) {
                        logger.info(`${message}`);
                        throw message;
                }
        }

        static async getAggregateStocks(query) {
                try {
                        const { tickerId, from, to } = query;

                        logger.info(
                                `About to call ${BASE_URL}/v2/aggs/ticker/${tickerId}/range/1/day/${from}/${to}...`
                        );

                        const response = await axios.get(
                                `${BASE_URL}/v2/aggs/ticker/${tickerId}/range/1/day/${from}/${to}`,
                                {
                                        params: {
                                                adjusted: false,
                                                sort: 'asc',
                                                limit: '10',
                                        },
                                        headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${API_KEY}`,
                                        },
                                }
                        );

                        return response;
                } catch (error) {
                        logger.info(`${error}`);
                        throw error;
                }
        }
}

export default StockService;
