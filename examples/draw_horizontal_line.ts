import { Table } from '../src/Table';

console.log('--- Custom Border Output ---\n');

// Example 1: Show only top, header split, and bottom (like classic markdown table)
const table1 = new Table({
    drawHorizontalLine: (index, size) => {
        // index 0 = top border
        // index 1 = border between header and first data row
        // index === size = bottom border
        return index === 0 || index === 1 || index === size;
    }
});

table1.addColumn('Name');
table1.addColumn('Role');
table1.addRows([
    ['Alice', 'Developer'],
    ['Bob', 'Manager'],
    ['Charlie', 'Designer']
]);

console.log('1. Header separated, no data row lines:');
console.log(table1.render());
console.log('\n');

// Example 2: Draw a line every 2 data rows
const table2 = new Table({
    drawHorizontalLine: (index, size) => {
        // Always draw top, header split, and bottom
        if (index === 0 || index === 1 || index === size) return true;
        // Also draw line every 2 data rows (index 1 is header split, so data indices start at 2)
        return (index - 1) % 2 === 0;
    }
});

table2.addColumn('ID');
table2.addColumn('Status');
for (let i = 1; i <= 6; i++) {
    table2.addRow([i, i % 2 === 0 ? 'Pass' : 'Fail']);
}

console.log('2. Line every 2 data rows:');
console.log(table2.render());
