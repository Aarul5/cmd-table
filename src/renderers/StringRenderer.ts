import { IRenderer } from './IRenderer';
import { Table } from '../Table';
import { Cell } from '../Cell';
import { LayoutManager, GridCell } from '../LayoutManager';
import { Column } from '../Column';
import { ITheme } from '../themes/Theme';
import { stringWidth, stripAnsi } from '../utils/textUtils';
import { colorize, ColorName } from '../utils/colors';

export class StringRenderer implements IRenderer {
    public render(table: Table): string {
        if (table.columns.length === 0 && table.rows.length === 0) return '';

        const workingTable = this.getResponsiveTable(table);
        const visibleColumns = this.getVisibleColumns(workingTable);
        const theme = workingTable.theme;
        const grid = LayoutManager.layout(workingTable);
        const colWidths = this.calculateColumnWidths(workingTable, grid);
        const parts: string[] = [];

        if (theme.topBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.topLeft, theme.topBody, theme.topJoin, theme.topRight));
        }

        if (workingTable.headerGroups.length) {
            const groups = this.createGroupHeaderCells(workingTable.headerGroups);
            parts.push(...this.drawGridRowLines(groups, colWidths, visibleColumns, theme, 0, false));
            if (!workingTable.compact && theme.joinBody) {
                parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
        }

        const headerCells = workingTable.columns
            .filter((c) => !c.hidden)
            .map((column, index) => ({ cell: new Cell(column.name), x: index, y: -1, realColSpan: 1, realRowSpan: 1 } as GridCell));

        // Apply header color
        const headerColor = workingTable.headerColor as ColorName | undefined;
        parts.push(...this.drawGridRowLines(headerCells, colWidths, visibleColumns, theme, 0, false, headerColor));

        if (workingTable.rows.length > 0 && theme.joinBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
        }

        grid.forEach((row, rowIndex) => {
            parts.push(...this.drawGridRowLines(row, colWidths, visibleColumns, theme, rowIndex, workingTable.zebra));
            if (!workingTable.compact && rowIndex < grid.length - 1 && theme.joinBody) {
                parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
        });

        if (workingTable.footer) {
            const footerRow = this.createFooterRow(workingTable);
            if (theme.joinBody) {
                parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
            parts.push(...this.drawGridRowLines(footerRow, colWidths, visibleColumns, theme, 0, false));
        }

        if (theme.bottomBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.bottomLeft, theme.bottomBody, theme.bottomJoin, theme.bottomRight));
        }

        return parts.join('\n');
    }

    protected getResponsiveTable(table: Table): Table {
        if (!table.terminalWidth || table.responsiveMode === 'none') {
            if (table.columns.some((column) => column.hidden)) {
                return this.buildVisibleTable(table);
            }
            return table;
        }

        const next = new Table({
            ...table,
            columns: table.columns.map((column) => ({ ...column })),
            responsiveMode: 'none'
        });
        next.rows = table.rows;
        next.footer = table.footer;

        const grid = LayoutManager.layout(next);
        const widths = this.calculateColumnWidths(next, grid);
        const total = this.calculateTableWidth(widths, this.getVisibleColumns(next), next.theme);

        if (total <= table.terminalWidth) return this.buildVisibleTable(next);

        const sorted = next.columns.map((column, index) => ({ index, priority: column.priority })).sort((a, b) => b.priority - a.priority);
        for (const col of sorted) {
            next.columns[col.index].hidden = true;
            if (this.getVisibleColumns(next).length === 0) break;
            const fake = this.buildVisibleTable(next);
            const g = LayoutManager.layout(fake);
            const w = this.calculateColumnWidths(fake, g);
            const size = this.calculateTableWidth(w, this.getVisibleColumns(fake), fake.theme);
            if (size <= table.terminalWidth) {
                if (table.responsiveMode === 'stack') {
                    return this.toStacked(fake);
                }
                return fake;
            }
        }

        return this.buildVisibleTable(next);
    }

    protected toStacked(table: Table): Table {
        const stacked = new Table({ theme: table.theme, compact: table.compact, columns: [{ name: 'Field', key: 'field' }, { name: 'Value', key: 'value' }] });
        table.rows.forEach((row, idx) => {
            stacked.addRow([{ content: `Row ${idx + 1}`, colSpan: 2, align: 'center' }]);
            table.columns.forEach((column, colIndex) => {
                if (column.hidden) return;
                stacked.addRow({ field: column.name, value: row.cells[colIndex]?.content ?? '' });
            });
        });
        return stacked;
    }

    protected createGroupHeaderCells(groups: Array<{ title: string; colSpan: number }>): GridCell[] {
        const cells: GridCell[] = [];
        let cursor = 0;
        groups.forEach((group) => {
            cells[cursor] = {
                cell: new Cell({ content: group.title, colSpan: group.colSpan, align: 'center' }),
                x: cursor,
                y: -2,
                realColSpan: group.colSpan,
                realRowSpan: 1
            };
            cursor += group.colSpan;
        });
        return cells;
    }

    protected createFooterRow(table: Table): GridCell[] {
        const values = Array.isArray(table.footer)
            ? table.footer
            : table.columns.map((column) => (table.footer && !Array.isArray(table.footer) ? table.footer[column.key] ?? table.footer[column.name] ?? '' : ''));
        return values.map((value, index) => ({
            cell: new Cell(value),
            x: index,
            y: table.rows.length,
            realColSpan: 1,
            realRowSpan: 1
        }));
    }

    protected getVisibleColumns(table: Table): Column[] {
        return table.columns.filter((column) => !column.hidden);
    }

    protected buildVisibleTable(table: Table): Table {
        const visible = table.columns.map((column, index) => ({ column, index })).filter((item) => !item.column.hidden);
        const next = new Table({
            theme: table.theme,
            compact: table.compact,
            terminalWidth: table.terminalWidth,
            responsiveMode: 'none',
            zebra: table.zebra,
            headerGroups: table.headerGroups,
            columns: visible.map((item) => ({ ...item.column }))
        });

        table.rows.forEach((row) => {
            const data = visible.map(({ index }) => {
                const cell = row.cells[index];
                if (!cell) return '';
                return {
                    content: cell.content,
                    colSpan: cell.colSpan,
                    rowSpan: cell.rowSpan,
                    align: cell.align,
                    vAlign: cell.vAlign
                };
            });
            next.addRow(data);
        });

        if (table.footer) {
            const footer = table.footer;
            if (Array.isArray(footer)) {
                next.footer = visible.map(({ index }) => footer[index]);
            } else {
                next.footer = footer;
            }
        }

        return next;
    }

    protected calculateTableWidth(widths: number[], columns: Column[], theme: ITheme): number {
        if (columns.length === 0) return 0;
        const joinWidth = this.strWidth(theme.bodyJoin);
        const leftWidth = this.strWidth(theme.bodyLeft);
        const rightWidth = this.strWidth(theme.bodyRight);
        const content = widths.reduce((sum, width) => sum + width, 0);
        const padding = columns.reduce((sum, column) => sum + (column.paddingLeft ?? 1) + (column.paddingRight ?? 1), 0);
        return content + padding + joinWidth * Math.max(0, columns.length - 1) + leftWidth + rightWidth;
    }

    protected calculateColumnWidths(table: Table, grid: GridCell[][]): number[] {
        const visibleColumns = this.getVisibleColumns(table);
        const widths = visibleColumns.map((column) => {
            const base = Math.max(column.minWidth, column.width || this.strWidth(column.name));
            return column.maxWidth !== undefined ? Math.min(base, column.maxWidth) : base;
        });
        const joinWidth = this.strWidth(table.theme.bodyJoin);

        grid.forEach((row) => {
            row.forEach((gridCell) => {
                if (!gridCell || gridCell.hidden || gridCell.realColSpan !== 1) return;
                const index = gridCell.x;
                const column = visibleColumns[index];
                if (!column || column.width) return;
                const rawLines = stripAnsi(gridCell.cell.getString()).split('\n');
                rawLines.forEach((line) => {
                    widths[index] = Math.max(widths[index], this.strWidth(line), column.minWidth);
                    if (column.maxWidth) widths[index] = Math.min(widths[index], column.maxWidth);
                });
            });
        });

        this.expandSpannedWidths(grid, widths, visibleColumns, joinWidth);

        return widths;
    }

    protected expandSpannedWidths(grid: GridCell[][], widths: number[], columns: Column[], joinWidth: number): void {
        grid.forEach((row) => {
            row.forEach((gridCell) => {
                if (!gridCell || gridCell.hidden || gridCell.realColSpan <= 1) return;
                const start = gridCell.x;
                const span = gridCell.realColSpan;
                if (start + span > columns.length) return;

                const rawLines = stripAnsi(gridCell.cell.getString()).split('\n');
                const desired = Math.max(1, ...rawLines.map((line) => this.strWidth(line)));
                const current = this.sumWidths(widths, start, span, joinWidth);
                if (desired <= current) return;

                let remaining = desired - current;
                let candidates: number[] = [];
                for (let i = 0; i < span; i++) {
                    const column = columns[start + i];
                    if (!column || column.width !== undefined) continue;
                    candidates.push(start + i);
                }
                if (candidates.length === 0) return;

                while (remaining > 0 && candidates.length > 0) {
                    const per = Math.ceil(remaining / candidates.length);
                    const next: number[] = [];
                    for (const idx of candidates) {
                        const column = columns[idx];
                        const maxAdd = column.maxWidth !== undefined ? Math.max(0, column.maxWidth - widths[idx]) : per;
                        if (maxAdd > 0) {
                            const applied = Math.min(per, maxAdd);
                            widths[idx] += applied;
                            remaining -= applied;
                        }
                        if (column.maxWidth === undefined || widths[idx] < column.maxWidth) {
                            next.push(idx);
                        }
                    }
                    candidates = next;
                }
            });
        });
    }

    protected drawBorder(widths: number[], columns: Column[], left: string, body: string, join: string, right: string): string {
        const segments = widths.map((w, index) => {
            const column = columns[index];
            const padLeft = column?.paddingLeft ?? 1;
            const padRight = column?.paddingRight ?? 1;
            return body.repeat(Math.max(1, w + padLeft + padRight));
        });
        return left + segments.join(join) + right;
    }

    protected getSpanMetrics(columns: Column[], widths: number[], start: number, span: number, joinWidth: number): { contentWidth: number; padLeft: number; padRight: number } {
        let contentWidth = 0;
        let padLeft = 1;
        let padRight = 1;
        let internalPadding = 0;

        for (let i = 0; i < span; i++) {
            const column = columns[start + i];
            const left = column?.paddingLeft ?? 1;
            const right = column?.paddingRight ?? 1;
            if (i === 0) padLeft = left;
            else internalPadding += left;
            if (i === span - 1) padRight = right;
            else internalPadding += right;
            contentWidth += widths[start + i] || 0;
        }

        return {
            contentWidth: contentWidth + internalPadding + joinWidth * Math.max(0, span - 1),
            padLeft,
            padRight
        };
    }

    protected drawGridRowLines(row: GridCell[], widths: number[], columns: Column[], theme: ITheme, rowIndex: number, zebra: boolean, overrideColor?: ColorName): string[] {
        const visibleCols = widths.length;
        const joinWidth = this.strWidth(theme.bodyJoin);
        const cellLines: Array<{
            x: number;
            span: number;
            lines: string[];
            align: 'left' | 'center' | 'right';
            vAlign: 'top' | 'center' | 'bottom';
            padLeft: number;
            padRight: number;
            contentWidth: number;
        }> = [];

        for (let i = 0; i < visibleCols; i++) {
            const gridCell = row[i];
            if (!gridCell || gridCell.hidden) continue;
            const col = gridCell.x;
            const column = columns[col];
            const metrics = this.getSpanMetrics(columns, widths, col, gridCell.realColSpan, joinWidth);
            const wrapWord = column?.wrapWord ?? true;
            const truncate = column?.truncate ?? '...';
            const lines = this.wrapCell(gridCell.cell.getString(), metrics.contentWidth, wrapWord, truncate);
            cellLines.push({
                x: col,
                span: gridCell.realColSpan,
                lines,
                align: gridCell.cell.align || column?.align || 'left',
                vAlign: gridCell.cell.vAlign || column?.vAlign || 'top',
                padLeft: metrics.padLeft,
                padRight: metrics.padRight,
                contentWidth: metrics.contentWidth
            });
            i += gridCell.realColSpan - 1;
        }

        const rowHeight = Math.max(1, ...cellLines.map((entry) => entry.lines.length));
        const lines: string[] = [];

        for (let lineIndex = 0; lineIndex < rowHeight; lineIndex++) {
            let line = theme.bodyLeft;
            for (let col = 0; col < visibleCols; col++) {
                const current = cellLines.find((entry) => entry.x === col);
                if (!current) {
                    const metrics = this.getSpanMetrics(columns, widths, col, 1, joinWidth);
                    const blank = ' '.repeat(widths[col]);
                    line += ' '.repeat(metrics.padLeft) + blank + ' '.repeat(metrics.padRight);
                    if (col < visibleCols - 1) line += theme.bodyJoin;
                    continue;
                }

                const maxHeight = current.lines.length;
                const offset = this.verticalOffset(current.vAlign, rowHeight, maxHeight);
                const text = lineIndex < offset || lineIndex >= offset + maxHeight ? '' : current.lines[lineIndex - offset];

                let aligned = this.alignText(text, current.contentWidth, current.align);

                // Apply Coloring
                // 1. Override Color (Header)
                // 2. Column Color
                const colIndex = current.x;
                const column = columns[colIndex];
                if (overrideColor) {
                    aligned = colorize(aligned, overrideColor);
                } else if (column?.color) {
                    aligned = colorize(aligned, column.color as ColorName);
                }

                line += ' '.repeat(current.padLeft) + aligned + ' '.repeat(current.padRight);
                col += current.span - 1;
                if (col < visibleCols - 1) line += theme.bodyJoin;
            }
            line += theme.bodyRight;
            if (zebra && rowIndex % 2 === 1) line = `\u001B[2m${line}\u001B[0m`;
            lines.push(line);
        }

        return lines;
    }

    protected wrapCell(text: string, width: number, wrapWord: boolean, truncate: string): string[] {
        if (width <= 0) return [''];
        const clean = stripAnsi(text);
        if (!wrapWord && this.strWidth(clean) > width) {
            return [this.truncateText(clean, width, truncate)];
        }

        const result: string[] = [];
        clean.split('\n').forEach((rawLine) => {
            if (this.strWidth(rawLine) <= width) {
                result.push(rawLine);
                return;
            }

            if (!wrapWord) {
                result.push(this.truncateText(rawLine, width, truncate));
                return;
            }

            let chunk = '';
            rawLine.split(/(\s+)/).forEach((part) => {
                if (this.strWidth(chunk + part) <= width) {
                    chunk += part;
                    return;
                }
                if (chunk.trim()) result.push(chunk.trimEnd());
                if (this.strWidth(part) > width) {
                    let remainder = part;
                    while (this.strWidth(remainder) > width) {
                        result.push(this.truncateText(remainder, width, ''));
                        remainder = remainder.slice(Math.max(1, Math.floor(width / 2)));
                    }
                    chunk = remainder;
                } else {
                    chunk = part;
                }
            });
            if (chunk.trim()) result.push(chunk.trimEnd());
        });
        return result.length ? result : [''];
    }

    protected truncateText(text: string, width: number, suffix: string): string {
        if (this.strWidth(text) <= width) return text;
        if (width <= this.strWidth(suffix)) return suffix.slice(0, Math.max(0, width));
        let out = '';
        for (const ch of text) {
            if (this.strWidth(out + ch + suffix) > width) break;
            out += ch;
        }
        return out + suffix;
    }

    protected alignText(text: string, width: number, align: 'left' | 'center' | 'right'): string {
        const textWidth = this.strWidth(text);
        if (textWidth >= width) return text;
        const gap = width - textWidth;
        if (align === 'right') return ' '.repeat(gap) + text;
        if (align === 'center') {
            const left = Math.floor(gap / 2);
            return ' '.repeat(left) + text + ' '.repeat(gap - left);
        }
        return text + ' '.repeat(gap);
    }

    protected verticalOffset(vAlign: 'top' | 'center' | 'bottom', rowHeight: number, contentHeight: number): number {
        if (vAlign === 'bottom') return rowHeight - contentHeight;
        if (vAlign === 'center') return Math.floor((rowHeight - contentHeight) / 2);
        return 0;
    }

    protected sumWidths(widths: number[], start: number, span: number, joinWidth: number): number {
        let sum = 0;
        for (let i = 0; i < span; i++) sum += widths[start + i] || 0;
        return sum + Math.max(0, span - 1) * joinWidth;
    }

    protected strWidth(value: string): number {
        return stringWidth(stripAnsi(value));
    }
}
