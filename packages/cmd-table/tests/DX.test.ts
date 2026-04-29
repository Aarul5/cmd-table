import { Table } from '../src/Table';

describe('DX Features', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('ID');
        for (let i = 1; i <= 10; i++) {
            table.addRow({ ID: i });
        }
    });

    describe('getPages', () => {
        it('should return correct number of pages', () => {
            const pages = table.getPages(3);
            expect(pages).toHaveLength(4); // 3, 3, 3, 1
            expect(pages[0].rows).toHaveLength(3);
            expect(pages[3].rows).toHaveLength(1);
        });

        it('should return empty array for empty table', () => {
            const emptyTable = new Table();
            const pages = emptyTable.getPages(5);
            expect(pages).toHaveLength(0);
        });
    });

    describe('export', () => {
        it('should export csv', () => {
            const csv = table.export('csv');
            expect(csv).toContain('ID');
            expect(csv).toContain('1');
        });

        it('should export json', () => {
            const json = table.export('json');
            const data = JSON.parse(json);
            expect(data).toHaveLength(10);
        });

        it('should throw error for unknown format', () => {
            expect(() => table.export('xml' as any)).toThrow();
        });
    });
});
