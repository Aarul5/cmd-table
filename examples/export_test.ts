import { Table, CsvRenderer, JsonRenderer, MarkdownRenderer } from '../src';

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
const csv = new CsvRenderer().render(table);
console.log(csv);

console.log('\n--- JSON Export ---');
const json = new JsonRenderer().render(table);
console.log(JSON.stringify(JSON.parse(json), null, 2)); // Pretty print JSON

console.log('\n--- Markdown Export ---');
const md = new MarkdownRenderer().render(table);
console.log(md);
