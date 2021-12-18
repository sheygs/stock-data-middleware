import { sendBaseResponse } from '../utils/responseHandler';

export const baseRoute = (req, res) =>
        sendBaseResponse(res, 200, { message: 'Stock data API here for you!' });
