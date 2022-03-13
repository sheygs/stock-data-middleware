import StockModel from '../model/stock';

class StockEntityTable {
        constructor() {
                this.stockEntityTable = new StockModel('StockEntity');
        }

        async insert(column, values) {
                try {
                        const response = await this.stockEntityTable.create({ column, values });
                        return response;
                } catch (error) {
                        throw error;
                }
        }

        async getAll(column, condition) {
                try {
                        const response = await this.stockEntityTable.get({ column, condition });
                        return response;
                } catch (error) {
                        throw error;
                }
        }
}

export default new StockEntityTable();
