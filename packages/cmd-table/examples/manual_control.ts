import { Table, Cell } from '../src';

console.log('--- Manual Control Demo ---');
console.log('Demonstrates accessing internal primitives for custom logic.\n');

const table = new Table();

// 1. Manually add columns with custom logic
const cols = ['ID', 'Value', 'Status'];
cols.forEach(name => table.addColumn({ name, key: name }));

// 2. Add rows manually
for (let i = 0; i < 5; i++) {
    table.addRow({ ID: i, Value: Math.random() * 100, Status: i % 2 === 0 ? 'OK' : 'FAIL' });
}

console.log('Original Table:');
console.log(table.render());

// 3. Direct Row Manipulation (Custom Sort)
// We can access table.rows directly
console.log('\nCustom Sort (by Value descending):');
table.rows.sort((a, b) => {
    // Manually extracting cell content
    // Note: Column 1 is 'Value'
    const valA = Number(a.cells[1].content);
    const valB = Number(b.cells[1].content);
    return valB - valA;
});
console.log(table.render());

// 4. Manual Cell Modification
// Highlight all 'FAIL' status in Red manually
console.log('\nManual Cell Highlighting:');
table.rows.forEach(row => {
    const statusCell = row.cells[2]; // Column 2 is Status
    if (statusCell.content === 'FAIL') {
        // Direct property access
        // Note: Cell content is usually a string or primitive, but we can wrap it
        // Simulating manual ANSI wrapping since Cell doesn't have a 'color' setter exposed publicly yet
        // But we can mutate content:
        statusCell.content = `\x1b[31m${statusCell.content}\x1b[39m`;
    }
});
console.log(table.render());

// 5. Build your own Renderer Logic
// Access data structure to do something completely custom
console.log('\nCustom Iteration (Extracting IDs):');
const ids = table.rows.map(row => row.cells[0].content);
console.log('IDs:', ids.join(', '));
