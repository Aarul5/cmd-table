import { Table } from '../src/Table';
import { THEME_Rounded, THEME_DEFAULT } from '../src/themes/Theme';

describe('Table', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
    });

    it('should add columns via addColumn', () => {
        table.addColumn('Name');
        table.addColumn({ name: 'Age', width: 10 });
        expect(table.columns).toHaveLength(2);
        expect(table.columns[0].name).toBe('Name');
        expect(table.columns[1].width).toBe(10);
    });

    it('should add rows via addRow', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        expect(table.rows).toHaveLength(1);
        expect(table.rows[0].cells[0].content).toBe('Alice');
    });

    it('should render a basic table string', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const output = table.render();
        expect(output).toContain('Alice');
        expect(output).toContain('Name');
        expect(output).toContain(THEME_Rounded.topLeft);
    });

    it('should handle spanning cells', () => {
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Spanned', colSpan: 2 }]);
        const output = table.render();
        expect(output).toContain('Spanned');
    });

    it('should support header colors', () => {
        table.addColumn('Name');
        table.headerColor = 'red';
        const output = table.render();
        expect(output).toContain('\u001B[31m');
    });

    it('should support column colors', () => {
        table.addColumn({ name: 'Name', color: 'cyan' });
        table.addRow({ Name: 'Alice' });
        const output = table.render();
        expect(output).toContain('\u001B[36m');
    });

    // NEW: setColumns
    it('should replace columns via setColumns', () => {
        table.addColumn('Old');
        table.setColumns(['New1', 'New2']);
        expect(table.columns).toHaveLength(2);
        expect(table.columns[0].name).toBe('New1');
    });

    // NEW: addRows
    it('should add multiple rows via addRows', () => {
        table.addColumn('Name');
        table.addRows([{ Name: 'Alice' }, { Name: 'Bob' }]);
        expect(table.rows).toHaveLength(2);
    });

    // NEW: setFooter
    it('should set footer', () => {
        table.addColumn('X');
        table.setFooter({ X: 'Total' });
        expect(table.footer).toEqual({ X: 'Total' });
    });

    // NEW: summarize
    it('should summarize with sum', () => {
        table.addColumn('Name');
        table.addColumn('Value');
        table.addRow({ Name: 'A', Value: 10 });
        table.addRow({ Name: 'B', Value: 20 });
        table.summarize(['Value'], 'sum');
        expect((table.footer as any).Value).toBe(30);
    });

    it('should summarize with avg', () => {
        table.addColumn('Score');
        table.addRow({ Score: 10 });
        table.addRow({ Score: 20 });
        table.summarize(['Score'], 'avg');
        expect((table.footer as any).Score).toBe(15);
    });

    it('should summarize with count', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'A' });
        table.addRow({ Name: 'B' });
        table.addRow({ Name: 'C' });
        table.summarize(['Name'], 'count');
        // count counts finite numbers — Names are strings, won't be finite
        expect((table.footer as any).Name).toBe(0);
    });

    it('should summarize preserving existing footer', () => {
        table.addColumn('X');
        table.addRow({ X: 5 });
        table.setFooter({ label: 'Total' });
        table.summarize(['X']);
        expect((table.footer as any).label).toBe('Total');
        expect((table.footer as any).X).toBe(5);
    });

    // NEW: paginate & getPages
    it('should paginate correctly', () => {
        table.addColumn('ID');
        for (let i = 1; i <= 10; i++) table.addRow({ ID: i });
        const page = table.paginate(2, 3);
        expect(page.rows).toHaveLength(3);
        expect(page.rows[0].cells[0].content).toBe(4);
    });

    it('should get all pages', () => {
        table.addColumn('ID');
        for (let i = 1; i <= 7; i++) table.addRow({ ID: i });
        const pages = table.getPages(3);
        expect(pages).toHaveLength(3);
        expect(pages[2].rows).toHaveLength(1); // Last page has 1 row
    });

    // NEW: export formats
    it('should export as CSV', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const csv = table.export('csv');
        expect(csv).toContain('Name');
        expect(csv).toContain('Alice');
    });

    it('should export as JSON', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const json = table.export('json');
        const parsed = JSON.parse(json);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].Name).toBe('Alice');
    });

    it('should export as HTML', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const html = table.export('html');
        expect(html).toContain('<table');
        expect(html).toContain('Alice');
    });

    it('should export as markdown', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const md = table.export('md');
        expect(md).toContain('|');
        expect(md).toContain('Name');
    });

    it('should export as markdown (full alias)', () => {
        table.addColumn('X');
        table.addRow({ X: '1' });
        const md = table.export('markdown');
        expect(md).toContain('|');
    });

    it('should throw for unknown export format', () => {
        expect(() => table.export('xml' as any)).toThrow('Unknown export format');
    });

    // NEW: fromVertical
    it('should create vertical table from record', () => {
        const t = Table.fromVertical({ name: 'Alice', age: 30 });
        expect(t.columns).toHaveLength(2);
        expect(t.columns[0].name).toBe('Key');
        expect(t.rows).toHaveLength(2);
        expect(t.rows[0].cells[1].content).toBe('Alice');
    });

    // NEW: fromCross
    it('should create cross table', () => {
        const t = Table.fromCross('Category', ['Q1', 'Q2'], [
            { label: 'Sales', values: { Q1: 100, Q2: 200 } },
            { label: 'Costs', values: { Q1: 50, Q2: 80 } }
        ]);
        expect(t.columns).toHaveLength(3);
        expect(t.rows).toHaveLength(2);
    });

    // NEW: sort
    it('should sort numerically ascending', () => {
        table.addColumn('Value');
        table.addRow({ Value: 30 });
        table.addRow({ Value: 10 });
        table.addRow({ Value: 20 });
        table.sort('Value', 'asc');
        expect(table.rows[0].cells[0].content).toBe(10);
        expect(table.rows[2].cells[0].content).toBe(30);
    });

    it('should sort descending', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'Charlie' });
        table.addRow({ Name: 'Alice' });
        table.addRow({ Name: 'Bob' });
        table.sort('Name', 'desc');
        expect(table.rows[0].cells[0].content).toBe('Charlie');
    });

    it('should handle sort with non-existent column', () => {
        table.addColumn('Name');
        table.addRow({ Name: 'A' });
        table.sort('NonExistent');
        expect(table.rows).toHaveLength(1); // No crash
    });

    // NEW: addTree
    it('should add tree data', () => {
        table.addColumn('Label');
        table.addColumn('Value');
        table.addTree('Label', [
            {
                Label: 'Root', Value: 1, children: [
                    { Label: 'Child1', Value: 2 },
                    { Label: 'Child2', Value: 3 }
                ]
            }
        ]);
        expect(table.rows).toHaveLength(3);
        expect(table.rows[1].cells[0].content).toContain('├─');
    });

    // NEW: mergeAdjacent
    it('should merge adjacent cells with same content', () => {
        table.addColumn('Group');
        table.addColumn('Value');
        table.addRow({ Group: 'A', Value: 1 });
        table.addRow({ Group: 'A', Value: 2 });
        table.addRow({ Group: 'B', Value: 3 });
        table.mergeAdjacent(['Group']);
        expect(table.rows[0].cells[0].rowSpan).toBe(2);
        expect(table.rows[1].cells[0].merged).toBe(true);
    });

    it('should merge all columns when none specified', () => {
        table.addColumn('X');
        table.addRow({ X: 'A' });
        table.addRow({ X: 'A' });
        table.mergeAdjacent();
        expect(table.rows[0].cells[0].rowSpan).toBe(2);
    });

    // NEW: constructor options
    it('should accept full constructor options', () => {
        const t = new Table({
            theme: THEME_DEFAULT,
            compact: true,
            terminalWidth: 80,
            responsiveMode: 'hide',
            zebra: true,
            headerGroups: [{ title: 'Group', colSpan: 2 }],
            headerColor: 'blue',
            columns: [{ name: 'A' }, { name: 'B' }]
        });
        expect(t.compact).toBe(true);
        expect(t.terminalWidth).toBe(80);
        expect(t.responsiveMode).toBe('hide');
        expect(t.zebra).toBe(true);
        expect(t.headerGroups).toHaveLength(1);
        expect(t.columns).toHaveLength(2);
    });
});
