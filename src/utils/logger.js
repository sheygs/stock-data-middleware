import winston, { format, info } from 'winston';
import 'dotenv/config';

const { NODE_ENV } = process.env;

const { combine, printf } = format;

const formatOptions = {
        format: combine(
                NODE_ENV !== 'production' ? format.simple() : format.json(),

                printf((info) => {
                        const today = new Date();
                        const timestamp = `${
                                today.toISOString().split('T')[0]
                        } :::${today.toLocaleTimeString()}`;
                        return `${timestamp} ${info.level}: ${info.message}`;
                })
        ),
};

const logger = winston.createLogger({
        ...formatOptions,
        transports: [
                new winston.transports.File({
                        filename: `${process.cwd()}/app_logs/error.log`,
                        level: 'error',
                        maxFiles: 3,
                }),
                new winston.transports.Console({ level: 'info' }),
                new winston.transports.File({
                        level: 'info',
                        filename: `${process.cwd()}/app_logs/info.log`,
                        maxFiles: 3,
                }),
        ],
});

NODE_ENV !== 'production' &&
        logger.add(
                new winston.transports.Console({
                        ...formatOptions,
                        level: 'error',
                })
        );

export default logger;
