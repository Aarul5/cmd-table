import { HtmlTable } from '../src/integrations/html';
import { render, h } from '../src/integrations/react';

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
});
