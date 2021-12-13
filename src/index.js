import 'dotenv/config';
import express from 'express';
import logger from './utils/logger';
import startUp from './startup/startup';
import logging from './startup/logging';
import NotFound from './middleware/404';

const { PORT } = process.env;

const app = express();

logging();
startUp(app);
app.all('*', NotFound);

const port = PORT;

app.listen(port, () => logger.info(`${app.get('env')}: server App listening on PORT ${port}...`));
