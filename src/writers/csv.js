const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');
const csv = require('csv-stringify');

/**
 * Writes the `Dataset` instance to csv files.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        console.info(`Writing to CSV file(s)...`);
        let dir = path.join(options.writers.target, 'CSV');
        //ensure directory
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
        //write data
        let schemas = ds.schemas();
        for (let [cls, prop] of schemas) {
            let data = ds[prop];
            csv(data, { header: true }, function (err, data) {
                fs.writeFileSync(path.join(dir, `${cls.name}.csv`), data);
            });
        }
    }
}

module.exports = write;