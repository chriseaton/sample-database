const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class OrderProduct {
    constructor() {

        /**
         * @type {Number}
         */
        this.OrderID = null;

        /**
         * @type {Number}
         */
        this.ProductID = null;

        /**
         * @type {Number}
         */
        this.Quantity = null;

        /**
         * @type {Number}
         */
        this.UnitCost = null;

        /**
         * @type {Number}
         */
        this.UnitPrice = null;

        /**
         * @type {Number}
         */
        this.TotalCost = null;

        /**
         * @type {Number}
         */
        this.TotalPrice = null;
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'OrderID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'ProductID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'Quantity', dataType: DataTypes.INTEGER, key: false, notNull: true },
            { name: 'UnitCost', dataType: DataTypes.FLOAT, key: false, notNull: true },
            { name: 'UnitPrice', dataType: DataTypes.FLOAT, key: false, notNull: true },
            { name: 'TotalCost', dataType: DataTypes.FLOAT, key: false, notNull: true },
            { name: 'TotalPrice', dataType: DataTypes.FLOAT, key: false, notNull: true }
        ];
    }

    /**
     * Generates randomized sets of schema-based objects using the given options into the specified `Dataset` instance.
     * This overwrites existing objects of the same schema.
     * @param {Options} options - The generator options to utilize with this schema.
     * @param {Seed} seed - The seed data to utilize for populating the schema-based objects.
     * @param {Dataset} ds - The dataset to inject new objects into.
     */
    static generate(options, seed, ds) {
        if (!options) {
            options = Object.assign({}, Options);
        }
        if (!seed) {
            seed = new Seed();
        }
        if (!ds) {
            throw new Error('The "ds" parameter argument is required.');
        }
        //clear old values
        ds.orderProducts = [];
        //generate data
        for (let x = 0; x < options.orderProduct.count; x++) {
            let op = new OrderProduct();
            op.OrderID = util.random(1, ds.orders.length + 1);
            op.ProductID = util.random(1, ds.products.length + 1);
            op.Quantity = util.random(1, 15);
            let product = ds.products[op.ProductID - 1];
            op.UnitCost = product.Cost;
            if (Math.random() <= 0.8) {
                op.UnitPrice = product.Price;
            } else {
                op.UnitPrice = Math.round(product.Price * (1 + Math.random()) * 100) / 100;
            }
            op.TotalCost = Math.round(op.UnitCost * op.Quantity * 100) / 100;
            op.TotalPrice = Math.round(op.UnitPrice * op.Quantity * 100) / 100;
            //done
            ds.orderProducts.push(op);
        }
    }

}

module.exports = OrderProduct;