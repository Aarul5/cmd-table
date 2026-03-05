import { Table } from '../src/Table';

console.log('--- Transposed Table Example ---\n');

const table = new Table();
table.addColumn('Metric');
table.addColumn({ name: 'Server A', key: 'serverA' });
table.addColumn({ name: 'Server B', key: 'serverB' });
table.addColumn({ name: 'Server C', key: 'serverC' });

table.addRow({ Metric: 'CPU usage', serverA: '45%', serverB: '92%', serverC: '12%' });
table.addRow({ Metric: 'Memory', serverA: '16GB', serverB: '32GB', serverC: '64GB' });
table.addRow({ Metric: 'Status', serverA: 'Online', serverB: 'Warning', serverC: 'Online' });

console.log('1. Original Orientation (Metrics as rows, Servers as columns):');
console.log(table.render());

console.log('\n2. Transposed Orientation (Servers as rows, Metrics as columns):');
const transposed = table.transpose();
console.log(transposed.render());
