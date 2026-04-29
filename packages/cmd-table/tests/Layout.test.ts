import { Table } from '../src/Table';
import { LayoutManager } from '../src/LayoutManager';
import { Cell } from '../src/Cell';

describe('LayoutManager', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
    });

    it('should layout basic grid', () => {
        table.addColumn('A');
        table.addColumn('B');
        table.addRow(['1', '2']);
        const grid = LayoutManager.layout(table);
        expect(grid).toHaveLength(1);
        expect(grid[0]).toHaveLength(2);
        expect(grid[0][0].cell.content).toBe('1');
        expect(grid[0][1].cell.content).toBe('2');
    });

    it('should handle colSpan', () => {
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Span', colSpan: 2 }]);
        const grid = LayoutManager.layout(table);

        expect(grid[0][0].realColSpan).toBe(2);
        // The second cell should be a "ghost" of the first
        expect(grid[0][1].hidden).toBe(true);
        expect(grid[0][1].cell.content).toBe('Span');
    });

    it('should handle rowSpan', () => {
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'RowSpan', rowSpan: 2 }, '1']);
        table.addRow(['2']);

        const grid = LayoutManager.layout(table);

        // Row 0
        expect(grid[0][0].realRowSpan).toBe(2);
        expect(grid[0][1].cell.content).toBe('1');

        // Row 1
        expect(grid[1][0].hidden).toBe(true); // Covered by RowSpan
        expect(grid[1][1].cell.content).toBe('2');
    });

    it('should throw on invalid column count', () => {
        table.addColumn('A');
        table.addRow(['1', '2']); // 2 cells but only 1 column
        expect(() => LayoutManager.layout(table)).toThrow();
    });
});
