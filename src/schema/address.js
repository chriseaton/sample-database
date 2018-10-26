const Options = require('../options.js');
const Dataset = require('../dataset.js');
const Seed = require('../seed.js');
const DataTypes = require('../data-types.js');
const util = require('../util.js');

class Address {
    constructor() {

        /**
         * @type {Number}
         */
        this.ID = null;

        /**
         * @type {String}
         */
        this.Line1 = null;

        /**
         * @type {String}
         */
        this.Line2 = null;

        /**
         * @type {String}
         */
        this.City = null;

        /**
         * @type {String}
         */
        this.PostalCode = null;

        /**
         * @type {String}
         */
        this.StateProvince = null;

        /**
         * @type {String}
         */
        this.Country = null;

        /**
         * @type {Number}
         */
        this.Latitude = null;

        /**
         * @type {Number}
         */
        this.Longitude = null;
    }

    /**
     * Returns an array of each schema property with a generalized definition for cross-format parsing.
     * @returns {{name:String, dataType:String, key:Boolean, notNull:Boolean}}
     */
    static spec() {
        return [
            { name: 'ID', dataType: DataTypes.INTEGER, key: true, notNull: true },
            { name: 'Line1', dataType: DataTypes.TEXT, key: false, notNull: true },
            { name: 'Line2', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'City', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'PostalCode', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'StateProvince', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Country', dataType: DataTypes.TEXT, key: false, notNull: false },
            { name: 'Latitude', dataType: DataTypes.FLOAT, key: false, notNull: false },
            { name: 'Longitude', dataType: DataTypes.FLOAT, key: false, notNull: false }
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
        let usCitiesGeo = seed.load('./Seed/us_cities_geo.json');
        let usCities = seed.load('./Seed/us_cities.json');
        let usZipGeo = seed.load('./Seed/us_zip_geo.json');
        let usStreets = seed.load('./Seed/us_streets.json');
        let usStreetTypes = ['Rd.', 'Road', 'St.', 'Street', 'Ct.', 'Court', 'Sq.', 'Square', 'Ave.', 'Avenue', 'Ln.', 'Lane'];
        let states = Object.keys(usCities);
        //clear old values
        ds.addresses = [];
        //generate new objects
        for (let x = 0; x < options.address.count; x++) {
            let address = new Address();
            address.ID = (x + 1);
            address.Country = 'United States of America';
            //generate random line 1
            if (Math.random() < 0.7) {
                address.Line1 = util.random(100, 9999).toString() + ' ';
            } else {
                address.Line1 = util.random(100, 9999).toString() + ' ';
            }
            address.Line1 += usStreets[util.random(0, usStreets.length)] + ' ';
            address.Line1 += usStreetTypes[util.random(0, usStreetTypes.length)];
            //generate random line 2
            if (Math.random() > 0.7) {
                let choice = Math.random();
                if (choice <= 0.2) {
                    address.Line2 = 'Suite #'
                } else if (choice <= 0.3) {
                    address.Line2 = 'Ste. #'
                } else if (choice <= 0.4) {
                    address.Line2 = '#'
                } else if (choice <= 0.8) {
                    address.Line2 = 'Apt. #'
                } else {
                    address.Line2 = 'Unit #'
                }
                address.Line2 += util.random(100, 999).toString();
            }
            //find random state
            let stateIndex = util.random(0, states.length);
            address.StateProvince = states[stateIndex];
            //find random city
            let cities = Object.keys(usCities[states[stateIndex]].cities);
            let cityIndex = util.random(0, cities.length);
            address.City = cities[cityIndex];
            //find random zip
            let zips = usCities[states[stateIndex]].cities[address.City];
            address.PostalCode = zips[util.random(0, zips.length)];
            //look for lat/long
            for (let zip in usZipGeo) {
                if (parseInt(zip) === address.PostalCode) {
                    address.Latitude = usZipGeo[zip][0];
                    address.Longitude = usZipGeo[zip][1];
                }
            }
            if (!address.Latitude || !address.Longitude) {
                for (let i = 0; i < usCitiesGeo.length; i++) {
                    if (usCitiesGeo[i].state.match(new RegExp(address.StateProvince, 'i'))) {
                        if (usCitiesGeo[i].city.match(new RegExp(address.City, 'i'))) {
                            address.Latitude = usCitiesGeo[i].latitude;
                            address.Longitude = usCitiesGeo[i].longitude;
                            break;
                        }
                    }
                }
            }
            //done
            ds.addresses.push(address);
        }
    }

}

module.exports = Address;