import { param, query, validationResult } from 'express-validator';

const validateTicker = [
        query('ticker')
                .exists()
                .notEmpty()
                .isAlpha()
                .isLength({ min: 2 })
                .withMessage('stock ticker  must be at least 2 characters'),
];
const validateStartDate = [
        query('from').exists().notEmpty().withMessage('start date must be provided'),
];
const validateEndDate = [query('to').exists().notEmpty().withMessage('end date must be provided')];

const validateGetStocks = [
        query('name')
                .optional()
                .notEmpty()
                .isAlpha()
                .isLength({ min: 2 })
                .withMessage('stock ticker must be at least 2 characters long'),
        query('limit')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('result per page must be an integer from 1 and above'),
        query('page')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('page must be an integer from 1 and above'),
        query('cost')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('cost value must be an integer from 1 and above'),
        query('percentPer')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('percent performance value must be an integer from 1 and above'),
        query('gain')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('gain value must be an integer from 1 and above'),
        query('loss')
                .optional()
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('loss value must be an integer from 1 and above'),
];

const validateDailyOpenCloseTicker = [
        param('ticker')
                .exists()
                .notEmpty()
                .isAlpha()
                .isLength({ min: 2 })
                .withMessage('stock ticker must be at least 2 characters'),
];

const validateDailyOpenCloseDate = [
        param('date').exists().notEmpty().withMessage('date must be provided'),
];

const validateStockEntityReportStartDate = [
        param('startDate').exists().notEmpty().withMessage('start date must be provided'),
];
const validateStockEntityReportEndDate = [
        param('endDate').exists().notEmpty().withMessage('end date must be provided'),
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
        validateStockEntityReportStartDate,
        validateStockEntityReportEndDate,
};

export default validations;
