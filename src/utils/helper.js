const AGGREGATE_STOCKS_LIST_QUERIES = ['limit', 'sort', 'adjusted'];

const GROUPED_DAILY_STOCKS_LIST_QUERIES = [
        'limit',
        'page',
        'adjusted',
        'cost',
        'percentPer',
        'name',
        'gain',
];

const DAILY_OPEN_CLOSE_LIST_QUERIES = ['adjusted'];

const paginate = (results = [], page = 1, limit = 10) => {
        const start = (page - 1) * limit;
        const end = page * limit;
        return results.slice(start, end);
};

const allowedQueries = (allowedQueryArr, reqQuery) => {
        const clientQueries = Object.keys(reqQuery);
        return clientQueries.every((el) => allowedQueryArr.includes(el));
};

const clientQuery = (reqObj = {}) => {
        let params = {};
        const keys = Object.keys(reqObj);
        for (let key of keys) {
                if (reqObj[key]) {
                        params[key] = reqObj[key];
                }
        }
        return params;
};

const validateQueryValues = (reqObj) => {
        const valuesArr = Object.values(reqObj);
        return valuesArr.every((value) => Boolean(parseInt(value)));
};

const handleMap = (result) => {
        return {
                ...result,
                g: +(result.c - result.o).toFixed(2),
                p: +(((result.c - result.o) / result.o) * 100).toFixed(2),
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

const filterCondition = (actualValue, param) => {
        const { operator, value } = param;
        switch (operator) {
                case 'lte': {
                        return actualValue <= value;
                }

                case 'gte': {
                        return actualValue >= value;
                }

                case 'eql': {
                        return actualValue === value;
                }

                default: {
                        return false;
                }
        }
};

export {
        paginate,
        clientQuery,
        validateQueryValues,
        handleMap,
        extractValueOperator,
        filterCondition,
        allowedQueries,
        AGGREGATE_STOCKS_LIST_QUERIES,
        GROUPED_DAILY_STOCKS_LIST_QUERIES,
        DAILY_OPEN_CLOSE_LIST_QUERIES,
};
