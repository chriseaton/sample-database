const fs = require('fs');
const util = require('./util.js');

const occupations = JSON.parse(fs.readFileSync('./Seed/occupations.json'));

module.exports = function (count) {
    let output = [];
    //generate seeds
    for (let x = 0; x < count; x++) {
        let role = {
            'ID': (x + 1),
            'Name': null
        };
        if (x === 0) {
            role.Name = 'Administrator';
        } else if (x === 1) {
            role.Name = 'User';
        } else if (x === 2) {
            role.Name = 'Visitor';
        } else {
            role.Name = occupations[util.random(0, occupations.length)];
            if (output.some(r=>r.Name === role.Name)) {
                role.Name += ` (${util.random(100000, 999999)})`;
            }
        }
        //done
        output.push(role);
    }
    return output;
};