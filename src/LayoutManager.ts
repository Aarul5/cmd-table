import { Table } from './Table';
import { Cell } from './Cell';

export interface GridCell {
    cell: Cell;
    x: number;
    y: number;
    realColSpan: number;
    realRowSpan: number;
    hidden?: boolean; // True if this position is covered by a span from another cell
}

export class LayoutManager {
    public static layout(table: Table): GridCell[][] {
        const grid: GridCell[][] = [];
        const occupied: { [key: string]: boolean } = {};
        const isOccupied = (x: number, y: number) => occupied[`${x},${y}`];
        const markOccupied = (x: number, y: number) => occupied[`${x},${y}`] = true;
        let maxColumns = table.columns.length || 0;

        table.rows.forEach((row, rowIndex) => {
            if (!grid[rowIndex]) grid[rowIndex] = [];
            let colIndex = 0;

            row.cells.forEach((cell) => {
                // Find next available slot
                while (isOccupied(colIndex, rowIndex)) {
                    colIndex++;
                }

                if (cell.merged) return;

                if (table.columns.length && colIndex + cell.colSpan > table.columns.length) {
                    throw new Error(`Row ${rowIndex} exceeds defined column count (${table.columns.length}).`);
                }

                // Detect span conflicts before placement
                for (let r = 0; r < cell.rowSpan; r++) {
                    for (let c = 0; c < cell.colSpan; c++) {
                        if (isOccupied(colIndex + c, rowIndex + r)) {
                            throw new Error(`Cell span conflict at row ${rowIndex}, col ${colIndex}.`);
                        }
                    }
                }

                // Place cell
                const gridCell: GridCell = {
                    cell,
                    x: colIndex,
                    y: rowIndex,
                    realColSpan: cell.colSpan,
                    realRowSpan: cell.rowSpan
                };
                grid[rowIndex][colIndex] = gridCell;

                // Mark spanned area as occupied
                for (let r = 0; r < cell.rowSpan; r++) {
                    for (let c = 0; c < cell.colSpan; c++) {
                        markOccupied(colIndex + c, rowIndex + r);
                        if (r === 0 && c === 0) continue;

                        if (!grid[rowIndex + r]) grid[rowIndex + r] = [];
                        grid[rowIndex + r][colIndex + c] = {
                            cell: gridCell.cell,
                            x: colIndex + c,
                            y: rowIndex + r,
                            realColSpan: gridCell.realColSpan,
                            realRowSpan: gridCell.realRowSpan,
                            hidden: true
                        };
                    }
                }

                colIndex += cell.colSpan;
                maxColumns = Math.max(maxColumns, colIndex);
            });
        });

        const columnCount = table.columns.length || maxColumns;
        for (let r = 0; r < grid.length; r++) {
            if (!grid[r]) grid[r] = [];
            for (let c = 0; c < columnCount; c++) {
                if (grid[r][c]) continue;
                if (isOccupied(c, r)) {
                    grid[r][c] = {
                        cell: new Cell(''),
                        x: c,
                        y: r,
                        realColSpan: 1,
                        realRowSpan: 1,
                        hidden: true
                    };
                    continue;
                }
                grid[r][c] = {
                    cell: new Cell(''),
                    x: c,
                    y: r,
                    realColSpan: 1,
                    realRowSpan: 1
                };
            }
        }

        return grid;
    }
}
