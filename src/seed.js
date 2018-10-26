const fs = require('fs');
const path = require('path');

class Seed {
    constructor() {

        /**
         * @type {Map<String, *>}
         * @private
         */
        this._data = new Map();

        this._lastDate = new Date('2000-01-01');
    }

    /**
     * Loads the specified JSON seed data, or if already loaded, returns the object.
     * @param {String} fileName - The seed file to load.
     * @returns {*}
     */
    load(fileName) {
        fileName = path.resolve(fileName);
        if (this._data.has(fileName) === false) {
            this._data.set(fileName, JSON.parse(fs.readFileSync(fileName)));
        }
        return this._data.get(fileName);
    }

    /**
     * Returns the next date in sequence with the last generated date, seperated by 1 day or the specified number of 
     * milliseconds. The first date begins January 1st, 2000.
     */
    nextDate(ms) {
        let d = new Date();
        if (typeof ms === 'number') {
            d.setTime(this._lastDate.getTime() + ms);
        } else {
            d.setTime(this._lastDate.getTime() + (24 * 60 * 60 * 1000));
        }
        this._lastDate = d;
        return d;
    }

}

module.exports = Seed;