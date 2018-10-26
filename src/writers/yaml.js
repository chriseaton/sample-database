const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');
const yaml = require('js-yaml');

/**
 * Writes the `Dataset` instance to yaml files.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        console.info(`Writing to YAML file(s)...`);
        let dir = path.join(options.writers.target, 'YAML');
        //ensure directory
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
        //write data
        let schemas = ds.schemas();
        for (let [cls, prop] of schemas) {
            let data = ds[prop];
            fs.writeFileSync(path.join(dir, `${cls.name}.yml`), yaml.safeDump(data));
    }
}
}

module.exports = write;