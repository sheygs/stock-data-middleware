const ALLOWED_AGGREGATE_BARS_QUERY = ['limit', 'sort', 'adjusted'];

const ALLOWED_GROUPED_DAILY_BARS_QUERY = [
        'limit',
        'page',
        'adjusted',
        'cost',
        'percentPer',
        'name',
        'gain',
];

const ALLOWED_DAILY_OPEN_CLOSE = ['adjusted'];

const paginate = (results, page = 1, limit = 10) => {
        const start = (page - 1) * limit;
        const end = page * limit;
        return results.slice(start, end);
};

const allowedQueries = (allowedQueryArr, reqQuery) => {
        const clientQueries = Object.keys(reqQuery);
        return clientQueries.every((el) => allowedQueryArr.includes(el));
};

const clientQuery = (reqQuery) => {
        let params = {};
        const keys = Object.keys(reqQuery);
        for (let key of keys) {
                if (reqQuery[key]) {
                        params[key] = reqQuery[key];
                }
        }
        return params;
};

const validateQueryValues = (reqQuery) => {
        const valuesArr = Object.values(reqQuery);
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
        allowedQueries,
        ALLOWED_AGGREGATE_BARS_QUERY,
        ALLOWED_GROUPED_DAILY_BARS_QUERY,
        ALLOWED_DAILY_OPEN_CLOSE,
        clientQuery,
        validateQueryValues,
        handleMap,
        extractValueOperator,
        filterCondition,
};
