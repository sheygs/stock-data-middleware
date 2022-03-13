import 'regenerator-runtime/runtime.js';
import 'dotenv/config';
import logger from './utils/logger';
import express from 'express';
import middlewares from './startup/startup';
import logging from './startup/logging';
import { InvalidRoute } from './middleware/404';
import { baseRoute } from './middleware/baseRoute';
import production from './startup/prod';
import { config } from './config/envConfig';

const PORT = config.PORT;

const app = express();

logging();

middlewares(app);

production(app);

app.get('/', baseRoute);

app.all('*', InvalidRoute);

const server = app.listen(PORT, () =>
        logger.info(`${app.get('env')}: server App listening on PORT ${PORT}...`)
);

export default server;
