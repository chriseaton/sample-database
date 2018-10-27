const crypto = require('crypto');
const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class User {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {Number}
         */
        this.RoleID = null;

        /**
         * @type {String}
         */
        this.UserName = null;

        /**
         * @type {String}
         */
        this.Password = null;

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
            { name: 'RoleID', dataType: DataTypes.INTEGER, key: false, notNull: true },
            { name: 'UserName', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'Password', dataType: DataTypes.TEXT, key: false, notNull: true },
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
        //clear old data
        ds.users = [];
        //generate data
        for (let x = 0; x < options.user.count; x++) {
            let u = new User();
            u.ID = (x + 1);
            u.RoleID = util.random(1, ds.roles.length + 1);
            u.DateCreated = util.randomDate(new Date().setTime(Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)), new Date());
            u.UserName = firstNames[util.random(0, firstNames.length)].toLowerCase().replace(/[^Az]/, '');
            u.UserName += '.' + lastNames[util.random(0, lastNames.length)].toLowerCase().replace(/[^Az]/, '');
            let shasum = crypto.createHash('sha1');
            shasum.update(`password${u.ID}`);
            u.Password = shasum.digest('hex');
            //     "Password": "2AA60A8FF7FCD473D321E0146AFD9E26DF395147",
            if (Math.random() < 0.5) {
                u.DateUpdated = util.randomDate(u.DateCreated, new Date());
            }
            if (Math.random() <= 0.1) {
                u.DateDeleted = util.randomDate(u.DateUpdated || u.DateCreated, new Date());
            }
            //done
            ds.users.push(u);
        }
    }

}

module.exports = User;