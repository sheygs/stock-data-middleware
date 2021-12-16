import 'dotenv/config';
import logger from '../utils/logger';
import _axios from '../utils/_axios';
import StockEntityInstance from '../container/stock';
import { paginate, handleMap, extractValueOperator, filterCriteria } from '../utils/helper';

class StockService {
        static async getGroupedDailyStocks(query = {}) {
                try {
                        logger.info(`Request Query: ${JSON.stringify(query)}`);

                        let {
                                page = 1,
                                limit = 10,
                                name = '',
                                cost = { gte: '2' },
                                percentPer = { lte: '3' },
                                gain = { lte: '1' },
                                loss = { lte: '1' },
                        } = query || {};

                        const endpoint = `/v2/aggs/grouped/locale/us/market/stocks/2020-10-14`;

                        const response = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                        });

                        const { status, data } = response;

                        let results = data.results.map(handleMap);

                        cost = extractValueOperator(cost);

                        percentPer = extractValueOperator(percentPer);

                        name = extractValueOperator(name);

                        gain = extractValueOperator(gain);

                        loss = extractValueOperator(loss);

                        logger.info(
                                `filterCriteria: ${JSON.stringify({
                                        cost,
                                        percentPer,
                                        name,
                                        gain,
                                })}`
                        );

                        if (
                                cost.value ||
                                percentPer.value ||
                                name.value ||
                                gain.value ||
                                loss.value
                        ) {
                                results = results.filter(({ c, p, T, g, ls }) => {
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

                                        if (loss.value) {
                                                filteredCriteria = filterCriteria(ls, loss);

                                                if (!filteredCriteria) return;
                                        }

                                        return filteredCriteria;
                                });
                        }

                        const resultData = paginate(results, parseInt(page), parseInt(limit));

                        return { resultData, status };
                } catch (error) {
                        logger.info(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getAggregateStocks(query) {
                try {
                        const { ticker, from, to } = query;
                        const endpoint = `/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}`;
                        const result = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                                sort: 'asc',
                                limit: '12',
                        });

                        return result;
                } catch (error) {
                        logger.info(`Exception: ${error}\n${error.stack}`);
                        throw error;
                }
        }

        static async getDailyOpenCloseStocks(query) {
                try {
                        const endpoint = `/v1/open-close/${query.ticker}/${query.date}`;
                        const result = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                        });
                        return result;
                } catch (error) {
                        logger.info(`Exception: ${error}\n${error.stack}`);
                        throw error;
                }
        }

        static async getPreviousCloseStocks(query) {
                try {
                        const endpoint = `/v2/aggs/ticker/${query.ticker}/prev`;
                        const result = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                        });

                        return result;
                } catch (error) {
                        logger.info(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getStockTickerDetails(query) {
                try {
                        const endpoint = `/v1/meta/symbols/${query.ticker}/company`;
                        const result = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                        });
                        return result;
                } catch (error) {
                        logger.info(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getStockReportEntity(query) {
                try {
                        const { startDate, endDate } = query;

                        const columns = `tickerName, gain, loss, cost, percentPerf, createdAt, timestamp`;

                        const conditions = `createdAt >= '${startDate}' and createdAt <= '${endDate}'`;

                        const result = StockEntityInstance.getAll(columns, conditions);

                        return result;
                } catch (error) {
                        logger.info(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }
}

export default StockService;
