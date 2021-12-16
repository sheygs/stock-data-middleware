import { param, query, validationResult } from 'express-validator';

const validateTicker = [
        query('ticker')
                .notEmpty()
                .exists()
                .isAlpha()
                .isLength({ min: 2 })
                .withMessage('Ticker stock  must be at least 2 characters'),
];
const validateStartDate = [
        query('from').notEmpty().exists().withMessage('Start date must be provided'),
];
const validateEndDate = [query('to').notEmpty().exists().withMessage('End date must be provided')];

const validateGetStocks = [
        query('name')
                .optional()
                .notEmpty()
                .isAlpha()
                .isLength({ min: 3 })
                .withMessage('Name must be at least 3 characters long'),
        query('limit')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('Limit must be from 1 and above'),
        query('page')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('Limit must be from 1 and above'),
        query('cost').optional().notEmpty().withMessage('Cost must be provided'),
        query('percentPer')
                .optional()
                .notEmpty()
                .withMessage('Percent Performance must be provided'),
        query('gain').optional().notEmpty().withMessage('Gain must be provided'),
];

const validateDailyOpenCloseTicker = [
        param('ticker')
                .notEmpty()
                .exists()
                .isAlpha()
                .isLength({ min: 2 })
                .withMessage('Ticker stock  must be at least 2 characters'),
];

const validateDailyOpenCloseDate = [
        param('date').notEmpty().exists().withMessage('Start Date must be provided'),
];

const validationHandler = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                res.status(422).json({ error: errors.array().map((error) => error.msg) });
        } else {
                next();
        }
};

const validations = {
        validateTicker,
        validateStartDate,
        validateEndDate,
        validationHandler,
        validateGetStocks,
        validateDailyOpenCloseTicker,
        validateDailyOpenCloseDate,
};

export default validations;
