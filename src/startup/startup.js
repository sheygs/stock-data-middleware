import errorHandler from '../middleware/error';
import StockRoutes from '../routes/stock.route';
import logger from '../utils/logger';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const startUp = (app) => {
        if (app.get('env') === 'development') {
                app.use(morgan('tiny'));
                logger.info('Morgan enabled...');
        }
        app.use(express.json());
        app.use(helmet());
        app.use('/api/v1/auth', StockRoutes);
        app.use(errorHandler);
};

export default startUp;
