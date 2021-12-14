import { Pool } from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';
import { settings } from './db';

const { NODE_ENV } = process.env;

const mode = 'development' || NODE_ENV;

const envConfig = settings(mode);

const config = process.env[envConfig.envVariable];

logger.info(`config: ${config}`);

const pool = new Pool({
        connectionString: config,
});

(async () => {
        try {
                await pool.connect();
                logger.info(`Successfully connected to ${mode} database...`);
        } catch ({ message }) {
                logger.error(`Unable to connect to ${mode} database...`, message);
                process.exit(1);
        }
})();

export default pool;
