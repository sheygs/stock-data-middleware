import { sendErrorResponse } from '../utils/responseHandler';

import logger from '../utils/logger';

const errorHandler = (error, req, res, next) => {
        logger.error(
                `error:::${error}message:::${error.message}::status:::${error.status}::isOperational:::${error.isOperational}\n${error.stack}`
        );
        const statusCode =
                (error.message.includes(+'400') && 400) ||
                (error.message.includes(+'404') && 404) ||
                500;
        sendErrorResponse(res, statusCode, error.message);
        next();
};

export default errorHandler;
