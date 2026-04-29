import { Table } from '../src';

const table = new Table();
table.addColumn('Name');
table.addColumn('Role');
table.addColumn('Location');

table.addRows([
    { Name: 'Alice', Role: 'Dev', Location: 'New York' },
    { Name: 'Bob', Role: 'Designer', Location: 'London' },
    { Name: 'Charlie', Role: 'Manager', Location: 'San Francisco' }
]);

console.log('--- Original Table (Rounded) ---');
console.log(table.render());

console.log('\n--- CSV Export ---');
console.log(table.export('csv'));

console.log('\n--- JSON Export ---');
const json = table.export('json');
console.log(JSON.stringify(JSON.parse(json), null, 2)); // Pretty print JSON

console.log('\n--- Markdown Export ---');
console.log(table.export('md'));
