import db from '../config/pool';
import logger from '../utils/logger';

class StockModel {
        constructor(table) {
                this.table = table;
        }

        async get(queryObj) {
                const sqlStatement = `SELECT ${queryObj.column} FROM ${this.table} WHERE ${queryObj.condition}`;

                const { rows } = await db.query(sqlStatement);

                logger.info(`Rows: ${JSON.stringify(rows)}`);

                return rows;
        }

        async create(queryObj) {
                const sqlStatement = `INSERT INTO ${this.table} (${queryObj.column}) VALUES (${queryObj.values}) RETURNING *`;

                logger.info(`${sqlStatement}`);

                const result = await db.query(sqlStatement);

                logger.info(`Rows: ${JSON.stringify(result.rows[0])}`);

                return result.rows[0];
        }
}

export default StockModel;
