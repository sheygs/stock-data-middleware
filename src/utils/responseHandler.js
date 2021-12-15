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

export const sendResponse = (res, message = 'An error occured. Please try again later.') => {
        res.send({
                message,
        });
};
