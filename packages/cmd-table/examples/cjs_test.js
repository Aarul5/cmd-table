const { Table } = require('../dist/index.js');

const table = new Table({ compact: true });
table.addColumn('Type');
table.addColumn('Status');
table.addRow(['CommonJS (require)', 'Works']);

console.log(table.render());
