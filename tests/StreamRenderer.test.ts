import { Table } from '../src/Table';
import { StreamRenderer } from '../src/renderers/StreamRenderer';

describe('StreamRenderer', () => {
    let table: Table;
    let stream: StreamRenderer;

    beforeEach(() => {
        table = new Table();
        table.addColumn('Name');
        table.addColumn('Age');
        stream = new StreamRenderer(table);
    });

    test('renderHeader() returns header string', () => {
        const header = stream.renderHeader();
        expect(header).toContain('Name');
        expect(header).toContain('Age');
    });

    test('renderHeader() returns empty on second call', () => {
        stream.renderHeader();
        const second = stream.renderHeader();
        expect(second).toBe('');
    });

    test('renderRows() renders data rows', () => {
        stream.renderHeader(); // Render header first
        table.addRow({ Name: 'Alice', Age: '30' });
        table.addRow({ Name: 'Bob', Age: '25' });
        const output = stream.renderRows(table.rows);
        // Output contains ANSI-wrapped values
        expect(output).toBeTruthy();
        expect(output.length).toBeGreaterThan(0);
    });

    test('renderRows() auto-renders header if not yet rendered', () => {
        table.addRow({ Name: 'Alice', Age: '30' });
        const output = stream.renderRows(table.rows);
        // When header hasn't been rendered, output includes it
        expect(output).toContain('Name');
        expect(output.length).toBeGreaterThan(0);
    });

    test('renderFooter() returns bottom border', () => {
        stream.renderHeader();
        const footer = stream.renderFooter();
        expect(typeof footer).toBe('string');
        expect(footer.length).toBeGreaterThan(0);
    });

    test('works with hidden columns', () => {
        const t = new Table();
        t.addColumn({ name: 'Visible', hidden: false });
        t.addColumn({ name: 'Hidden', hidden: true });
        const s = new StreamRenderer(t);
        const header = s.renderHeader();
        expect(header).toContain('Visible');
        expect(header).not.toContain('Hidden');
    });

    test('renderFooter() with no bottomBody theme', () => {
        const t = new Table();
        t.addColumn('A');
        t.theme = { ...t.theme, bottomBody: '' };
        const s = new StreamRenderer(t);
        s.renderHeader();
        const footer = s.renderFooter();
        expect(footer).toBe('');
    });
});
