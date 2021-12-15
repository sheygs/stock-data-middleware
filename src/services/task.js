import cron from 'node-cron';
import StockService from './stocks';
import logger from '../utils/logger';
import StockEntityInstance from '../container/stock';

const persistBestStocks = () => {
        logger.info(`Job task runs every 5:30 AM...`);

        cron.schedule('00 30 05 * * *', async () => {
                try {
                        const response = await StockService.getGroupedDailyStocks({
                                query: {
                                        cost: { gte: '2' },
                                        percentPer: { lte: '3' },
                                },
                        });
                        logger.info(
                                `Call from Stock Service: ${JSON.stringify(response.resultData)}`
                        );

                        const { resultData } = response;

                        resultData.sort((a, b) => b.p - a.p);

                        const [stock1, stock2, stock3] = resultData;

                        logger.info(`About to persist stocks...`);

                        const stocks = [stock1, stock2, stock3].map(handleStockPersistence);

                        const result = Promise.all(stocks);

                        logger.info(
                                `Successfully persisted the best 3 performing stocks: ${JSON.stringify(
                                        result
                                )}`
                        );
                } catch (error) {
                        logger.error(`${error.message}`, `${error.stack}`);
                }
        });
};

const handleStockPersistence = (stock) => {
        const columnNames = 'tickerName, gain, cost, percentPer, timestamp';
        const values = `'${stock.T}','${stock.g}','${stock.c}','${stock.p}','${stck.t}'`;
        return StockEntityInstance.insert(columnNames, values);
};

export { persistBestStocks };
