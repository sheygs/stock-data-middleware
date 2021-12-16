import 'dotenv/config';
import logger from '../utils/logger';
import axios from 'axios';
import { paginate, handleMap, extractValueOperator, filterCriteria } from '../utils/helper';

import { config } from '../config/envConfig';

const { BASE_URL, API_KEY } = config;

class StockService {
        static async getGroupedDailyStocks(query = {}) {
                try {
                        logger.info(`req: ${JSON.stringify(query)}`);

                        let {
                                page = 1,
                                limit = 10,
                                name = '',
                                cost = { gte: '2' },
                                percentPer = { lte: '3' },
                                gain = { lte: '1' },
                        } = query || {};

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
                                results = results.filter(({ c, p, T, g }) => {
                                        let filteredCriteria;

                                        if (cost.value) {
                                                filteredCriteria = filterCriteria(c, cost);
                                                if (!filteredCriteria) return;
                                        }

                                        if (percentPer.value) {
                                                filteredCriteria = filterCriteria(p, percentPer);

                                                if (!filteredCriteria) return;
                                        }

                                        if (name.value) {
                                                filteredCriteria = filterCriteria(T, name);

                                                if (!filteredCriteria) return;
                                        }

                                        if (gain.value) {
                                                filteredCriteria = filterCriteria(g, gain);

                                                if (!filteredCriteria) return;
                                        }

                                        return filteredCriteria;
                                });
                        }

                        const resultData = paginate(results, parseInt(page), parseInt(limit));

                        return { resultData, status };
                } catch (error) {
                        logger.info(`${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getAggregateStocks(query) {
                try {
                        const { ticker, from, to } = query;

                        logger.info(
                                `About to call ${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`
                        );

                        const result = await axios.get(
                                `${BASE_URL}/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`,
                                {
                                        params: {
                                                adjusted: false,
                                                sort: 'asc',
                                                limit: '12',
                                        },
                                        headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${API_KEY}`,
                                        },
                                }
                        );

                        return result;
                } catch (error) {
                        logger.info(`${error}\n${error.stack}`);
                        throw error;
                }
        }
}

export default StockService;
