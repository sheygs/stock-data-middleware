import StockModel from '../model/stock';

class StockEntityTable {
        constructor() {
                this.stockEntityTable = new StockModel('StockEntity');
        }

        async insert(column, values) {
                try {
                        const response = await this.stockEntityTable.create({ column, values });
                        return response;
                } catch ({ message }) {
                        throw message;
                }
        }

        async getAll(column, condition) {
                try {
                        const response = await this.stockEntityTable.get({ column, condition });
                        return response;
                } catch ({ message }) {
                        throw message;
                }
        }
}

export default new StockEntityTable();
