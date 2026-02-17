import { Aggregations } from '../src/analysis/Aggregations';
import { PivotTable } from '../src/analysis/PivotTable';
import { CrossTab } from '../src/analysis/CrossTab';
import { Table } from '../src/Table';

describe('Aggregations', () => {
    it('should calculate sum, avg, count', () => {
        const data = [10, 20, 30];
        expect(Aggregations.sum(data)).toBe(60);
        expect(Aggregations.avg(data)).toBe(20);
        expect(Aggregations.count(data)).toBe(3);
        expect(Aggregations.min(data)).toBe(10);
        expect(Aggregations.max(data)).toBe(30);
    });

    it('should calculate variance and stdDev', () => {
        const data = [2, 4, 4, 4, 5, 5, 7, 9];
        // Mean = 5
        // Variance = 4
        // StdDev = 2
        expect(Aggregations.variance(data)).toBeCloseTo(4);
        expect(Aggregations.stdDev(data)).toBeCloseTo(2);
    });
});

describe('PivotTable', () => {
    it('should pivot data', () => {
        const data = [
            { category: 'A', val: 10 },
            { category: 'A', val: 20 },
            { category: 'B', val: 5 }
        ];

        const table = new Table();
        table.addRows(data);
        const rawData = table.rows.map(r => r.getData());

        const pivot = PivotTable.create(rawData, {
            groupBy: 'category',
            targetColumn: 'val',
            algorithm: 'sum'
        });

        // A: 30, B: 5
        expect(pivot.rows).toHaveLength(2);
        const rowA = pivot.rows.find((r: any) => r.cells[0].content === 'A');
        const rowB = pivot.rows.find((r: any) => r.cells[0].content === 'B');

        expect(rowA).toBeDefined();
        // Check cell content (might be stringified)
        expect(String(rowA?.cells[1].content)).toBe('30');
    });
});

describe('CrossTab', () => {
    it('should generate crosstab matrix', () => {
        const data = [
            { region: 'North', product: 'Apple', sales: 100 },
            { region: 'North', product: 'Banana', sales: 50 },
            { region: 'South', product: 'Apple', sales: 80 }
        ];

        const table = new Table();
        table.addRows(data);
        const rawData = table.rows.map(r => r.getData());

        const ct = CrossTab.create(rawData, {
            rowKey: 'region',
            colKey: 'product',
            valueKey: 'sales',
            aggregator: 'sum'
        });

        // Rows: North, South
        // Cols: Region (label), Apple, Banana
        expect(ct.columns.length).toBe(3);
        expect(ct.rows.length).toBe(2);

        const north = ct.rows.find((r: any) => r.cells[0].content === 'North');
        // Apple col index?, Banana col index?
        // CrossTab sorts columns alphabetically usually?
        // Let's check headers
        const headers = ct.columns.map((c: any) => c.name);
        expect(headers).toContain('Apple');
        expect(headers).toContain('Banana');

        // Validate North-Apple sales = 100
        const appleIdx = headers.indexOf('Apple');
        expect(String(north?.cells[appleIdx].content)).toBe('100');
    });
});
