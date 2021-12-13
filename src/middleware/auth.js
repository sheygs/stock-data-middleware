import 'dotenv/config';
import logger from '../utils/logger';
import { sendErrorResponse } from '../utils/sendResponse';

const verifyAuth = (req, res, next) => {
        const authHeader = req.header('Authorization');

        logger.info(`AuthHeader: ${authHeader}`);

        if (typeof authHeader === 'undefined')
                return sendErrorResponse(res, 401, 'Unauthorized. Headers not set');

        const key = authHeader.split(' ')[1];

        if (!key) return sendErrorResponse(res, 401, 'Missing api key.');

        req.API_KEY = key;

        logger.info(`API_KEY: ${req.API_KEY}`);

        next();
};

export { verifyAuth };
