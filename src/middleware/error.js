import { sendErrorResponse } from '../utils/responseHandler';
import { checkStatusCode } from '../utils/helper';
import logger from '../utils/logger';

const errorHandler = (error, req, res, next) => {
        logger.error(
                `Message:::${error.message}::Status:::${error.status}::isOperational:::${error.isOperational}\n${error.stack}`
        );
        const statusCode = checkStatusCode(error.message) || 500;

        logger.info(`statusCode: ${statusCode}`);

        sendErrorResponse(res, statusCode, error.message);

        next();
};

export default errorHandler;
