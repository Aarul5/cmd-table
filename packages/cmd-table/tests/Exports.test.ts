import { Table } from '../src/Table';
import { CsvRenderer } from '../src/renderers/CsvRenderer';
import { HtmlRenderer } from '../src/renderers/HtmlRenderer';
import { JsonRenderer } from '../src/renderers/JsonRenderer';
import { MarkdownRenderer } from '../src/renderers/MarkdownRenderer';

describe('Exports', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('Name');
        table.addColumn('Role');
        table.addRow({ Name: 'Alice', Role: 'Dev' });
        table.addRow({ Name: 'Bob', Role: 'PM' });
    });

    describe('CSV Export', () => {
        it('should render basic CSV', () => {
            const renderer = new CsvRenderer();
            const output = renderer.render(table);
            const lines = output.split('\n');
            expect(lines[0]).toBe('Name,Role');
            expect(lines[1]).toBe('Alice,Dev');
            expect(lines[2]).toBe('Bob,PM');
        });

        it('should quote values with delimiters', () => {
            table.addRow({ Name: 'Charlie, Jr.', Role: 'CEO' });
            const renderer = new CsvRenderer();
            const output = renderer.render(table);
            expect(output).toContain('"Charlie, Jr.",CEO');
        });
    });

    describe('HTML Export', () => {
        it('should render HTML table', () => {
            const renderer = new HtmlRenderer();
            const output = renderer.render(table);
            expect(output).toContain('<table>');
            expect(output).toContain('<thead><tr><th>Name</th><th>Role</th></tr></thead>');
            expect(output).toContain('<tbody><tr><td>Alice</td><td>Dev</td></tr>');
        });

        it('should escape HTML characters', () => {
            table.addRow({ Name: '<b>Bold</b>', Role: 'User' });
            const renderer = new HtmlRenderer();
            const output = renderer.render(table);
            expect(output).toContain('&lt;b&gt;Bold&lt;/b&gt;');
        });
    });

    describe('Markdown Export', () => {
        it('should render Markdown table', () => {
            const renderer = new MarkdownRenderer();
            const md = renderer.render(table);
            expect(md).toContain('| Name | Role |');
            expect(md).toContain('| Alice | Dev |');
            expect(md).toContain('---');
        });
    });

    describe('JSON Export', () => {
        it('should render JSON string', () => {
            const renderer = new JsonRenderer();
            const output = renderer.render(table);
            const parsed = JSON.parse(output);
            expect(parsed).toHaveLength(2);
            expect(parsed[0]).toEqual({ Name: 'Alice', Role: 'Dev' });
        });
    });
});
