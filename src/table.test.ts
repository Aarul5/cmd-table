import {
    Table,
    MarkdownRenderer,
    CsvRenderer,
    JsonRenderer,
    HtmlRenderer,
    BUILTIN_THEMES,
    getTheme
} from './index';

describe('Table core features', () => {
    it('renders object input and summary footer', () => {
        const table = new Table();
        table.addRow({ name: 'Alice', score: 10 });
        table.addRow({ name: 'Bob', score: 20 });
        table.summarize(['score'], 'sum');

        const out = table.render();
        expect(out).toContain('Alice');
        expect(out).toContain('30');
    });

    it('exports markdown/csv/json/html', () => {
        const table = new Table({ columns: [{ name: 'A' }, { name: 'B' }] });
        table.addRow(['x', 'y']);

        expect(new MarkdownRenderer().render(table)).toContain('| A | B |');
        expect(new CsvRenderer().render(table)).toContain('A,B');
        expect(new JsonRenderer().render(table)).toContain('"A": "x"');
        expect(new HtmlRenderer().render(table)).toContain('<table>');
    });

    it('builds vertical and cross tables', () => {
        const vertical = Table.fromVertical({ one: 1 });
        const cross = Table.fromCross('Metric', ['Jan'], [{ label: 'Sales', values: { Jan: 42 } }]);

        expect(vertical.render()).toContain('one');
        expect(cross.render()).toContain('Sales');
    });

    it('exposes built-in themes and named lookup', () => {
        expect(BUILTIN_THEMES.rounded).toBeDefined();
        expect(BUILTIN_THEMES.doubleLine).toBeDefined();
        expect(BUILTIN_THEMES.boldBox).toBeDefined();
        expect(BUILTIN_THEMES.dots).toBeDefined();
        expect(getTheme('rounded')).toBe(BUILTIN_THEMES.rounded);
    });

    it('renders with a neat built-in rounded theme', () => {
        const table = new Table({
            columns: [{ name: 'Name' }, { name: 'Role' }],
            theme: getTheme('rounded')
        });
        table.addRow(['Alice', 'Dev']);

        const out = table.render();
        expect(out).toContain('╭');
        expect(out).toContain('╯');
    });
});
