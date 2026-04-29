import { Table } from '../src/Table';

describe('Per-column formatter callback', () => {
    test('formats cell values using the formatter function', () => {
        const t = new Table();
        t.addColumn({ name: 'Price', key: 'price', minWidth: 8, formatter: (v) => `$${Number(v).toFixed(2)}` });
        t.addRow({ price: 9.5 });
        t.addRow({ price: 100 });
        const output = t.render();
        expect(output).toContain('$9.50');
        expect(output).toContain('$100.00');
    });

    test('header row is NOT passed through the formatter', () => {
        const t = new Table();
        t.addColumn({ name: 'Price', key: 'price', formatter: (v) => `$${Number(v).toFixed(2)}` });
        t.addRow({ price: 9.5 });
        const output = t.render();
        // Header should appear as-is
        expect(output).toContain('Price');
        expect(output).not.toContain('$Price');
        expect(output).not.toContain('$NaN');
    });

    test('formatter receives the correct rowIndex (0-based)', () => {
        const captured: number[] = [];
        const t = new Table();
        t.addColumn({
            name: 'Value',
            key: 'value',
            formatter: (v, rowIndex) => {
                captured.push(rowIndex);
                return String(v);
            }
        });
        t.addRow({ value: 'a' });
        t.addRow({ value: 'b' });
        t.addRow({ value: 'c' });
        t.render();
        expect(captured).toEqual([0, 1, 2]);
    });

    test('formatter can return different formats per row', () => {
        const t = new Table();
        t.addColumn({
            name: 'Label',
            key: 'label',
            minWidth: 8,
            formatter: (v, i) => (i % 2 === 0 ? `[${v}]` : `(${v})`)
        });
        t.addRow({ label: 'even' }); // row 0 → [even]
        t.addRow({ label: 'odd' });  // row 1 → (odd)
        const output = t.render();
        expect(output).toContain('[even]');
        expect(output).toContain('(odd)');
    });

    test('formatter works alongside column color', () => {
        const t = new Table();
        t.addColumn({
            name: 'Status',
            key: 'status',
            color: 'green',
            formatter: (v) => `✔ ${v}`,
        });
        t.addRow({ status: 'OK' });
        const output = t.render();
        expect(output).toContain('✔ OK');
    });

    test('column without formatter renders raw value', () => {
        const t = new Table();
        t.addColumn({ name: 'Raw', key: 'raw' });
        t.addRow({ raw: '42' });
        const output = t.render();
        expect(output).toContain('42');
    });

    test('formatter returning empty string does not break layout', () => {
        const t = new Table();
        t.addColumn({ name: 'Hidden', key: 'h', formatter: () => '' });
        t.addRow({ h: 'anything' });
        expect(() => t.render()).not.toThrow();
    });
});
