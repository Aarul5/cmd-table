"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutManager = void 0;
var Cell_1 = require("./Cell");
var LayoutManager = /** @class */ (function () {
    function LayoutManager() {
    }
    LayoutManager.layout = function (table) {
        var grid = [];
        var occupied = {};
        var isOccupied = function (x, y) { return occupied["".concat(x, ",").concat(y)]; };
        var markOccupied = function (x, y) { return occupied["".concat(x, ",").concat(y)] = true; };
        var maxColumns = table.columns.length || 0;
        table.rows.forEach(function (row, rowIndex) {
            if (!grid[rowIndex])
                grid[rowIndex] = [];
            var colIndex = 0;
            row.cells.forEach(function (cell) {
                // Find next available slot
                while (isOccupied(colIndex, rowIndex)) {
                    colIndex++;
                }
                if (cell.merged)
                    return;
                if (table.columns.length && colIndex + cell.colSpan > table.columns.length) {
                    throw new Error("Row ".concat(rowIndex, " exceeds defined column count (").concat(table.columns.length, ")."));
                }
                // Detect span conflicts before placement
                for (var r = 0; r < cell.rowSpan; r++) {
                    for (var c = 0; c < cell.colSpan; c++) {
                        if (isOccupied(colIndex + c, rowIndex + r)) {
                            throw new Error("Cell span conflict at row ".concat(rowIndex, ", col ").concat(colIndex, "."));
                        }
                    }
                }
                // Place cell
                var gridCell = {
                    cell: cell,
                    x: colIndex,
                    y: rowIndex,
                    realColSpan: cell.colSpan,
                    realRowSpan: cell.rowSpan
                };
                grid[rowIndex][colIndex] = gridCell;
                // Mark spanned area as occupied
                for (var r = 0; r < cell.rowSpan; r++) {
                    for (var c = 0; c < cell.colSpan; c++) {
                        markOccupied(colIndex + c, rowIndex + r);
                        if (r === 0 && c === 0)
                            continue;
                        if (!grid[rowIndex + r])
                            grid[rowIndex + r] = [];
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
        var columnCount = table.columns.length || maxColumns;
        for (var r = 0; r < grid.length; r++) {
            if (!grid[r])
                grid[r] = [];
            for (var c = 0; c < columnCount; c++) {
                if (grid[r][c])
                    continue;
                if (isOccupied(c, r)) {
                    grid[r][c] = {
                        cell: new Cell_1.Cell(''),
                        x: c,
                        y: r,
                        realColSpan: 1,
                        realRowSpan: 1,
                        hidden: true
                    };
                    continue;
                }
                grid[r][c] = {
                    cell: new Cell_1.Cell(''),
                    x: c,
                    y: r,
                    realColSpan: 1,
                    realRowSpan: 1
                };
            }
        }
        return grid;
    };
    return LayoutManager;
}());
exports.LayoutManager = LayoutManager;
