import axios from 'axios';
import { config } from '../config/envConfig';
const { API_KEY, BASE_URL } = config;
import logger from './logger';
import AppError from '../utils/error';

const _axios = axios.create({
        baseURL: BASE_URL,
        headers: {
                Authorization: `Bearer ${API_KEY}`,
        },
});

class Axios {
        static async get(endpoint, paramsObj) {
                logger.info(`About to call ${BASE_URL}${endpoint}`);
                try {
                        const result = await _axios.get(`${endpoint}`, {
                                params: {
                                        ...paramsObj,
                                },
                        });
                        return result;
                } catch (error) {
                        logger.error(`Exception: ${error.message} \n${error.stack}`);
                        throw new AppError(error.message, error.code);
                }
        }
}

export default Axios;
