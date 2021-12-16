const settings = (environment) => {
        return {
                dialect: 'postgres',
                envVariable: environment !== 'production' ? 'DEV_DATABASE_URL' : 'DATABASE_URL',
        };
};

export { settings };
