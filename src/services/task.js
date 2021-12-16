import cron from 'node-cron';
import StockService from './stocks';
import logger from '../utils/logger';
import StockEntityInstance from '../container/stock';

const persistBestStocks = async () => {
        logger.info('Job Scheduler runs every day at 12:00 AM...');

        cron.schedule('0 0 0 * * *', async () => {
                try {
                        const response = await StockService.getGroupedDailyStocks({});

                        logger.info(
                                `Result call from Stock Service: ${JSON.stringify(
                                        response.resultData
                                )}`
                        );

                        const { resultData } = response;

                        resultData.sort((a, b) => b.p - a.p);

                        const [stock1, stock2, stock3] = resultData;

                        logger.info(`About to persist stocks...`);

                        const stocks = [stock1, stock2, stock3].map(handleStockPersistence);

                        const result = await Promise.all(stocks);

                        logger.info(
                                `Successfully persisted the best 3 performing stocks: ${JSON.stringify(
                                        result
                                )}`
                        );
                } catch (error) {
                        logger.error(`Exception: ${error.message}`, `\n${error.stack}`);
                }
        });
};

const handleStockPersistence = ({ T, g, ls, c, p, t }) => {
        logger.info(
                `Name:${T},Gain: ${g}, Loss: ${ls}, Cost: ${c}, Percent Performance: ${p}, Timestamp: ${t}`
        );
        const columns = 'tickerName, gain, loss, cost, percentPerf, timestamp';
        const values = `'${T}','${g}','${ls}','${c}','${p}','${t}'`;
        return StockEntityInstance.insert(columns, values);
};

export { persistBestStocks };
