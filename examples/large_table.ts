import { Table } from '../src';

const table = new Table();

table.addColumn({ name: 'ID', width: 5, align: 'right' });
table.addColumn({ name: 'First Name' });
table.addColumn({ name: 'Last Name' });
table.addColumn({ name: 'Email' });
table.addColumn({ name: 'Role' });
table.addColumn({ name: 'Status', align: 'center' });

const roles = ['Developer', 'Designer', 'Product Manager', 'Admin', 'User', 'QA'];
const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];

// Generate 100 rows of dummy data
for (let i = 1; i <= 100; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const firstName = `User${i}`;
    const lastName = `Test${i}`;

    table.addRow([
        i,
        firstName,
        lastName,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        role,
        status
    ]);
}

console.log(`Rendering table with ${table.rows.length} rows...`);
const start = Date.now();
console.log(table.render());
const end = Date.now();
console.log(`Rendered in ${end - start}ms`);
