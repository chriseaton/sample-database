const fs = require('fs');
const path = require('path');
const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class Customer {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {String}
         */
        this.FirstName = null;

        /**
         * @type {String}
         */
        this.LastName = null;

        /**
         * @type {String}
         */
        this.Suffix = null;

        /**
         * @type {String}
         */
        this.CompanyName = null;

        /**
         * @type {String}
         */
        this.Title = null;

        /**
         * @type {String}
         */
        this.Notes = null;

        /**
         * @type {Number}
         */
        this.AccountNumber = null;

        /**
         * @type {String}
         */
        this.Photo = null;

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
            { name: 'FirstName', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'LastName', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'Suffix', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'CompanyName', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Title', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Notes', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'AccountNumber', dataType: DataTypes.FLOAT, key: false, notNull: false },
            { name: 'Photo', dataType: DataTypes.BINARY, key: false, notNull: false },
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
        let firstNames = seed.load('./Seed/person_names_first.json');
        let lastNames = seed.load('./Seed/person_names_last.json');
        let suffixes = seed.load('./Seed/person_names_suffix.json');
        let occupations = seed.load('./Seed/occupations.json');
        let companies = seed.load('./Seed/companies.json');
        let notes = seed.load('./Seed/person_notes.json');
        let photos = fs.readdirSync('./Seed/Photo/').filter(f => f.endsWith('.jpeg'));
        //clear old values
        ds.customers = [];
        //generate data
        for (let x = 0; x < options.customer.count; x++) {
            let customer = new Customer();
            customer.ID = (x + 1);
            customer.FirstName = firstNames[util.random(0, firstNames.length)];
            customer.LastName = lastNames[util.random(0, lastNames.length)];
            customer.DateCreated = util.randomDate(new Date().setTime(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)), new Date());
            if (Math.random() <= 0.2) {
                customer.Suffix = suffixes[util.random(0, suffixes.length)];
            }
            if (Math.random() <= 0.6) {
                customer.CompanyName = companies[util.random(0, companies.length)];
                customer.Title = occupations[util.random(0, occupations.length)];
            } else if (Math.random() <= 0.5) {
                customer.CompanyName = companies[util.random(0, companies.length)];
            }
            if (Math.random() <= 0.8) {
                customer.AccountNumber = util.random(1000000000000, 99999999999999999)
            }
            if (Math.random() <= 0.2) {
                customer.Notes = notes[util.random(0, notes.length)];
            }
            if (Math.random() <= 0.3) {
                let photoFile = photos[util.random(0, photos.length)];
                customer.Photo = new Buffer(fs.readFileSync(path.join('./Seed/Photo/', photoFile))).toString('base64');
            }
            if (Math.random() < 0.5) {
                customer.DateUpdated = util.randomDate(customer.DateCreated, new Date());
            }
            if (Math.random() <= 0.1) {
                customer.DateDeleted = util.randomDate(customer.DateUpdated || customer.DateCreated, new Date());
            }
            //done
            ds.customers.push(customer);
        }
    }

}

module.exports = Customer;