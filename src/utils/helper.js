const paginate = (results = [], page = 1, limit = 10) => {
        const start = (page - 1) * limit;
        const end = page * limit;
        return results.slice(start, end);
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

const handleMap = ({ c, o, ...rest }) => {
        return {
                c,
                o,
                ...rest,
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

export { paginate, clientQuery, handleMap, extractValueOperator, filterCondition };
