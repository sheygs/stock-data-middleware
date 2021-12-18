export const sendErrorResponse = (res, code, errorMessage) => {
        res.status(code).send({
                status: 'fail',
                error: errorMessage,
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

export const sendErrorResponseI = (res, message = 'An error occured. Please try again later.') => {
        res.send({
                message,
        });
};
