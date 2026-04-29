import { Table, StreamRenderer } from '../src';

const table = new Table();
table.addColumn({ name: 'ID', width: 5 });
table.addColumn({ name: 'Log Message', width: 25 });
table.addColumn({ name: 'Status', width: 10 });

const stream = new StreamRenderer(table);

console.log(stream.renderHeader());

const logs = [
    { id: 1, msg: 'System init...', status: 'OK' },
    { id: 2, msg: 'Loading modules...', status: 'OK' },
    { id: 3, msg: 'Connecting to DB...', status: 'PENDING' }
];

logs.forEach(log => {
    // Add row to our "virtual" table just for object creation convenience
    const row = table.addRow([log.id, log.msg, log.status]);
    console.log(stream.renderRows([row]));
});

console.log(stream.renderFooter());
