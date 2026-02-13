import { IRenderer } from './IRenderer';
import { Table } from '../Table';

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export class HtmlRenderer implements IRenderer {
    public render(table: Table): string {
        const visible = table.columns.map((column, index) => ({ column, index })).filter((item) => !item.column.hidden);
        const head = `<thead><tr>${visible.map((item) => `<th>${escapeHtml(item.column.name)}</th>`).join('')}</tr></thead>`;
        const bodyRows = table.rows
            .map((row) => `<tr>${visible.map((item) => `<td>${escapeHtml(row.cells[item.index]?.getString() ?? '')}</td>`).join('')}</tr>`)
            .join('');
        return `<table>${head}<tbody>${bodyRows}</tbody></table>`;
    }
}
