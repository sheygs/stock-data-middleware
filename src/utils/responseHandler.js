import logger from './logger';

export const sendErrorResponse = (res, code, errorMessage) => {
        logger.error(`Error:- statusCode: ${code} | message: ${errorMessage}`);
        res.status(code).send({
                status: 'fail',
                error: errorMessage,
        });
};

export const sendSuccessResponse = (res, code, data = {}) => {
        logger.info(`Successful:- statusCode:${code} | result: \n${JSON.stringify(data)}`);
        res.status(code).send({
                data,
        });
};

export const sendNetworkResponse = (res, message = 'Network Error') => {
        res.send({
                message,
        });
};
