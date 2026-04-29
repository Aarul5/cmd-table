import { Table, InteractiveTable } from '../src';

const table = new Table({
    columns: [
        { name: 'ID', key: 'id' },
        { name: 'Name', key: 'name' },
        { name: 'Email', key: 'email' },
        { name: 'Role', key: 'role' },
        { name: 'Status', key: 'status' },
    ]
});

// Add some dummy data
for (let i = 1; i <= 20; i++) {
    table.addRow({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'User',
        status: i % 2 === 0 ? 'Active' : 'Inactive'
    });
}

const interactive = new InteractiveTable(table, {
    pageSize: 5,
    onExit: () => {
        console.log('Exited.');
        process.exit(0);
    },
    onSelect: (rows) => {
        console.log('Selected:', rows);
        process.exit(0);
    }
});

console.log('Use [c] to toggle columns!');
interactive.start();
