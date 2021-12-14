import '@babel/polyfill';
import 'dotenv/config';
import logger from './utils/logger';
import express from 'express';
import middlewares from './startup/startup';
import logging from './startup/logging';
import { InvalidRoute } from './middleware/404';
import { sendSuccessResponse } from './utils/responseHandler';

const app = express();

logging();
middlewares(app);

// base path
app.get('/', (req, res) => {
        return sendSuccessResponse(res, 200, { message: 'Stock data API here for you!' });
});

app.all('*', InvalidRoute);

const { PORT } = process.env;

const port = PORT;

const server = app.listen(port, () =>
        logger.info(`${app.get('env')}: server App listening on PORT ${port}...`)
);

export default server;
