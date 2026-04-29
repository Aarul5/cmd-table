import { Table } from '../src/Table';
import { mergeAdjacent } from '../src/utils/mergeUtils';

describe('Auto Merge', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('Cat');
        table.addColumn('Item');
    });

    it('should merge identical vertical cells', () => {
        table.addRow(['A', '1']);
        table.addRow(['A', '2']);
        table.addRow(['B', '3']);

        mergeAdjacent(table, ['Cat']);

        expect(table.rows[0].cells[0].rowSpan).toBe(2);
        expect(table.rows[1].cells[0].merged).toBe(true);
        expect(table.rows[2].cells[0].rowSpan).toBe(1);
    });

    it('should NOT merge if content differs', () => {
        table.addRow(['A', '1']);
        table.addRow(['B', '2']);

        mergeAdjacent(table, ['Cat']);

        expect(table.rows[0].cells[0].rowSpan).toBe(1);
        expect(table.rows[1].cells[0].merged).toBe(false);
    });
});
