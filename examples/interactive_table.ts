import { Table, InteractiveTable } from '../src';

const data = Array.from({ length: 50 }, (_, i) => ({
    ID: i + 1,
    Name: `User ${i + 1}`,
    Role: ['Dev', 'PM', 'QA', 'Designer'][i % 4],
    Status: ['Active', 'Inactive', 'Penny'][i % 3]
}));

const table = new Table();
table.addColumn({ name: 'ID', width: 5 });
table.addColumn({ name: 'Name', width: 20 });
table.addColumn({ name: 'Role', width: 10 });
table.addColumn({ name: 'Status', width: 10 });

table.addRows(data);

// One-line interactivity!
new InteractiveTable(table, { pageSize: 10 }).start();
