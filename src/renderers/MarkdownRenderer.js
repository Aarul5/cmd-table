"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownRenderer = void 0;
var Cell_1 = require("../Cell");
var MarkdownRenderer = /** @class */ (function () {
    function MarkdownRenderer() {
    }
    MarkdownRenderer.prototype.render = function (table) {
        var _this = this;
        var cols = table.columns.filter(function (column) { return !column.hidden; });
        var header = this.drawRow(cols.map(function (column) { return new Cell_1.Cell(column.name); }));
        var separator = '| ' + cols.map(function (column) { return _this.alignRule(column.align); }).join(' | ') + ' |';
        var body = table.rows
            .map(function (row) { return _this.drawRow(row.cells.filter(function (_, idx) { var _a; return !((_a = table.columns[idx]) === null || _a === void 0 ? void 0 : _a.hidden); })); })
            .join('\n');
        return [header, separator, body].filter(Boolean).join('\n');
    };
    MarkdownRenderer.prototype.drawRow = function (cells) {
        return '| ' + cells.map(function (cell) { return cell.getString().replace(/\|/g, '\\|'); }).join(' | ') + ' |';
    };
    MarkdownRenderer.prototype.alignRule = function (align) {
        if (align === void 0) { align = 'left'; }
        if (align === 'center')
            return ':---:';
        if (align === 'right')
            return '---:';
        return ':---';
    };
    return MarkdownRenderer;
}());
exports.MarkdownRenderer = MarkdownRenderer;
