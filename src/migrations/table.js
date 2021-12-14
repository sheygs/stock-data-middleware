import logger from '../utils/logger';
import db from '../config/pool';

const stockEntity = `
  DROP TABLE IF EXISTS StockEntity CASCADE;
  CREATE TABLE StockEntity(
   _id SERIAL PRIMARY KEY,
   tickerName VARCHAR(50) NOT NULL,
   gain NUMERIC NOT NULL,
   cost NUMERIC NOT NULL,
   percentPerf NUMERIC NOT NULL,
   createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
   timestamp NUMERIC NOT NULL
  );`;

(async () => {
        try {
                logger.info(`About to create StockEntity table...`);

                await db.query(`${stockEntity}`);

                logger.info(`migration: Successfully created table...`);
        } catch ({ message }) {
                logger.error(`Error: ${message}|Table not created...`);
        }
})();
