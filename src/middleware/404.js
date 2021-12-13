import { sendErrorResponse } from '../utils/sendResponse';

export default (req, res) => {
        return sendErrorResponse(res, 404, `Could not find ${req.originalUrl}`);
};
