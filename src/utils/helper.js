const paginate = (results = [], page = 1, limit = 10) => {
        const totalCounts = results.length;
        const start = (page - 1) * limit;
        const end = page * limit;
        const items = results.slice(start, end);
        const hasNextPage = limit * page < totalCounts;
        const hasPreviousPage = page > 1;
        const nextPage = page + 1;
        const previousPage = page - 1;
        const lastPage = Math.ceil(totalCounts / limit);

        return {
                totalCounts,
                itemsPerPage: limit,
                hasPreviousPage,
                hasNextPage,
                previousPage,
                currentPage: page,
                nextPage,
                lastPage,
                results: items,
        };
};

const paginateEmptyResult = () => ({
        totalCounts: 0,
        results: [],
        hasNextPage: false,
        hasPreviousPage: false,
});

const handleMap = ({ c, o, ...rest }) => {
        return {
                ...rest,
                c,
                o,
                ls: Number(o - c).toFixed(2),
                g: Number(c - o).toFixed(2),
                p: (((Number(c) - Number(o)) / Number(o)) * 100).toFixed(2),
        };
};

const extractValueOperator = (queryValue) => {
        if (typeof queryValue === 'object') {
                if (queryValue['lte']) {
                        return { value: queryValue['lte'], operator: 'lte' };
                }
                if (queryValue['gte']) {
                        return { value: queryValue['gte'], operator: 'gte' };
                }
        } else {
                return { value: queryValue, operator: 'eq' };
        }
};

const filterCriteria = (actualValue, param) => {
        const { operator, value } = param;
        switch (operator) {
                case 'lte': {
                        return actualValue <= value;
                }

                case 'gte': {
                        return actualValue >= value;
                }

                case 'eq': {
                        return actualValue === value;
                }

                default: {
                        return false;
                }
        }
};

const customValidation = (value, { req }) => {
        const key = Object.keys(req.query)[0];
        if (typeof value === 'object') {
                let obj = value;
                if (obj['gte'] || obj['lte']) {
                        if (+obj['gte'] >= 1 || +obj['lte'] >= 1) return true;
                }
                throw new Error(`${key} must have an integer value from 1 and above`);
        }
        if (!value) throw new Error(`${key} value cannot be empty`);
        if (value > 0) return true;
};

const checkErrorMessage = (code) => {
        const objLookUp = {
                400: 'Bad Request',
                401: 'Unauthorized',
                403: 'Forbidden',
                404: 'Not Found',
                500: 'Internal Server Error',
        };
        return objLookUp[code];
};

const checkStatusCode = (message) => {
        const errorCodes = ['400', '401', '403', '404', '500'];
        let code = errorCodes.find((code) => message.includes(code) && code);
        return Boolean(code) && +code;
};

export {
        paginateEmptyResult,
        paginate,
        handleMap,
        extractValueOperator,
        filterCriteria,
        customValidation,
        checkErrorMessage,
        checkStatusCode,
};
