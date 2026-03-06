import { Table } from '../src/Table';
import { stripAnsi } from '../src/utils/textUtils';

describe('rowColor callback', () => {
    // --- Core correctness ---
    test('applies ANSI color codes to rows matching the condition', () => {
        const t = new Table({
            rowColor: (row) => Number(row.val) > 50 ? 'green' : 'red',
        });
        t.addColumn({ name: 'Val', key: 'val' });
        t.addRow({ val: '80' }); // green
        t.addRow({ val: '20' }); // red

        const output = t.render();
        // ANSI green=32, red=31
        expect(output).toContain('\u001B[32m'); // green
        expect(output).toContain('\u001B[31m'); // red
    });

    test('returns undefined leaves the row unstyled', () => {
        const t = new Table({
            rowColor: (row) => Number(row.val) > 100 ? 'green' : undefined,
        });
        t.addColumn({ name: 'Val', key: 'val' });
        t.addRow({ val: '50' }); // no color

        const output = t.render();
        // No green ANSI in data rows
        expect(output).not.toContain('\u001B[32m');
    });

    test('rowIndex is passed correctly (0-based)', () => {
        const captured: number[] = [];
        const t = new Table({
            rowColor: (_, i) => { captured.push(i); return undefined; },
        });
        t.addColumn('X');
        t.addRow({ X: 'a' });
        t.addRow({ X: 'b' });
        t.addRow({ X: 'c' });
        t.render();
        expect(captured).toEqual([0, 1, 2]);
    });

    test('rowData object contains the correct keys and values', () => {
        const seen: Record<string, any>[] = [];
        const t = new Table({
            rowColor: (row) => { seen.push({ ...row }); return undefined; },
        });
        t.addColumn({ name: 'Name', key: 'name' });
        t.addColumn({ name: 'Score', key: 'score' });
        t.addRow({ name: 'Alice', score: '95' });
        t.render();

        expect(seen).toHaveLength(1);
        expect(seen[0].name).toBe('Alice');
        expect(seen[0].score).toBe('95');
    });

    test('header row is never colored by rowColor', () => {
        const t = new Table({
            // Always return green — if header were colored it would appear differently
            rowColor: () => 'green',
        });
        t.addColumn({ name: 'Status', key: 'status' });
        t.addRow({ status: 'OK' });

        const output = t.render();
        const lines = output.split('\n');

        // Find the header line (contains 'Status' without color prefix from rowColor)
        // Header uses headerColor (magenta=35), not green (32)
        const headerLine = lines.find(l => stripAnsi(l).includes('Status'));
        expect(headerLine).toBeDefined();
        expect(headerLine).not.toContain('\u001B[32m'); // not green
    });

    test('all-green table has green on every data row', () => {
        const t = new Table({
            rowColor: () => 'green',
        });
        t.addColumn('Item');
        t.addRow({ Item: 'Alpha' });
        t.addRow({ Item: 'Beta' });
        t.addRow({ Item: 'Gamma' });

        const output = t.render();
        const dataLines = output.split('\n').filter(l => stripAnsi(l).match(/Alpha|Beta|Gamma/));
        dataLines.forEach(line => {
            expect(line).toContain('\u001B[32m');
        });
    });

    test('works alongside zebra: true — rowColor takes priority', () => {
        const t = new Table({
            zebra: true,
            rowColor: (_, i) => i === 0 ? 'yellow' : undefined,
        });
        t.addColumn('X');
        t.addRow({ X: 'first' });  // yellow
        t.addRow({ X: 'second' }); // zebra (dim)

        const output = t.render();
        expect(output).toContain('\u001B[33m'); // yellow ANSI
    });

    test('table without rowColor renders normally (no regression)', () => {
        const t = new Table();
        t.addColumn('Name');
        t.addRow({ Name: 'Alice' });
        const output = t.render();
        expect(output).toContain('Alice');
        // No unexpected coloring beyond header magenta
        expect(output).not.toContain('\u001B[32m');
        expect(output).not.toContain('\u001B[31m');
    });
});
