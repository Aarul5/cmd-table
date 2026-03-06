import { Table } from '../src/Table';

describe('Table.transpose()', () => {
    // --- Core correctness ---
    test('flips columns into rows and rows into columns', () => {
        const t = new Table();
        t.addColumn('Name');
        t.addColumn('Age');
        t.addRow({ Name: 'Alice', Age: '30' });
        t.addRow({ Name: 'Bob', Age: '25' });

        const tx = t.transpose();

        // Transposed table should have 1 + numRows columns
        expect(tx.columns.length).toBe(3); // Field, Row 1, Row 2
        expect(tx.columns[0].name).toBe('Field');
        expect(tx.columns[1].name).toBe('Row 1');
        expect(tx.columns[2].name).toBe('Row 2');

        // Transposed table should have numColumns rows
        expect(tx.rows.length).toBe(2); // Name row, Age row
    });

    test('first column of transposed table contains original column names', () => {
        const t = new Table();
        t.addColumn('Name');
        t.addColumn('Score');
        t.addRow({ Name: 'Alice', Score: '95' });

        const tx = t.transpose();
        const rendered = tx.render();
        expect(rendered).toContain('Name');
        expect(rendered).toContain('Score');
    });

    test('data values are correctly placed in transposed cells', () => {
        const t = new Table();
        t.addColumn({ name: 'Name', key: 'name' });
        t.addColumn({ name: 'Age', key: 'age' });
        t.addRow({ name: 'Alice', age: '30' });
        t.addRow({ name: 'Bob', age: '25' });

        const tx = t.transpose();
        const rendered = tx.render();

        expect(rendered).toContain('Alice');
        expect(rendered).toContain('Bob');
        expect(rendered).toContain('30');
        expect(rendered).toContain('25');
    });

    test('does not mutate the original table', () => {
        const t = new Table();
        t.addColumn('X');
        t.addRow({ X: '1' });

        const originalColCount = t.columns.length;
        const originalRowCount = t.rows.length;

        t.transpose();

        expect(t.columns.length).toBe(originalColCount);
        expect(t.rows.length).toBe(originalRowCount);
    });

    test('preserves theme from original table', () => {
        const t = new Table();
        t.addColumn('A');
        t.addRow({ A: 'x' });

        const tx = t.transpose();
        expect(tx.theme).toBe(t.theme);
    });

    // --- Edge cases ---
    test('handles single-column single-row table', () => {
        const t = new Table();
        t.addColumn('Val');
        t.addRow({ Val: '42' });

        const tx = t.transpose();
        expect(tx.columns.length).toBe(2); // Field + Row 1
        expect(tx.rows.length).toBe(1);    // Val row
        const rendered = tx.render();
        expect(rendered).toContain('Val');
        expect(rendered).toContain('42');
    });

    test('handles table with no rows — returns a field-only table', () => {
        const t = new Table();
        t.addColumn('Name');
        t.addColumn('Age');

        const tx = t.transpose();
        // No data rows → only the Field column exists (no Row N columns)
        expect(tx.columns.length).toBe(1);
        expect(tx.rows.length).toBe(2); // one row per original column
    });

    test('render output does not throw on transposed table', () => {
        const t = new Table();
        t.addColumn('A');
        t.addColumn('B');
        t.addRow({ A: 'hello', B: 'world' });
        t.addRow({ A: 'foo', B: 'bar' });

        expect(() => t.transpose().render()).not.toThrow();
    });
});
