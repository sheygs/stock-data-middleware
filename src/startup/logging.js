import logger from '../utils/logger';

export default function logging() {
        // error outside express
        logger.info(`Watching for uncaughtException or unhandledRejection...`);

        process.on('uncaughtException', (error) => {
                logger.error(`Exception: ${error.message} \n${error.stack}`);
                process.exit(1);
        });

        process.on('unhandledRejection', (error) => {
                logger.error(`Exception: ${error.message} \n${error.stack}`);
                process.exit(1);
        });
}
