import { Table } from '../src/Table';

describe('Table Defaults', () => {
    it('should have default headerColor as magenta', () => {
        const table = new Table();
        expect(table.headerColor).toBe('magenta');
    });

    it('should set first column color to cyan by default', () => {
        const table = new Table();
        table.addColumn('First');
        table.addColumn('Second');

        expect(table.columns[0].color).toBe('cyan');
        expect(table.columns[1].color).toBeUndefined();
    });

    it('should NOT override user specified color for first column', () => {
        const table = new Table();
        table.addColumn({ name: 'First', color: 'red' });
        expect(table.columns[0].color).toBe('red');
    });

    it('should NOT override user specified headerColor', () => {
        const table = new Table({ headerColor: 'blue' });
        expect(table.headerColor).toBe('blue');
    });
});
