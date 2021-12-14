import errorHandler from '../middleware/error';
import StockRoutes from '../routes/stock.route';
import logger from '../utils/logger';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import cors from 'cors';

const middlewares = (app) => {
        if (app.get('env') === 'development') {
                app.use(morgan('tiny'));
                logger.info('Morgan enabled...');
        }
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(helmet());
        app.use('/api/v1/auth', StockRoutes);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        app.use(errorHandler);
};

export default middlewares;
