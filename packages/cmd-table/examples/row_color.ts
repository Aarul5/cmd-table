import { Table } from '../src/Table';

console.log('--- Conditional Row Color Example ---\n');

const table = new Table({
    // The rowColor callback receives the row data and the 0-based index.
    // It returns an ANSI color name, or undefined to leave the row unstyled.
    rowColor: (row, index) => {
        const score = Number(row.score);
        if (score >= 90) return 'green';
        if (score >= 70) return 'yellow';
        return 'red';
    }
});

table.addColumn({ name: 'Student', minWidth: 15 });
table.addColumn({ name: 'Subject', minWidth: 10 });
table.addColumn({ name: 'Score', key: 'score', align: 'right', minWidth: 8 });

table.addRow({ Student: 'Alice', Subject: 'Math', score: 95 });
table.addRow({ Student: 'Bob', Subject: 'History', score: 72 });
table.addRow({ Student: 'Charlie', Subject: 'Science', score: 45 });
table.addRow({ Student: 'Diana', Subject: 'English', score: 88 });

console.log(table.render());
