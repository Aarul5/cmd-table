import { IRenderer } from './IRenderer';
import { Table } from '../Table';
import { Cell } from '../Cell';

export class MarkdownRenderer implements IRenderer {
    public render(table: Table): string {
        const cols = table.columns.filter((column) => !column.hidden);
        const header = this.drawRow(cols.map((column) => new Cell(column.name)));
        const separator = '| ' + cols.map((column) => this.alignRule(column.align)).join(' | ') + ' |';
        const body = table.rows
            .map((row) => this.drawRow(row.cells.filter((_, idx) => !table.columns[idx]?.hidden)))
            .join('\n');

        return [header, separator, body].filter(Boolean).join('\n');
    }

    private drawRow(cells: Cell[]): string {
        return '| ' + cells.map((cell) => cell.getString().replace(/\|/g, '\\|')).join(' | ') + ' |';
    }

    private alignRule(align: 'left' | 'center' | 'right' = 'left'): string {
        if (align === 'center') return ':---:';
        if (align === 'right') return '---:';
        return ':---';
    }
}
