import { sendErrorResponse } from '../utils/responseHandler';

export const InvalidRoute = (req, res) => {
        return sendErrorResponse(res, 404, 'Unable to find the requested endpoint url.');
};
