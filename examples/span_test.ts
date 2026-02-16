import { Table } from '../src';

const table = new Table();

table.addColumn('Col 1');
table.addColumn('Col 2');
table.addColumn('Col 3');

// Normal row
table.addRow(['A', 'B', 'C']);

// Row with span
table.addRow([
    { content: 'Span 2 Cols', colSpan: 2 },
    'C'
]);

// Row with span at end
table.addRow([
    'A',
    { content: 'Span 2 (End)', colSpan: 2 }
]);

// Full span
table.addRow([
    { content: 'Full Span', colSpan: 3 }
]);

console.log(table.render());
