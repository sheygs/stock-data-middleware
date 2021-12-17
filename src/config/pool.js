import { Pool } from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';
import { settings } from './db';

const { NODE_ENV } = process.env;

const mode = NODE_ENV || 'development';

logger.info(`mode: ${mode}`);

const envConfig = settings(mode);

logger.info(`envConfig: ${JSON.stringify(envConfig)}`);

const connectionUrl = process.env[envConfig.envVariable];

logger.info(`DB ConnectionUrl: ${connectionUrl}`);

const pool = new Pool({
        connectionString: connectionUrl,
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
