const fs = require('fs');
const path = require('path');
const Dataset = require('../dataset.js');
const Options = require('../options.js');
const DataTypes = require('../data-types.js');
const sql = require('sql');
const pluralize = require('pluralize');

/**
 * Writes the `Dataset` instance to a sqlite script.
 * @param {Options} options
 * @param {Dataset} ds 
 */
function write(options, ds) {
    if (options.writers.json) {
        let engines = new Map([
            ['SQLite', 'sqlite'],
            ['MySQL', 'mysql'],
            ['MSSQL', 'mssql'],
            ['Postgres', 'postgres']
        ]);
        for (let [engineName, dialect] of engines) {
            console.info(`Writing to ${engineName} script file...`);
            let dir = path.join(options.writers.target, engineName);
            //ensure directory
            if (fs.existsSync(dir) === false) {
                fs.mkdirSync(dir);
            }
            //write data
            let schemas = ds.schemas();
            let script = '';
            let tableMap = new Map();
            sql.setDialect(dialect);
            //create tables.
            for (let [cls, prop] of schemas) {
                let spec = cls.spec();
                let columns = [];
                for (let s of spec) {
                    let col = { name: s.name, notNull: s.notNull };
                    if (dialect === 'sqlite') {
                        switch (s.dataType) {
                            case DataTypes.BINARY: col.dataType = 'BLOB'; break;
                            case DataTypes.BOOLEAN: col.dataType = 'INTEGER'; break;
                            case DataTypes.DATE: col.dataType = 'TEXT'; break;
                            case DataTypes.DATETIME: col.dataType = 'TEXT'; break;
                            case DataTypes.FLOAT: col.dataType = 'REAL'; break;
                            case DataTypes.INTEGER: col.dataType = 'INTEGER'; break;
                            case DataTypes.TEXT: col.dataType = 'TEXT'; break;
                            case DataTypes.TIME: col.dataType = 'TEXT'; break;
                        }
                    } else {
                        switch (s.dataType) {
                            case DataTypes.BINARY: col.dataType = 'VARBINARY(MAX)'; break;
                            case DataTypes.BOOLEAN: col.dataType = 'BIT'; break;
                            case DataTypes.DATE: col.dataType = 'DATE'; break;
                            case DataTypes.DATETIME: col.dataType = 'DATETIME'; break;
                            case DataTypes.FLOAT: col.dataType = 'FLOAT'; break;
                            case DataTypes.INTEGER: col.dataType = 'INT'; break;
                            case DataTypes.TEXT: col.dataType = 'VARCHAR(512)'; break;
                            case DataTypes.TIME: col.dataType = 'TIME'; break;
                        }
                    }
                    columns.push(col);
                }
                let table = sql.define({
                    name: pluralize(cls.name),
                    columns: columns
                });
                tableMap.set(cls.name, table);
                script += `--Create table "${cls.name}".\n`;
                script += table.create();
                script += ';\n\n';
            }
            //insert data.
            for (let [cls, prop] of schemas) {
                let data = ds[prop];
                let spec = cls.spec();
                let table = tableMap.get(cls.name);
                script += `--Insert data for table "${cls.name}".\n`;
                for (let d of data) {
                    //convert
                    for (let s of spec) {
                        if (s.dataType === DataTypes.BOOLEAN) {
                            if (d[s.name] === false) {
                                d[s.name] = 0;
                            } else if (d[s.name] === true) {
                                d[s.name] = 1;
                            }
                        } else if (s.dataType === DataTypes.BINARY && d[s.name]) {
                            d[s.name] = '{hex{' + Buffer.from(d[s.name], 'base64').toString('hex').toUpperCase() + '}}';
                        }
                    }
                    //generate query
                    let query = table.insert(d).toString();
                    //handle binary
                    if (query.indexOf('{hex{') > -1) {
                        query = query.replace(/('{hex{)(.+)(}}')/, '0x$2');
                    }
                    //add to script
                    script += `${query};\n`;
                }
                script += '\n\n';
            }
            //write the file
            fs.writeFileSync(path.join(dir, `sample-database.sql`), script);
        }
    }
}

module.exports = write;