import { Table } from '../src/Table';

describe('Pagination', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('ID');
        for (let i = 1; i <= 10; i++) {
            table.addRow({ ID: i });
        }
    });

    it('should return correct page 1', () => {
        const page = table.paginate(1, 3);
        expect(page.rows).toHaveLength(3);
        expect(page.rows[0].cells[0].content).toBe(1);
        expect(page.rows[2].cells[0].content).toBe(3);
    });

    it('should return correct page 2', () => {
        const page = table.paginate(2, 3);
        expect(page.rows).toHaveLength(3);
        expect(page.rows[0].cells[0].content).toBe(4);
    });

    it('should return partial last page', () => {
        const page = table.paginate(4, 3);
        expect(page.rows).toHaveLength(1);
        expect(page.rows[0].cells[0].content).toBe(10);
    });

    it('should return empty table for out of bounds page', () => {
        const page = table.paginate(5, 3);
        expect(page.rows).toHaveLength(0);
    });

    it('should preserve columns and options', () => {
        table.addColumn({ name: 'Name', color: 'red' });
        const page = table.paginate(1, 5);
        expect(page.columns).toHaveLength(2);
        expect(page.columns[1].color).toBe('red');
    });
});
