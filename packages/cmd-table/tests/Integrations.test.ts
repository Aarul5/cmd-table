import { HtmlTable } from '../src/integrations/html';
import { JsonTable } from '../src/integrations/json';
import { CsvTable } from '../src/integrations/csv';
import { render, h } from '../src/integrations/react';
import { Table } from '../src/Table';

describe('HtmlTable', () => {
    it('should parse simple html table', () => {
        const html = `<table><tr><td>A</td><td>B</td></tr></table>`;
        const table = HtmlTable.from(html);
        expect(table.rows.length).toBe(1);
        expect(table.rows[0].cells[0].content).toBe('A');
    });

    it('should extract headers from th', () => {
        const html = `
            <table>
                <thead><tr><th>Col1</th><th>Col2</th></tr></thead>
                <tbody><tr><td>Val1</td><td>Val2</td></tr></tbody>
            </table>
        `;
        const table = HtmlTable.from(html);
        expect(table.columns[0].name).toBe('Col1');
        expect(table.rows.length).toBe(1);
        expect(table.rows[0].cells[0].content).toBe('Val1');
    });

    // NEW: multiple rows
    it('should handle multiple rows', () => {
        const html = `<table>
            <tr><th>Name</th><th>Age</th></tr>
            <tr><td>Alice</td><td>30</td></tr>
            <tr><td>Bob</td><td>25</td></tr>
        </table>`;
        const table = HtmlTable.from(html);
        expect(table.rows.length).toBe(2);
    });
});

describe('JsonTable', () => {
    // NEW: toJson
    it('should convert table to JSON string', () => {
        const table = new Table();
        table.addColumn('Name');
        table.addColumn('Age');
        table.addRow({ Name: 'Alice', Age: 30 });
        const json = JsonTable.toJson(table);
        const parsed = JSON.parse(json);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].Name).toBe('Alice');
    });
});

describe('CsvTable.toCsv', () => {
    it('should convert table to CSV', () => {
        const table = new Table();
        table.addColumn('Name');
        table.addRow({ Name: 'Alice' });
        const csv = CsvTable.toCsv(table);
        expect(csv).toContain('Name');
        expect(csv).toContain('Alice');
    });
});

describe('JSX/React Integration', () => {
    it('should create table from VDom', () => {
        const element = h('cmd-table', { theme: 'void' }, [
            h('cmd-column', { name: 'Name', key: 'name' }),
            h('cmd-row', { name: 'Test' })
        ]);

        const table = render(element);
        expect(table.columns.length).toBe(1);
        expect(table.columns[0].name).toBe('Name');
        expect(table.rows.length).toBe(1);
        expect(table.rows[0].cells[0].content).toBe('Test');
    });

    // NEW: h without children
    it('should handle h() without children', () => {
        const element = h('cmd-table', {});
        const table = render(element);
        expect(table).toBeDefined();
    });
});
