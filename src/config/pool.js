import { Pool } from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';
import { settings } from './db';

const { NODE_ENV } = process.env;

const mode = NODE_ENV || 'development';

logger.info(`mode: ${mode}`);

const envConfig = settings(mode);

logger.info(`envConfig: ${JSON.stringify(envConfig)}`);

const connectionURL = process.env[envConfig.envVariable];

logger.info(`DB ConnectionURL: ${connectionURL}`);

const pool = new Pool({
        connectionString: connectionURL,
});

(async () => {
        try {
                await pool.connect();
                logger.info(`Successfully connected to ${mode} database...`);
        } catch (error) {
                logger.error(`Unable to connect to ${mode} database...`, error);
                process.exit(1);
        }
})();

export default pool;
