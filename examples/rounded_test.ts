import { Table } from '../src';

const table = new Table({
    // headerColor defaults to magenta
    // theme defaults to Rounded
});

table.addColumn('Key'); // Should be Cyan by default
table.addColumn('Summary');
table.addColumn('Status');
table.addColumn('Assignee');
table.addColumn('Created');

const rows = [
    { Key: 'TRAIN-772', Summary: 'Query and attach evidence', Status: 'Done', Assignee: 'Milton S', Created: '2026-01-14' },
    { Key: 'TRAIN-771', Summary: 'Emit custom telemetry event', Status: 'Done', Assignee: 'Milton S', Created: '2026-01-14' },
    { Key: 'TRAIN-770', Summary: 'Configure Serilog sink', Status: 'Done', Assignee: 'Milton S', Created: '2026-01-14' },
    { Key: 'TRAIN-769', Summary: 'Validate storage safety', Status: 'Done', Assignee: 'Milton S', Created: '2026-01-14' }
];

rows.forEach(row => table.addRow(row));

console.log('--- Rounded Theme with Header & Column Colors ---');
console.log(table.render());
