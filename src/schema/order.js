const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');
const crypto = require('crypto');

class Order {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {Number}
         */
        this.CustomerID = null;

        /**
         * @type {Number}
         */
        this.AddressID = null;

        /**
         * @type {String}
         */
        this.Status = null;

        /**
         * @type {String}
         */
        this.PaymentMethod = null;

        /**
         * @type {Number}
         */
        this.Weight = null;

        /**
         * @type {Boolean}
         */
        this.Shipped = null;

        /**
         * @type {String}
         */
        this.TrackingNumber = null;

        /**
         * @type {Date}
         */
        this.DateShipped = null;

        /**
         * @type {String}
         */
        this.TimeShipped = null;
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'ID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'CustomerID', dataType: DataTypes.INTEGER, key: false, notNull: true },
            { name: 'AddressID', dataType: DataTypes.INTEGER, key: false, notNull: true },
            { name: 'Status', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'PaymentMethod', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Weight', dataType: DataTypes.FLOAT, key: false, notNull: false },
            { name: 'Shipped', dataType: DataTypes.BOOLEAN, key: false, notNull: false },
            { name: 'TrackingNumber', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'DateShipped', dataType: DataTypes.DATE, key: false, notNull: false },
            { name: 'TimeShipped', dataType: DataTypes.TIME, key: false, notNull: false }
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
        ds.orders = [];
        //generate data
        for (let x = 0; x < options.order.count; x++) {
            let order = new Order();
            order.ID = (x + 1);
            order.CustomerID = util.random(1, ds.customers.length + 1);
            order.AddressID = util.random(1, ds.addresses.length + 1);
            order.Shipped = false;
            switch (util.random(0, 5)) {
                case 0: order.Status = 'PENDING'; break;
                case 1: order.Status = 'OPEN'; break;
                case 2: order.Status = 'SHIPPING'; break;
                case 3: order.Status = 'COMPLETE'; break;
                case 4: order.Status = Math.random() <= 0.5 ? 'CANCELLED' : 'RETURNED'; break;
            }
            switch (util.random(0, 4)) {
                case 0: order.PaymentMethod = 'CHECK'; break;
                case 1: order.PaymentMethod = 'CASH'; break;
                case 2: order.PaymentMethod = 'CREDITCARD'; break;
                case 3: order.PaymentMethod = 'GIFTCARD'; break;
            }
            if (order.Status !== 'PENDING' && order.Status !== 'CANCELLED') {
                if (order.Status !== 'OPEN' || (order.Status !== 'OPEN' && Math.random() <= 0.7)) {
                    order.Weight = util.random(100, 10000) / 100;
                }
            }
            if (order.Status === 'COMPLETE' || order.Status === 'RETURNED') {
                order.Shipped = true;
                if (Math.random() > 0.05) {
                    order.TrackingNumber = util.random(10000, 99999).toString() + crypto.randomBytes(util.random(16, 32)).toString('hex').toUpperCase();
                }
                let customer = ds.customers[order.CustomerID - 1];
                order.DateShipped = util.randomDate(customer.DateCreated, new Date());
                order.TimeShipped = order.DateShipped.toISOString().replace(/.+T/, '');
                order.DateShipped = order.DateShipped.toISOString().replace(/T.+/, '');
            }
            //done
            ds.orders.push(order);
        }
    }

}

module.exports = Order;