import { Table, InteractiveTable } from '../src';

console.log('Generating data...');

const table = new Table({
    columns: [
        { name: 'ID', key: 'id', width: 5, color: 'cyan' },
        { name: 'Name', key: 'name', width: 20 },
        { name: 'Role', key: 'role', width: 10 },
        { name: 'Department', key: 'dept', width: 15 },
        { name: 'Status', key: 'status', width: 10 }
    ],
    responsiveMode: 'hide'
});

const roles = ['Dev', 'QA', 'PM', 'Designer', 'Manager'];
const depts = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing'];
const statuses = ['Active', 'Inactive', 'Penny'];

for (let i = 1; i <= 100; i++) {
    table.addRow({
        id: i,
        name: `User ${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        dept: depts[Math.floor(Math.random() * depts.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
    });
}

const interactive = new InteractiveTable(table, {
    pageSize: 15,
    onSelect: (rows) => {
        console.clear();
        console.log('\n--- Selected Rows ---');
        console.log(JSON.stringify(rows, null, 2));
        console.log(`\nTotal Selected: ${rows.length}`);
        process.exit(0);
    },
    onExit: () => {
        console.clear();
        console.log('Exited.');
        process.exit(0);
    }
});

interactive.start();
