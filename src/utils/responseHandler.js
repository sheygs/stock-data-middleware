export const sendErrorResponse = (res, code, errorMessage) => {
        res.status(code).send({
                status: 'fail',
                error: errorMessage,
        });
};

export const sendSuccessResponse = (res, code, data = {}) => {
        res.status(code).send({
                status: 'success',
                data,
        });
};

export const sendResponse = (res, message = 'An error occured. Please try again later.') => {
        res.send({
                message,
        });
};
