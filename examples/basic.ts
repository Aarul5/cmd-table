import { Table } from '../src';

const table = new Table();

table.addColumn('ID');
table.addColumn('Name');
table.addColumn('Role');

table.addRow([1, 'Alice', 'Developer']);
table.addRow([2, 'Bob', 'Designer']);
table.addRow([3, 'Charlie', 'Manager']);

console.log(table.render());
