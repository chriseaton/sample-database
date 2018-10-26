const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');
const tomlify = require('tomlify-j0.4');

/**
 * Writes the `Dataset` instance to toml files.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        console.info(`Writing to TOML file(s)...`);
        let dir = path.join(options.writers.target, 'TOML');
        //ensure directory
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
        //write data
        let schemas = ds.schemas();
        for (let [cls, prop] of schemas) {
            let data = ds[prop];
            let wrapper = {};
            wrapper[cls.name] = data;
            fs.writeFileSync(path.join(dir, `${cls.name}.toml`), tomlify.toToml(wrapper, { space: 4 }));
    }
}
}

module.exports = write;