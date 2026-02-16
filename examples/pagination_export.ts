import { Table } from '../src';
import { CsvRenderer } from '../src/renderers/CsvRenderer';
import { JsonRenderer } from '../src/renderers/JsonRenderer';
import { HtmlRenderer } from '../src/renderers/HtmlRenderer';
import { MarkdownRenderer } from '../src/renderers/MarkdownRenderer';

console.log('--- Pagination & Export Demo ---\n');

// Create a table with enough data for pagination
const table = new Table();
table.addColumn('ID');
table.addColumn('Name');
table.addColumn('Role');
table.addColumn('Department');

const data = [
    { ID: 1, Name: 'Alice', Role: 'Dev', Department: 'Engineering' },
    { ID: 2, Name: 'Bob', Role: 'PM', Department: 'Product' },
    { ID: 3, Name: 'Charlie', Role: 'QA', Department: 'Engineering' },
    { ID: 4, Name: 'David', Role: 'Designer', Department: 'Design' },
    { ID: 5, Name: 'Eve', Role: 'Dev', Department: 'Engineering' },
    { ID: 6, Name: 'Frank', Role: 'Manager', Department: 'Sales' },
    { ID: 7, Name: 'Grace', Role: 'Dev', Department: 'Engineering' },
    { ID: 8, Name: 'Heidi', Role: 'Designer', Department: 'Design' },
    { ID: 9, Name: 'Ivan', Role: 'QA', Department: 'Engineering' },
    { ID: 10, Name: 'Judy', Role: 'CEO', Department: 'Management' },
    { ID: 11, Name: 'Kevin', Role: 'Intern', Department: 'Engineering' },
    { ID: 12, Name: 'Leo', Role: 'Dev', Department: 'Engineering' },
];

table.addRows(data);

// --- Pagination ---
const pageSize = 5;
const totalPages = Math.ceil(table.rows.length / pageSize);

console.log(`1. Rendering ${totalPages} Pages (Programmatic Loop)`);
for (let i = 1; i <= totalPages; i++) {
    console.log(`\n--- Page ${i} of ${totalPages} ---`);
    console.log(table.paginate(i, pageSize).render());
}

console.log('\n(Note: For interactive browsing of large datasets, use the InteractiveTable class!)\n');


// --- Exports ---
console.log('2. Exports');

console.log('--- CSV Export ---');
const csv = new CsvRenderer().render(table);
console.log(csv);
console.log('\n');

console.log('--- JSON Export (First 2 items) ---');
const json = new JsonRenderer().render(table);
// Pretty print just the first few items to avoid flooding console
console.log(JSON.stringify(JSON.parse(json).slice(0, 2), null, 2));
console.log('... (truncated)');
console.log('\n');

console.log('--- Markdown Export (First 5 rows) ---');
// Render a smaller table for demo
const mdTable = new Table();
mdTable.addColumn('Name');
mdTable.addColumn('Role');
mdTable.addRows(data.slice(0, 3));
const md = new MarkdownRenderer().render(mdTable);
console.log(md);
console.log('\n');

console.log('--- HTML Export (Snippet) ---');
const html = new HtmlRenderer().render(mdTable); // Use smaller table for demo
console.log(html);
console.log('\n');
