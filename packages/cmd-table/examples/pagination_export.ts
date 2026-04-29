import { Table } from '../src';


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
const pages = table.getPages(pageSize);

console.log(`1. Rendering ${pages.length} Pages (Using getPages)`);
pages.forEach((page, index) => {
    console.log(`\n--- Page ${index + 1} of ${pages.length} ---`);
    console.log(page.render());
});

console.log('\n(Note: For interactive browsing, use InteractiveTable!)\n');


// --- Exports ---
console.log('2. Exports');

console.log('--- CSV Export ---');
console.log(table.export('csv'));
console.log('\n');

console.log('--- JSON Export (First 2 items) ---');
const json = table.export('json');
// Pretty print just the first few items
console.log(JSON.stringify(JSON.parse(json).slice(0, 2), null, 2));
console.log('... (truncated)');
console.log('\n');

console.log('--- Markdown Export (First 5 rows) ---');
// Render a smaller table for demo
const mdTable = new Table();
mdTable.addColumn('Name');
mdTable.addColumn('Role');
mdTable.addRows(data.slice(0, 3));
console.log(mdTable.export('md'));
console.log('\n');

console.log('--- HTML Export (Snippet) ---');
console.log(mdTable.export('html'));
console.log('\n');
