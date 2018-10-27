const fs = require('fs');
const path = require('path');
const Options = require('./src/options.js');
const Dataset = require('./src/dataset.js');
const Seed = require('./src/seed.js');

const writers = [
    require('./src/writers/json.js'),
    require('./src/writers/toml.js'),
    require('./src/writers/yaml.js'),
    require('./src/writers/csv.js'),
    require('./src/writers/xml.js'),
    require('./src/writers/sql.js')
];

(function (args) {
    let options = Object.assign({}, Options);
    let seed = new Seed();
    let ds = new Dataset();
    //ensure Generated dir
    if (fs.existsSync(options.writers.target) === false) {
        fs.mkdirSync(options.writers.target);
    }
    if (args.length > 2) {
        console.log(args);
        if (args[2] === '--ltd' || args[2] === '-r') {
            let release = args[3];
        } else {
            console.error('Invalid arguments.');
            return;
        }
    }
    //generate data
    let schemas = ds.schemas();
    for (let [cls, prop] of schemas) {
        console.info(`Generating data for "${cls.name}" schema...`);
        cls.generate(options, seed, ds);
    }
    //write data
    for (let w of writers) {
        w(options, ds);
    }
    console.log('Done');
})(process.argv);