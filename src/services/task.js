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
                                `Result Call from Stock Service: ${JSON.stringify(
                                        response.resultData
                                )}`
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
                } catch ({ message, stack }) {
                        logger.error(`${message}`, `\n${stack}`);
                }
        });
};

const handleStockPersistence = ({ T, g, c, p, t }) => {
        const columns = 'tickerName, gain, cost, percentPer, timestamp';
        const values = `'${T}','${g}','${c}','${p}','${t}'`;
        return StockEntityInstance.insert(columns, values);
};

export { persistBestStocks };
