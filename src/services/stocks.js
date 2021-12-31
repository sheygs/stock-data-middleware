import 'dotenv/config';
import logger from '../utils/logger';
import _axios from '../utils/_axios';
import StockEntityInstance from '../container/stock';
import {
        paginate,
        paginateEmptyResult,
        handleMap,
        extractValueOperator,
        criteria,
} from '../utils/helper';

class StockService {
        static async getGroupedDailyStocks(query) {
                try {
                        logger.info(`Request Query: ${JSON.stringify(query)}`);

                        let {
                                page = 1,
                                limit = 10,
                                name = '',
                                cost = { gt: '2' },
                                percentPer = { lt: '3' },
                                gain = { lt: '1' },
                                loss = { lt: '1' },
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
                                results = results.filter(({ c, _percentPer, T, _gain, _loss }) => {
                                        let outcome;

                                        if (cost.value) {
                                                outcome = criteria(c, cost);

                                                if (!outcome) return;
                                        }

                                        if (percentPer.value) {
                                                outcome = criteria(_percentPer, percentPer);

                                                if (!outcome) return;
                                        }

                                        if (name.value) {
                                                outcome = criteria(T, name);

                                                if (!outcome) return;
                                        }

                                        if (gain.value) {
                                                outcome = criteria(_gain, gain);

                                                if (!outcome) return;
                                        }

                                        if (loss.value) {
                                                outcome = criteria(_loss, loss);

                                                if (!outcome) return;
                                        }

                                        return outcome;
                                });
                        }

                        return {
                                resultData: results.length
                                        ? paginate(results, parseInt(page), parseInt(limit))
                                        : paginateEmptyResult(),
                                status,
                        };
                } catch (error) {
                        logger.error(`Exception: ${error.message}\n${error.stack}`);
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
                        logger.error(`Exception: ${error}\n${error.stack}`);
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
                        logger.error(`Exception: ${error}\n${error.stack}`);
                        throw error;
                }
        }

        static async getPreviousCloseStocks(query) {
                try {
                        const endpoint = `/v2/aggs/ticker/${query.ticker}/prev`;
                        const response = await _axios.get(`${endpoint}`, {
                                adjusted: false,
                        });

                        return response;
                } catch (error) {
                        logger.error(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getStockTickerDetails(query) {
                try {
                        const endpoint = `/v1/meta/symbols/${query.ticker}/company`;
                        const result = await _axios.get(`${endpoint}`);
                        return result;
                } catch (error) {
                        logger.error(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }

        static async getStockReportEntity(query) {
                try {
                        const { startDate, endDate } = query;

                        logger.info(`from: ${startDate}, to: ${endDate}`);

                        const columns = `tickerName, gain, loss, cost, percentPerf, createdAt, timestamp`;

                        const criteria = `createdAt >= '${startDate}' and createdAt <= '${endDate}'`;

                        const result = StockEntityInstance.getAll(columns, criteria);

                        return result;
                } catch (error) {
                        logger.error(`Exception: ${error.message}\n${error.stack}`);
                        throw error;
                }
        }
}

export default StockService;
