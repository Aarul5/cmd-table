"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringRenderer = void 0;
var Table_1 = require("../Table");
var Cell_1 = require("../Cell");
var LayoutManager_1 = require("../LayoutManager");
var textUtils_1 = require("../utils/textUtils");
var colors_1 = require("../utils/colors");
var StringRenderer = /** @class */ (function () {
    function StringRenderer() {
    }
    StringRenderer.prototype.render = function (table) {
        var _this = this;
        if (table.columns.length === 0 && table.rows.length === 0)
            return '';
        var workingTable = this.getResponsiveTable(table);
        var visibleColumns = this.getVisibleColumns(workingTable);
        var theme = workingTable.theme;
        var grid = LayoutManager_1.LayoutManager.layout(workingTable);
        var colWidths = this.calculateColumnWidths(workingTable, grid);
        var parts = [];
        if (theme.topBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.topLeft, theme.topBody, theme.topJoin, theme.topRight));
        }
        if (workingTable.headerGroups.length) {
            var groups = this.createGroupHeaderCells(workingTable.headerGroups);
            parts.push.apply(parts, this.drawGridRowLines(groups, colWidths, visibleColumns, theme, 0, false));
            if (!workingTable.compact && theme.joinBody) {
                parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
        }
        var headerCells = workingTable.columns
            .filter(function (c) { return !c.hidden; })
            .map(function (column, index) { return ({ cell: new Cell_1.Cell(column.name), x: index, y: -1, realColSpan: 1, realRowSpan: 1 }); });
        // Apply header color
        var headerColor = workingTable.headerColor;
        parts.push.apply(parts, this.drawGridRowLines(headerCells, colWidths, visibleColumns, theme, 0, false, headerColor));
        if (workingTable.rows.length > 0 && theme.joinBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
        }
        grid.forEach(function (row, rowIndex) {
            parts.push.apply(parts, _this.drawGridRowLines(row, colWidths, visibleColumns, theme, rowIndex, workingTable.zebra));
            if (!workingTable.compact && rowIndex < grid.length - 1 && theme.joinBody) {
                parts.push(_this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
        });
        if (workingTable.footer) {
            var footerRow = this.createFooterRow(workingTable);
            if (theme.joinBody) {
                parts.push(this.drawBorder(colWidths, visibleColumns, theme.joinLeft, theme.joinBody, theme.joinJoin, theme.joinRight));
            }
            parts.push.apply(parts, this.drawGridRowLines(footerRow, colWidths, visibleColumns, theme, 0, false));
        }
        if (theme.bottomBody) {
            parts.push(this.drawBorder(colWidths, visibleColumns, theme.bottomLeft, theme.bottomBody, theme.bottomJoin, theme.bottomRight));
        }
        return parts.join('\n');
    };
    StringRenderer.prototype.getResponsiveTable = function (table) {
        var terminalWidth = table.terminalWidth || process.stdout.columns || 80;
        if (table.responsiveMode === 'none') {
            if (table.columns.some(function (column) { return column.hidden; })) {
                return this.buildVisibleTable(table);
            }
            return table;
        }
        var next = new Table_1.Table(__assign(__assign({}, table), { columns: table.columns.map(function (column) { return (__assign({}, column)); }), responsiveMode: 'none' }));
        next.rows = table.rows;
        next.footer = table.footer;
        var grid = LayoutManager_1.LayoutManager.layout(next);
        var widths = this.calculateColumnWidths(next, grid);
        var total = this.calculateTableWidth(widths, this.getVisibleColumns(next), next.theme);
        if (total <= terminalWidth)
            return this.buildVisibleTable(next);
        var sorted = next.columns.map(function (column, index) { return ({ index: index, priority: column.priority }); }).sort(function (a, b) { return b.priority - a.priority; });
        for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
            var col = sorted_1[_i];
            next.columns[col.index].hidden = true;
            if (this.getVisibleColumns(next).length === 0)
                break;
            var fake = this.buildVisibleTable(next);
            var g = LayoutManager_1.LayoutManager.layout(fake);
            var w = this.calculateColumnWidths(fake, g);
            var size = this.calculateTableWidth(w, this.getVisibleColumns(fake), fake.theme);
            if (size <= terminalWidth) {
                if (table.responsiveMode === 'stack') {
                    return this.toStacked(fake);
                }
                return fake;
            }
        }
        return this.buildVisibleTable(next);
    };
    StringRenderer.prototype.toStacked = function (table) {
        var stacked = new Table_1.Table({ theme: table.theme, compact: table.compact, columns: [{ name: 'Field', key: 'field' }, { name: 'Value', key: 'value' }] });
        table.rows.forEach(function (row, idx) {
            stacked.addRow([{ content: "Row ".concat(idx + 1), colSpan: 2, align: 'center' }]);
            table.columns.forEach(function (column, colIndex) {
                var _a, _b;
                if (column.hidden)
                    return;
                stacked.addRow({ field: column.name, value: (_b = (_a = row.cells[colIndex]) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : '' });
            });
        });
        return stacked;
    };
    StringRenderer.prototype.createGroupHeaderCells = function (groups) {
        var cells = [];
        var cursor = 0;
        groups.forEach(function (group) {
            cells[cursor] = {
                cell: new Cell_1.Cell({ content: group.title, colSpan: group.colSpan, align: 'center' }),
                x: cursor,
                y: -2,
                realColSpan: group.colSpan,
                realRowSpan: 1
            };
            cursor += group.colSpan;
        });
        return cells;
    };
    StringRenderer.prototype.createFooterRow = function (table) {
        var values = Array.isArray(table.footer)
            ? table.footer
            : table.columns.map(function (column) { var _a, _b; return (table.footer && !Array.isArray(table.footer) ? (_b = (_a = table.footer[column.key]) !== null && _a !== void 0 ? _a : table.footer[column.name]) !== null && _b !== void 0 ? _b : '' : ''); });
        return values.map(function (value, index) { return ({
            cell: new Cell_1.Cell(value),
            x: index,
            y: table.rows.length,
            realColSpan: 1,
            realRowSpan: 1
        }); });
    };
    StringRenderer.prototype.getVisibleColumns = function (table) {
        return table.columns.filter(function (column) { return !column.hidden; });
    };
    StringRenderer.prototype.buildVisibleTable = function (table) {
        var visible = table.columns.map(function (column, index) { return ({ column: column, index: index }); }).filter(function (item) { return !item.column.hidden; });
        var next = new Table_1.Table({
            theme: table.theme,
            compact: table.compact,
            terminalWidth: table.terminalWidth,
            responsiveMode: 'none',
            zebra: table.zebra,
            headerGroups: table.headerGroups,
            columns: visible.map(function (item) { return (__assign({}, item.column)); })
        });
        table.rows.forEach(function (row) {
            var data = visible.map(function (_a) {
                var index = _a.index;
                var cell = row.cells[index];
                if (!cell)
                    return '';
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
            var footer_1 = table.footer;
            if (Array.isArray(footer_1)) {
                next.footer = visible.map(function (_a) {
                    var index = _a.index;
                    return footer_1[index];
                });
            }
            else {
                next.footer = footer_1;
            }
        }
        return next;
    };
    StringRenderer.prototype.calculateTableWidth = function (widths, columns, theme) {
        if (columns.length === 0)
            return 0;
        var joinWidth = this.strWidth(theme.bodyJoin);
        var leftWidth = this.strWidth(theme.bodyLeft);
        var rightWidth = this.strWidth(theme.bodyRight);
        var content = widths.reduce(function (sum, width) { return sum + width; }, 0);
        var padding = columns.reduce(function (sum, column) { var _a, _b; return sum + ((_a = column.paddingLeft) !== null && _a !== void 0 ? _a : 1) + ((_b = column.paddingRight) !== null && _b !== void 0 ? _b : 1); }, 0);
        return content + padding + joinWidth * Math.max(0, columns.length - 1) + leftWidth + rightWidth;
    };
    StringRenderer.prototype.calculateColumnWidths = function (table, grid) {
        var _this = this;
        var visibleColumns = this.getVisibleColumns(table);
        var widths = visibleColumns.map(function (column) {
            var base = Math.max(column.minWidth, column.width || _this.strWidth(column.name));
            return column.maxWidth !== undefined ? Math.min(base, column.maxWidth) : base;
        });
        var joinWidth = this.strWidth(table.theme.bodyJoin);
        grid.forEach(function (row) {
            row.forEach(function (gridCell) {
                if (!gridCell || gridCell.hidden || gridCell.realColSpan !== 1)
                    return;
                var index = gridCell.x;
                var column = visibleColumns[index];
                if (!column || column.width)
                    return;
                var rawLines = (0, textUtils_1.stripAnsi)(gridCell.cell.getString()).split('\n');
                rawLines.forEach(function (line) {
                    widths[index] = Math.max(widths[index], _this.strWidth(line), column.minWidth);
                    if (column.maxWidth)
                        widths[index] = Math.min(widths[index], column.maxWidth);
                });
            });
        });
        this.expandSpannedWidths(grid, widths, visibleColumns, joinWidth);
        return widths;
    };
    StringRenderer.prototype.expandSpannedWidths = function (grid, widths, columns, joinWidth) {
        var _this = this;
        grid.forEach(function (row) {
            row.forEach(function (gridCell) {
                if (!gridCell || gridCell.hidden || gridCell.realColSpan <= 1)
                    return;
                var start = gridCell.x;
                var span = gridCell.realColSpan;
                if (start + span > columns.length)
                    return;
                var rawLines = (0, textUtils_1.stripAnsi)(gridCell.cell.getString()).split('\n');
                var desired = Math.max.apply(Math, __spreadArray([1], rawLines.map(function (line) { return _this.strWidth(line); }), false));
                var current = _this.sumWidths(widths, start, span, joinWidth);
                if (desired <= current)
                    return;
                var remaining = desired - current;
                var candidates = [];
                for (var i = 0; i < span; i++) {
                    var column = columns[start + i];
                    if (!column || column.width !== undefined)
                        continue;
                    candidates.push(start + i);
                }
                if (candidates.length === 0)
                    return;
                while (remaining > 0 && candidates.length > 0) {
                    var per = Math.ceil(remaining / candidates.length);
                    var next = [];
                    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
                        var idx = candidates_1[_i];
                        var column = columns[idx];
                        var maxAdd = column.maxWidth !== undefined ? Math.max(0, column.maxWidth - widths[idx]) : per;
                        if (maxAdd > 0) {
                            var applied = Math.min(per, maxAdd);
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
    };
    StringRenderer.prototype.drawBorder = function (widths, columns, left, body, join, right) {
        var segments = widths.map(function (w, index) {
            var _a, _b;
            var column = columns[index];
            var padLeft = (_a = column === null || column === void 0 ? void 0 : column.paddingLeft) !== null && _a !== void 0 ? _a : 1;
            var padRight = (_b = column === null || column === void 0 ? void 0 : column.paddingRight) !== null && _b !== void 0 ? _b : 1;
            return body.repeat(Math.max(1, w + padLeft + padRight));
        });
        return left + segments.join(join) + right;
    };
    StringRenderer.prototype.getSpanMetrics = function (columns, widths, start, span, joinWidth) {
        var _a, _b;
        var contentWidth = 0;
        var padLeft = 1;
        var padRight = 1;
        var internalPadding = 0;
        for (var i = 0; i < span; i++) {
            var column = columns[start + i];
            var left = (_a = column === null || column === void 0 ? void 0 : column.paddingLeft) !== null && _a !== void 0 ? _a : 1;
            var right = (_b = column === null || column === void 0 ? void 0 : column.paddingRight) !== null && _b !== void 0 ? _b : 1;
            if (i === 0)
                padLeft = left;
            else
                internalPadding += left;
            if (i === span - 1)
                padRight = right;
            else
                internalPadding += right;
            contentWidth += widths[start + i] || 0;
        }
        return {
            contentWidth: contentWidth + internalPadding + joinWidth * Math.max(0, span - 1),
            padLeft: padLeft,
            padRight: padRight
        };
    };
    StringRenderer.prototype.drawGridRowLines = function (row, widths, columns, theme, rowIndex, zebra, overrideColor) {
        var _a, _b;
        var visibleCols = widths.length;
        var joinWidth = this.strWidth(theme.bodyJoin);
        var cellLines = [];
        for (var i = 0; i < visibleCols; i++) {
            var gridCell = row[i];
            if (!gridCell || gridCell.hidden)
                continue;
            var col = gridCell.x;
            var column = columns[col];
            var metrics = this.getSpanMetrics(columns, widths, col, gridCell.realColSpan, joinWidth);
            var wrapWord = (_a = column === null || column === void 0 ? void 0 : column.wrapWord) !== null && _a !== void 0 ? _a : true;
            var truncate = (_b = column === null || column === void 0 ? void 0 : column.truncate) !== null && _b !== void 0 ? _b : '...';
            var lines_1 = this.wrapCell(gridCell.cell.getString(), metrics.contentWidth, wrapWord, truncate);
            cellLines.push({
                x: col,
                span: gridCell.realColSpan,
                lines: lines_1,
                align: gridCell.cell.align || (column === null || column === void 0 ? void 0 : column.align) || 'left',
                vAlign: gridCell.cell.vAlign || (column === null || column === void 0 ? void 0 : column.vAlign) || 'top',
                padLeft: metrics.padLeft,
                padRight: metrics.padRight,
                contentWidth: metrics.contentWidth
            });
            i += gridCell.realColSpan - 1;
        }
        var rowHeight = Math.max.apply(Math, __spreadArray([1], cellLines.map(function (entry) { return entry.lines.length; }), false));
        var lines = [];
        for (var lineIndex = 0; lineIndex < rowHeight; lineIndex++) {
            var line = theme.bodyLeft;
            var _loop_1 = function (col) {
                var current = cellLines.find(function (entry) { return entry.x === col; });
                if (!current) {
                    var metrics = this_1.getSpanMetrics(columns, widths, col, 1, joinWidth);
                    var blank = ' '.repeat(widths[col]);
                    line += ' '.repeat(metrics.padLeft) + blank + ' '.repeat(metrics.padRight);
                    if (col < visibleCols - 1)
                        line += theme.bodyJoin;
                    return out_col_1 = col, "continue";
                }
                var maxHeight = current.lines.length;
                var offset = this_1.verticalOffset(current.vAlign, rowHeight, maxHeight);
                var text = lineIndex < offset || lineIndex >= offset + maxHeight ? '' : current.lines[lineIndex - offset];
                var aligned = this_1.alignText(text, current.contentWidth, current.align);
                // Apply Coloring
                // 1. Override Color (Header)
                // 2. Column Color
                var colIndex = current.x;
                var column = columns[colIndex];
                if (overrideColor) {
                    aligned = (0, colors_1.colorize)(aligned, overrideColor);
                }
                else if (column === null || column === void 0 ? void 0 : column.color) {
                    aligned = (0, colors_1.colorize)(aligned, column.color);
                }
                line += ' '.repeat(current.padLeft) + aligned + ' '.repeat(current.padRight);
                col += current.span - 1;
                if (col < visibleCols - 1)
                    line += theme.bodyJoin;
                out_col_1 = col;
            };
            var this_1 = this, out_col_1;
            for (var col = 0; col < visibleCols; col++) {
                _loop_1(col);
                col = out_col_1;
            }
            line += theme.bodyRight;
            if (zebra && rowIndex % 2 === 1)
                line = "\u001B[2m".concat(line, "\u001B[0m");
            lines.push(line);
        }
        return lines;
    };
    StringRenderer.prototype.wrapCell = function (text, width, wrapWord, truncate) {
        var _this = this;
        if (width <= 0)
            return [''];
        var clean = (0, textUtils_1.stripAnsi)(text);
        if (!wrapWord && this.strWidth(clean) > width) {
            return [this.truncateText(clean, width, truncate)];
        }
        var result = [];
        clean.split('\n').forEach(function (rawLine) {
            if (_this.strWidth(rawLine) <= width) {
                result.push(rawLine);
                return;
            }
            if (!wrapWord) {
                result.push(_this.truncateText(rawLine, width, truncate));
                return;
            }
            var chunk = '';
            rawLine.split(/(\s+)/).forEach(function (part) {
                if (_this.strWidth(chunk + part) <= width) {
                    chunk += part;
                    return;
                }
                if (chunk.trim())
                    result.push(chunk.trimEnd());
                if (_this.strWidth(part) > width) {
                    var remainder = part;
                    while (_this.strWidth(remainder) > width) {
                        result.push(_this.truncateText(remainder, width, ''));
                        remainder = remainder.slice(Math.max(1, Math.floor(width / 2)));
                    }
                    chunk = remainder;
                }
                else {
                    chunk = part;
                }
            });
            if (chunk.trim())
                result.push(chunk.trimEnd());
        });
        return result.length ? result : [''];
    };
    StringRenderer.prototype.truncateText = function (text, width, suffix) {
        if (this.strWidth(text) <= width)
            return text;
        if (width <= this.strWidth(suffix))
            return suffix.slice(0, Math.max(0, width));
        var out = '';
        for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
            var ch = text_1[_i];
            if (this.strWidth(out + ch + suffix) > width)
                break;
            out += ch;
        }
        return out + suffix;
    };
    StringRenderer.prototype.alignText = function (text, width, align) {
        var textWidth = this.strWidth(text);
        if (textWidth >= width)
            return text;
        var gap = width - textWidth;
        if (align === 'right')
            return ' '.repeat(gap) + text;
        if (align === 'center') {
            var left = Math.floor(gap / 2);
            return ' '.repeat(left) + text + ' '.repeat(gap - left);
        }
        return text + ' '.repeat(gap);
    };
    StringRenderer.prototype.verticalOffset = function (vAlign, rowHeight, contentHeight) {
        if (vAlign === 'bottom')
            return rowHeight - contentHeight;
        if (vAlign === 'center')
            return Math.floor((rowHeight - contentHeight) / 2);
        return 0;
    };
    StringRenderer.prototype.sumWidths = function (widths, start, span, joinWidth) {
        var sum = 0;
        for (var i = 0; i < span; i++)
            sum += widths[start + i] || 0;
        return sum + Math.max(0, span - 1) * joinWidth;
    };
    StringRenderer.prototype.strWidth = function (value) {
        return (0, textUtils_1.stringWidth)((0, textUtils_1.stripAnsi)(value));
    };
    return StringRenderer;
}());
exports.StringRenderer = StringRenderer;
