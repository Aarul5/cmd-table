"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvRenderer = void 0;
var CsvRenderer = /** @class */ (function () {
    function CsvRenderer(options) {
        if (options === void 0) { options = {}; }
        this.delimiter = options.delimiter || ',';
        this.quote = options.quote || '"';
        this.includeHeader = options.includeHeader !== false;
    }
    CsvRenderer.prototype.render = function (table) {
        var _this = this;
        var visibleIndices = table.columns.map(function (column, index) { return ({ column: column, index: index }); }).filter(function (item) { return !item.column.hidden; });
        var rows = [];
        if (this.includeHeader) {
            rows.push(this.drawRow(visibleIndices.map(function (item) { return item.column.name; })));
        }
        rows.push.apply(rows, table.rows.map(function (row) { return _this.drawRow(visibleIndices.map(function (item) { var _a, _b; return (_b = (_a = row.cells[item.index]) === null || _a === void 0 ? void 0 : _a.getString()) !== null && _b !== void 0 ? _b : ''; })); }));
        return rows.join('\n');
    };
    CsvRenderer.prototype.drawRow = function (values) {
        var _this = this;
        return values.map(function (value) { return _this.escape(value); }).join(this.delimiter);
    };
    CsvRenderer.prototype.escape = function (value) {
        if (value.includes(this.delimiter) || value.includes(this.quote) || value.includes('\n')) {
            return this.quote + value.replace(new RegExp(this.quote, 'g'), this.quote + this.quote) + this.quote;
        }
        return value;
    };
    return CsvRenderer;
}());
exports.CsvRenderer = CsvRenderer;
