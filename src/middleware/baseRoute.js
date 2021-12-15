import { sendSuccessResponse } from '../utils/responseHandler';

export const baseRoute = (req, res) =>
        sendSuccessResponse(res, 200, { message: 'Stock data API here for you!' });
