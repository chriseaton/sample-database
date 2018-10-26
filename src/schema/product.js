const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');
const crypto = require('crypto');

class Product {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {String}
         */
        this.Name = null;

        /**
         * @type {String}
         */
        this.ScanCode = null;

        /**
         * @type {Number}
         */
        this.Cost = null;

        /**
         * @type {Number}
         */
        this.Price = null;

        /**
         * @type {String}
         */
        this.ImageURL = null;

        /**
         * @type {Date}
         */
        this.DateCreated = null;

        /**
         * @type {Date}
         */
        this.DateUpdated = null;

        /**
         * @type {Date}
         */
        this.DateDeleted = null;
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'ID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'Name', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'ScanCode', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Cost', dataType: DataTypes.FLOAT, key: false, notNull: true },
            { name: 'Price', dataType: DataTypes.FLOAT, key: false, notNull: true },
            { name: 'ImageURL', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'DateCreated', dataType: DataTypes.DATETIME, key: false, notNull: true },
            { name: 'DateUpdated', dataType: DataTypes.DATETIME, key: false, notNull: false },
            { name: 'DateDeleted', dataType: DataTypes.DATETIME, key: false, notNull: false }
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
        //load seed data
        let colors = seed.load('./Seed/colors.json');
        let things = seed.load('./Seed/things.json');
        let sizes = ['large', 'small', 'huge', 'x2', 'x3', 'extra'];
        //clear old data
        ds.products = [];
        //generate data
        for (let x = 0; x < options.product.count; x++) {
            let product = new Product();
            product.ID = (x + 1);
            product.Name = things[util.random(0, things.length)];
            product.ScanCode = crypto.randomBytes(util.random(16, 48)).toString('hex').toUpperCase();
            product.Cost = util.random(100, 9999) / 100;
            product.DateCreated = util.randomDate(
                new Date().setTime(Date.now() - (3 * 365 * 24 * 60 * 60 * 1000)),
                new Date().setTime(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000))
                );
            if (Math.random() < 0.3) {
                product.Name = colors[util.random(0, colors.length)].color + ' ' + product.Name;
            } else if (Math.random() < 0.5) {
                product.Name += ', ' + colors[util.random(0, colors.length)].color;
            }
            if (Math.random() < 0.2) {
                product.Name += ' (' + sizes[util.random(0, sizes.length)] + ')';
            } else if (Math.random() < 0.2) {
                product.Name = sizes[util.random(0, sizes.length)] + ' ' + product.Name;
            }
            product.Name = util.toTitleCase(product.Name);
            product.Price = util.random(product.Cost + 0.5, product.Cost * 2);
            if (Math.random() < 0.4) {
                product.ImageURL = `http://placekitten.com/200/200?scanCode=${product.ScanCode}`
            }
            if (Math.random() < 0.3) {
                product.Price = Math.floor(product.Price);
            } else {
                product.Price = Math.ceil(product.Price) - 0.01;
            }
            if (Math.random() < 0.5) {
                product.DateUpdated = util.randomDate(product.DateCreated, new Date());
            }
            if (Math.random() <= 0.1) {
                product.DateDeleted = util.randomDate(product.DateUpdated || product.DateCreated, new Date());
            }
            //done
            ds.products.push(product);
        }
    }

}

module.exports = Product;