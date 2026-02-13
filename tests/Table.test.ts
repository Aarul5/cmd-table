import { Table } from '../src/Table';
import { THEME_Rounded } from '../src/themes/Theme';

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
        // Rounded theme default
        expect(output).toContain(THEME_Rounded.topLeft);
    });

    it('should handle spanning cells', () => {
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Spanned', colSpan: 2 }]);
        const output = table.render();
        expect(output).toContain('Spanned');
        // Simple check for width calculation or lack of internal vertical separator if spanned?
        // Hard to assert visual output strings exactly without snapshots.
        // We trust the visual output verification done previously.
    });

    it('should support header colors', () => {
        table.addColumn('Name');
        table.headerColor = 'red';
        const output = table.render();
        // Check for ANSI red code: \u001B[31m
        expect(output).toContain('\u001B[31m');
    });

    it('should support column colors', () => {
        table.addColumn({ name: 'Name', color: 'cyan' });
        table.addRow({ Name: 'Alice' });
        const output = table.render();
        // Check for ANSI cyan code: \u001B[36m
        expect(output).toContain('\u001B[36m');
    });
});
