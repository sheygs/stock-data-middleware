import { checkErrorMessage } from './helper';
import logger from './logger';

export const sendErrorResponse = (res, code, errorMessage) => {
        const errMessage = checkErrorMessage(code) || errorMessage;

        logger.info(`errorMessage: ${errMessage}`);

        res.status(code).send({
                status: 'fail',
                error: errMessage,
        });
};

export const sendSuccessResponse = (res, code = 200, message = '', data = {}) => {
        res.status(code).send({
                status: 'success',
                message,
                data,
        });
};

export const sendBaseResponse = (res, code = 200, data = {}) => {
        res.status(code).send({
                status: 'success',
                data,
        });
};
