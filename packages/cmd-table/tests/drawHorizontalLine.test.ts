import { Table } from '../src/Table';

describe('Table drawHorizontalLine callback', () => {
    test('controls which horizontal borders are drawn', () => {
        const t = new Table({
            drawHorizontalLine: (index, size) => {
                // Draw only top and bottom borders
                return index === 0 || index === size;
            }
        });
        t.addColumn('Header 1');
        t.addColumn('Header 2');
        t.addRow(['Data 1', 'Data 2']);
        t.addRow(['Data 3', 'Data 4']);

        const output = t.render();
        const lines = output.split('\n');

        // Check for top border (begins with top-left corner)
        expect(lines[0].startsWith('╭')).toBe(true);

        // Check for bottom border (begins with bottom-left corner)
        expect(lines[lines.length - 1].startsWith('╰')).toBe(true);

        // Middle join lines should be completely absent
        const joinLines = lines.filter(line => line.startsWith('├'));
        expect(joinLines.length).toBe(0);
    });

    test('replaces the default behavior for header separation', () => {
        const t = new Table({
            // Let's only draw the border immediately after the header (index 1 for top, index 2 for post-header if data exists)
            // Wait, size for 1 header row + 2 data rows = 3 rows.
            // Indices: 0 (top), 1 (post-header), 2 (post-data1), 3 (bottom).
            drawHorizontalLine: (index, size) => {
                return index === 1;
            }
        });
        t.addColumn('A');
        t.addRow(['B']);
        t.addRow(['C']);

        const output = t.render();
        const lines = output.split('\n');

        // No top or bottom border
        expect(lines[0].startsWith('╭')).toBe(false);
        expect(lines[lines.length - 1].startsWith('╰')).toBe(false);

        // One join line exists
        const joinLines = lines.filter(line => line.startsWith('├'));
        expect(joinLines.length).toBe(1);
    });

    test('works properly with header groups', () => {
        const t = new Table({
            headerGroups: [{ title: 'Group', colSpan: 2 }],
            drawHorizontalLine: (index, size) => index === size // Only bottom border
        });
        t.addColumn('A'); t.addColumn('B');
        t.addRow([1, 2]);

        const output = t.render();
        const lines = output.split('\n');

        // No top, no internal borders
        expect(lines[0].startsWith('╭')).toBe(false);
        const joinLines = lines.filter(line => line.startsWith('├'));
        expect(joinLines.length).toBe(0);

        // Bottom border should exist
        expect(lines[lines.length - 1].startsWith('╰')).toBe(true);
    });

    test('is overridden if false is returned but data requires lines? No, it strips all lines.', () => {
        const t = new Table({
            drawHorizontalLine: () => false
        });
        t.addColumn('X');
        t.addRow(['Y']);

        const output = t.render();

        expect(output.includes('╭')).toBe(false);
        expect(output.includes('├')).toBe(false);
        expect(output.includes('╰')).toBe(false);
    });
});
