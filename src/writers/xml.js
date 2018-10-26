const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');
const xml = require('xml-js');
const pluralize = require('pluralize');

/**
 * Writes the `Dataset` instance to xml files.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        console.info(`Writing to XML file(s)...`);
        let dir = path.join(options.writers.target, 'XML');
        //ensure directory
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }
        //write data
        let schemas = ds.schemas();
        for (let [cls, prop] of schemas) {
            let data = ds[prop];
            let wrapper = {};
            let inner = wrapper[pluralize(cls.name)] = {};
            inner[cls.name] = data;
            fs.writeFileSync(path.join(dir, `${cls.name}.xml`), '<?xml version="1.0" encoding="utf-8"?>\n' + xml.json2xml(wrapper, { compact: true, spaces: 4 }));
        }
    }
}

module.exports = write;