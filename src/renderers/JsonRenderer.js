"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRenderer = void 0;
var JsonRenderer = /** @class */ (function () {
    function JsonRenderer() {
    }
    JsonRenderer.prototype.render = function (table) {
        var visibleColumns = table.columns.map(function (column, index) { return ({ column: column, index: index }); }).filter(function (item) { return !item.column.hidden; });
        var data = table.rows.map(function (row) {
            var obj = {};
            visibleColumns.forEach(function (_a) {
                var _b;
                var column = _a.column, index = _a.index;
                obj[column.key || column.name] = (_b = row.cells[index]) === null || _b === void 0 ? void 0 : _b.content;
            });
            return obj;
        });
        return JSON.stringify(data, null, 2);
    };
    return JsonRenderer;
}());
exports.JsonRenderer = JsonRenderer;
