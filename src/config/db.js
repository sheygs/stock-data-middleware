const settings = (environment) => {
        return {
                dialect: 'postgres',
                envVariable: environment !== 'production' ? 'DEV_DB_URL' : 'PROD_DB_URL',
        };
};

export { settings };
