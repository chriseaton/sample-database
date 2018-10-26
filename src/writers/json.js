const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');

/**
 * Writes the `Dataset` instance to json files.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        console.info(`Writing to JSON file(s)...`);
        let dir = path.join(options.writers.target, 'JSON');
        //ensure directory
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
        //write data
        let schemas = ds.schemas();
        for (let [cls, prop] of schemas) {
            let data = ds[prop];
            fs.writeFileSync(path.join(dir, `${cls.name}.json`), JSON.stringify(data, null, 4));
        }
    }
}

module.exports = write;