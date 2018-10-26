const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class Role {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {String}
         */
        this.Name = null;
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'ID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'Name', dataType: DataTypes.TEXT, key: false, notNull: true }
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
        let occupations = seed.load('./Seed/occupations.json');
        //clear old values
        ds.roles = [];
        //generate data
        for (let x = 0; x < options.role.count; x++) {
            let role = new Role();
            role.ID = (x + 1);
            if (x === 0) {
                role.Name = 'Administrator';
            } else if (x === 1) {
                role.Name = 'User';
            } else if (x === 2) {
                role.Name = 'Visitor';
            } else {
                role.Name = occupations[util.random(0, occupations.length)];
                if (ds.roles.some(r => r.Name === role.Name)) {
                    role.Name += ` (${util.random(100000, 999999)})`;
                }
                role.Name = util.toTitleCase(role.Name);
            }
            //done
            ds.roles.push(role);
        }
    }

}

module.exports = Role;