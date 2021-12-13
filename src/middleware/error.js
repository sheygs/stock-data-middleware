import { sendErrorResponse, sendNetworkResponse } from '../utils/sendResponse';

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
                isDev && logger.error(`${error.message} ${error.stack}`);
                return sendNetworkResponse(res, 'Check your internet connection and try again.');
        }
};

export default errorHandler;
