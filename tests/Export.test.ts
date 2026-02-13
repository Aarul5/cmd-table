import { Table } from '../src/Table';
import { JsonRenderer } from '../src/renderers/JsonRenderer';
import { CsvRenderer } from '../src/renderers/CsvRenderer';
import { MarkdownRenderer } from '../src/renderers/MarkdownRenderer';

describe('Export Renderers', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('Name');
        table.addColumn('Age');
        table.addRow({ Name: 'Alice', Age: 30 });
    });

    it('should export JSON', () => {
        const renderer = new JsonRenderer();
        const json = renderer.render(table);
        const data = JSON.parse(json);
        expect(data).toHaveLength(1);
        expect(data[0].Name).toBe('Alice');
        expect(Number(data[0].Age)).toBe(30);
    });

    it('should export CSV', () => {
        const renderer = new CsvRenderer();
        const csv = renderer.render(table);
        expect(csv).toContain('Name,Age');
        expect(csv).toContain('Alice,30');
    });

    it('should export Markdown', () => {
        const renderer = new MarkdownRenderer();
        const md = renderer.render(table);
        expect(md).toContain('| Name | Age |');
        expect(md).toContain('| Alice | 30 |');
        expect(md).toContain('---');
    });
});
