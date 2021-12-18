import { sendErrorResponse, sendErrorResponseI } from '../utils/responseHandler';

import logger from '../utils/logger';

const { NODE_ENV } = process.env;

const isDev = NODE_ENV !== 'production';

const errorHandler = (error, req, res, next) => {
        if (error.response) {
                const {
                        status,
                        data: { error: message },
                } = error.response;

                isDev && logger.error(`${status} ${message}\n${error.stack}`);

                return sendErrorResponse(res, status, message);
        }
        if (error.request) {
                isDev && logger.error(`${error.message} \n${error.stack}`);
                return sendErrorResponseI(res, error.message);
        }
        next();
};

export default errorHandler;
