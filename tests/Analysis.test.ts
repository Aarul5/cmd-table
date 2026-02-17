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
        expect(Aggregations.variance(data)).toBeCloseTo(4);
        expect(Aggregations.stdDev(data)).toBeCloseTo(2);
    });

    // NEW: empty array edge cases
    it('should handle empty arrays', () => {
        expect(Aggregations.sum([])).toBe(0);
        expect(Aggregations.avg([])).toBe(0);
        expect(Aggregations.min([])).toBe(0);
        expect(Aggregations.max([])).toBe(0);
        expect(Aggregations.count([])).toBe(0);
        expect(Aggregations.stdDev([])).toBe(0);
        expect(Aggregations.variance([])).toBe(0);
        expect(Aggregations.percentile([], 0.5)).toBe(0);
    });

    // NEW: percentile
    it('should calculate percentiles', () => {
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        expect(Aggregations.percentile(data, 0.5)).toBeCloseTo(5.5);
        expect(Aggregations.percentile(data, 0)).toBe(1);
        expect(Aggregations.percentile(data, 1)).toBe(10);
        expect(Aggregations.percentile(data, 0.25)).toBeCloseTo(3.25);
    });

    it('should handle single-element percentile', () => {
        expect(Aggregations.percentile([42], 0.5)).toBe(42);
    });
});

describe('PivotTable', () => {
    it('should pivot data with sum', () => {
        const data = [
            { category: 'A', val: 10 },
            { category: 'A', val: 20 },
            { category: 'B', val: 5 }
        ];

        const pivot = PivotTable.create(data, {
            groupBy: 'category',
            targetColumn: 'val',
            algorithm: 'sum'
        });

        expect(pivot.rows).toHaveLength(2);
        const rowA = pivot.rows.find((r: any) => r.cells[0].content === 'A');
        expect(String(rowA?.cells[1].content)).toBe('30');
    });

    // NEW: pivot column
    it('should create pivot columns', () => {
        const data = [
            { dept: 'Eng', quarter: 'Q1', revenue: 100 },
            { dept: 'Eng', quarter: 'Q2', revenue: 200 },
            { dept: 'Sales', quarter: 'Q1', revenue: 50 }
        ];
        const pivot = PivotTable.create(data, {
            groupBy: 'dept',
            pivot: 'quarter',
            targetColumn: 'revenue',
            algorithm: 'sum'
        });
        expect(pivot.columns.length).toBeGreaterThanOrEqual(3); // dept, Q1, Q2
        const headers = pivot.columns.map(c => c.name);
        expect(headers).toContain('Q1');
        expect(headers).toContain('Q2');
    });

    // NEW: count algorithm
    it('should pivot with count', () => {
        const data = [
            { group: 'X', val: 1 },
            { group: 'X', val: 2 },
            { group: 'Y', val: 3 }
        ];
        const pivot = PivotTable.create(data, {
            groupBy: 'group',
            algorithm: 'count'
        });
        const rowX = pivot.rows.find((r: any) => r.cells[0].content === 'X');
        expect(String(rowX?.cells[1].content)).toBe('2');
    });

    // NEW: custom function algorithm
    it('should pivot with custom function', () => {
        const data = [
            { group: 'A', val: 10 },
            { group: 'A', val: 20 }
        ];
        const pivot = PivotTable.create(data, {
            groupBy: 'group',
            targetColumn: 'val',
            algorithm: (values: any[]) => values.join(',')
        });
        expect(String(pivot.rows[0].cells[1].content)).toBe('10,20');
    });

    // NEW: avg algorithm
    it('should pivot with avg', () => {
        const data = [
            { group: 'A', val: 10 },
            { group: 'A', val: 30 }
        ];
        const pivot = PivotTable.create(data, {
            groupBy: 'group',
            targetColumn: 'val',
            algorithm: 'avg'
        });
        expect(String(pivot.rows[0].cells[1].content)).toBe('20');
    });

    // NEW: error handler
    it('should call onError when error occurs', () => {
        let caughtError: any = null;
        const pivot = PivotTable.create(null as any, {
            groupBy: 'group',
            onError: (err: any) => { caughtError = err; }
        });
        expect(caughtError).not.toBeNull();
    });
});

describe('CrossTab', () => {
    it('should generate crosstab matrix', () => {
        const data = [
            { region: 'North', product: 'Apple', sales: 100 },
            { region: 'North', product: 'Banana', sales: 50 },
            { region: 'South', product: 'Apple', sales: 80 }
        ];

        const ct = CrossTab.create(data, {
            rowKey: 'region',
            colKey: 'product',
            valueKey: 'sales',
            aggregator: 'sum'
        });

        expect(ct.columns.length).toBe(3);
        expect(ct.rows.length).toBe(2);

        const north = ct.rows.find((r: any) => r.cells[0].content === 'North');
        const headers = ct.columns.map((c: any) => c.name);
        expect(headers).toContain('Apple');
        expect(headers).toContain('Banana');
        const appleIdx = headers.indexOf('Apple');
        expect(String(north?.cells[appleIdx].content)).toBe('100');
    });

    // NEW: missing value
    it('should use missingValue for empty cells', () => {
        const data = [
            { row: 'A', col: 'X', val: 10 }
        ];
        const ct = CrossTab.create(data, {
            rowKey: 'row',
            colKey: 'col',
            valueKey: 'val',
            missingValue: 'N/A'
        });
        expect(ct.rows).toHaveLength(1);
    });

    // NEW: count aggregator
    it('should use count aggregator', () => {
        const data = [
            { r: 'A', c: 'X', v: 1 },
            { r: 'A', c: 'X', v: 2 }
        ];
        const ct = CrossTab.create(data, {
            rowKey: 'r',
            colKey: 'c',
            valueKey: 'v',
            aggregator: 'count'
        });
        expect(String(ct.rows[0].cells[1].content)).toBe('2');
    });

    // NEW: first aggregator
    it('should use first aggregator', () => {
        const data = [
            { r: 'A', c: 'X', v: 'first_val' },
            { r: 'A', c: 'X', v: 'second_val' }
        ];
        const ct = CrossTab.create(data, {
            rowKey: 'r',
            colKey: 'c',
            valueKey: 'v',
            aggregator: 'first'
        });
        expect(ct.rows[0].cells[1].content).toBe('first_val');
    });

    // NEW: last aggregator
    it('should use last aggregator', () => {
        const data = [
            { r: 'A', c: 'X', v: 'first' },
            { r: 'A', c: 'X', v: 'last' }
        ];
        const ct = CrossTab.create(data, {
            rowKey: 'r',
            colKey: 'c',
            valueKey: 'v',
            aggregator: 'last'
        });
        expect(ct.rows[0].cells[1].content).toBe('last');
    });

    // NEW: custom aggregator function
    it('should use custom aggregator function', () => {
        const data = [
            { r: 'A', c: 'X', v: 10 },
            { r: 'A', c: 'X', v: 20 }
        ];
        const ct = CrossTab.create(data, {
            rowKey: 'r',
            colKey: 'c',
            valueKey: 'v',
            aggregator: (values: any[]) => values.reduce((a: number, b: number) => a + b, 0) * 2
        });
        expect(String(ct.rows[0].cells[1].content)).toBe('60');
    });
});
