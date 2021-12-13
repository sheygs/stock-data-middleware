const ALLOWED_AGGREGATE_BARS_QUERY = ['limit', 'sort', 'adjusted'];

const ALLOWED_GROUPED_DAILY_BARS_QUERY = ['limit', 'page', 'adjusted'];

const ALLOWED_DAILY_OPEN_CLOSE = ['adjusted'];

const pagination = (results, page = 1, limit = 10) => {
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

export {
        pagination,
        allowedQueries,
        ALLOWED_AGGREGATE_BARS_QUERY,
        ALLOWED_GROUPED_DAILY_BARS_QUERY,
        ALLOWED_DAILY_OPEN_CLOSE,
        clientQuery,
        validateQueryValues,
};
