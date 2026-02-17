import { Table, HtmlTable, CsvTable, JsonTable } from '../src';

console.log('--- Export Integrations Demo ---\n');

// 1. Setup Data
console.log('1. Setting up Table Data');
const table = new Table({
    headerGroups: [
        { title: 'User Details', colSpan: 2 },
        { title: 'Status Info', colSpan: 2 }
    ],
    columns: [
        { name: 'ID', key: 'id' },
        { name: 'Username', key: 'username' },
        { name: 'Role', key: 'role' },
        { name: 'Active', key: 'active' }
    ]
});

table.addRows([
    { id: 101, username: 'alice_dev', role: 'Developer', active: 'Yes' },
    { id: 102, username: 'bob_design', role: 'Designer', active: 'No' },
    { id: 103, username: 'charlie_pm', role: 'Manager', active: 'Yes' }
]);

console.log('Original Table Render:');
console.log(table.render());
console.log('\n');

// 2. HTML Export
console.log('2. HTML Export');
const htmlOutput = HtmlTable.toHtml(table);
console.log('--- HTML Output Start ---');
console.log(htmlOutput);
console.log('--- HTML Output End ---\n');

// 3. CSV Export
console.log('3. CSV Export');
const csvOutput = CsvTable.toCsv(table);
console.log('--- CSV Output Start ---');
console.log(csvOutput);
console.log('--- CSV Output End ---\n');

// 4. JSON Export
console.log('4. JSON Export');
const jsonOutput = JsonTable.toJson(table);
console.log('--- JSON Output Start ---');
console.log(jsonOutput);
console.log('--- JSON Output End ---\n');
