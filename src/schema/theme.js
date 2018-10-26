const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class Theme {
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
        this.HexCode = null;
        
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'ID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'Name', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'HexCode', dataType: DataTypes.TEXT, key: false, notNull: true },
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
        let suffixes = ['Amazing', 'Ultra', 'Better', 'Super', 'Elite', 'Professional'];
        //clear old data
        ds.themes = [];
        //generate data
        for (let x = 0; x < options.theme.count; x++) {
            let t = new Theme();
            t.ID = (x + 1);
            let ci = util.random(0, colors.length);;
            t.Name = colors[ci].color;
            if (Math.random() <= 0.2) {
                t.Name += ' ' + suffixes[util.random(0, suffixes.length)];
            } else if (Math.random() < 0.2) {
                t.Name += ' X' + util.random(1,9).toString();
            }
            if (ds.themes.some(r => r.Name === t.Name)) {
                t.Name += ` (${util.random(100000, 999999)})`;
            }
            t.HexCode = colors[ci].hex;
            //done
            ds.themes.push(t);
        }
    }

}

module.exports = Theme;