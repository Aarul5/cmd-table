import { CsvTable } from '../src/integrations/csv';

describe('CsvTable.from()', () => {
    test('parses basic CSV with headers', () => {
        const csv = 'name,age,city\nAlice,30,NYC\nBob,25,LA';
        const table = CsvTable.from(csv);
        expect(table.columns).toHaveLength(3);
        expect(table.columns[0].name).toBe('name');
        expect(table.rows).toHaveLength(2);
        expect(table.rows[0].cells[0].content).toBe('Alice');
    });

    test('parses CSV without headers', () => {
        const csv = 'Alice,30\nBob,25';
        const table = CsvTable.from(csv, { hasHeader: false });
        expect(table.columns[0].name).toBe('Col1');
        expect(table.columns[1].name).toBe('Col2');
        expect(table.rows).toHaveLength(2);
    });

    test('handles custom delimiter', () => {
        const csv = 'name;age\nAlice;30';
        const table = CsvTable.from(csv, { delimiter: ';' });
        expect(table.columns).toHaveLength(2);
        expect(table.rows[0].cells[1].content).toBe('30');
    });

    test('handles quoted fields', () => {
        const csv = 'name,bio\nAlice,"Loves coding, cats"\nBob,"Hello ""world"""';
        const table = CsvTable.from(csv);
        expect(table.rows[0].cells[1].content).toBe('Loves coding, cats');
        expect(table.rows[1].cells[1].content).toBe('Hello "world"');
    });

    test('handles empty input', () => {
        const table = CsvTable.from('');
        expect(table.columns).toHaveLength(0);
        expect(table.rows).toHaveLength(0);
    });

    test('handles rows with fewer columns', () => {
        const csv = 'a,b,c\n1,2';
        const table = CsvTable.from(csv);
        expect(table.rows[0].cells[2].content).toBe('');
    });

    test('handles CRLF line endings', () => {
        const csv = 'name,age\r\nAlice,30\r\nBob,25';
        const table = CsvTable.from(csv);
        expect(table.rows).toHaveLength(2);
    });
});
