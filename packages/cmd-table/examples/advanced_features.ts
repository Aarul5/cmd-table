import { Table } from '../src'; // Assuming running via ts-node from root

console.log('--- Advanced Features Demo ---\n');

// 1. Header Groups & Footers
console.log('1. Header Groups & Footers');
const table1 = new Table({
    headerGroups: [
        { title: 'Employee Info', colSpan: 2 },
        { title: 'Performance', colSpan: 2 }
    ]
});

table1.addColumn('Name');
table1.addColumn('Role');
table1.addColumn({ name: 'Score', align: 'right' });
table1.addColumn({ name: 'Bonus', align: 'right' });

table1.addRow({ Name: 'Alice', Role: 'Dev', Score: 95, Bonus: 1000 });
table1.addRow({ Name: 'Bob', Role: 'PM', Score: 88, Bonus: 800 });
table1.addRow({ Name: 'Charlie', Role: 'QA', Score: 92, Bonus: 900 });

// Automatic Summary
table1.summarize(['Bonus'], 'sum');
table1.summarize(['Score'], 'avg');

console.log(table1.render());
console.log('\n');


// 2. Sorting
console.log('2. Sorting');
const table2 = new Table();
table2.addColumn('Product');
table2.addColumn({ name: 'Price', align: 'right' });
table2.addColumn({ name: 'Stock', align: 'right' });

table2.addRows([
    { Product: 'Laptop', Price: 1200, Stock: 50 },
    { Product: 'Mouse', Price: 25, Stock: 200 },
    { Product: 'Keyboard', Price: 80, Stock: 15 },
    { Product: 'Monitor', Price: 300, Stock: 40 }
]);

console.log('Original:');
console.log(table2.render());

console.log('\nSorted by Price (Ascending):');
table2.sort('Price');
console.log(table2.render());

console.log('\nSorted by Stock (Descending):');
table2.sort('Stock', 'desc');
console.log(table2.render());
console.log('\n');


// 3. Responsive Mode (Simulation)
console.log('3. Responsive Mode (Simulated Width: 40 chars)');
const table3 = new Table({
    terminalWidth: 40,
    responsiveMode: 'hide'
});

table3.addColumn({ name: 'ID', priority: 0, width: 5 }); // Keep (High Priority)
table3.addColumn({ name: 'Message', priority: 10 }); // Hide first (Low Priority)
table3.addColumn({ name: 'Status', priority: 1, width: 10 }); // Keep (Medium Priority)

table3.addRow(['101', 'System initialization started successfully', 'OK']);
table3.addRow(['102', 'Connection to database failed', 'ERROR']);

console.log(table3.render());
