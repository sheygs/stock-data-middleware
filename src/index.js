import 'regenerator-runtime/runtime.js';
import 'dotenv/config';
import logger from './utils/logger';
import express from 'express';
import middlewares from './startup/startup';
import logging from './startup/logging';
import { InvalidRoute } from './middleware/404';
import { baseRoute } from './middleware/baseRoute';
import production from './startup/prod';

const app = express();

logging();

middlewares(app);

production(app);

// base path
app.get('/', baseRoute);

app.all('*', InvalidRoute);

const { PORT } = process.env;

const port = PORT;

const server = app.listen(port, () =>
        logger.info(`${app.get('env')}: server App listening on PORT ${port}...`)
);

export default server;
