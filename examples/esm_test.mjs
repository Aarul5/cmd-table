import { Table } from '../dist/index.mjs';

const table = new Table({ compact: true });
table.addColumn('Type');
table.addColumn('Status');
table.addRow(['ES Module (import)', 'Works']);

console.log(table.render());
