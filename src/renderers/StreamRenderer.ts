import { Table } from '../Table';
import { Row } from '../Row';
import { StringRenderer } from './StringRenderer';
import { LayoutManager, GridCell } from '../LayoutManager';
import { Cell } from '../Cell';
import { stringWidth } from '../utils/textUtils';
import { Column } from '../Column';

export class StreamRenderer extends StringRenderer {
    private table: Table;
    private headerRendered: boolean = false;
    private widths: number[] = [];

    constructor(table: Table) {
        super();
        this.table = table;
        this.widths = this.calculateInitialWidths();
    }

    private calculateInitialWidths(): number[] {
        return this.getStreamColumns().map((column) => {
            const base = Math.max(column.minWidth, column.width || stringWidth(column.name));
            return column.maxWidth !== undefined ? Math.min(base, column.maxWidth) : base;
        });
    }

    public renderHeader(): string {
        if (this.headerRendered) return '';

        const theme = this.table.theme;
        const visibleColumns = this.getStreamColumns();
        const parts: string[] = [];

        if (theme.topBody) {
            parts.push(this.drawBorder(this.widths, visibleColumns, theme.topLeft, theme.topBody, theme.topJoin, theme.topRight));
        }

        const headerCells = visibleColumns
            .map((column, i) => ({ cell: new Cell(column.name), x: i, y: -1, realColSpan: 1, realRowSpan: 1 } as GridCell));
        parts.push(...this.drawGridRowLines(headerCells, this.widths, visibleColumns, theme, 0, false));

        if (theme.joinBody) {
            parts.push(this.drawBorder(this.widths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
        }

        this.headerRendered = true;
        return parts.join('\n');
    }

    public renderRows(rows: Row[]): string {
        let output = '';
        if (!this.headerRendered) output += this.renderHeader() + '\n';

        const visibleIndices = this.table.columns.map((column, index) => ({ column, index })).filter((item) => !item.column.hidden);
        const visibleColumns = visibleIndices.map((item) => item.column);
        const tempTable = new Table({ theme: this.table.theme, columns: visibleColumns.map((column) => ({ ...column })) });
        tempTable.rows = rows.map((row) => {
            const filtered = visibleIndices.map(({ index }) => row.cells[index] ?? new Cell(''));
            return { cells: filtered } as any;
        });
        const grid = LayoutManager.layout(tempTable);
        const theme = this.table.theme;
        output += grid.map((row) => this.drawGridRowLines(row, this.widths, visibleColumns, theme, 0, false).join('\n')).join('\n');

        return output;
    }

    public renderFooter(): string {
        const theme = this.table.theme;
        const visibleColumns = this.getStreamColumns();
        if (theme.bottomBody) return this.drawBorder(this.widths, visibleColumns, theme.bottomLeft, theme.bottomBody, theme.bottomJoin, theme.bottomRight);
        return '';
    }

    private getStreamColumns(): Column[] {
        return this.table.columns.filter((column) => !column.hidden);
    }
}
