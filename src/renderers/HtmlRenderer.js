"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlRenderer = void 0;
var escapeHtml = function (value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
var HtmlRenderer = /** @class */ (function () {
    function HtmlRenderer() {
    }
    HtmlRenderer.prototype.render = function (table) {
        var visible = table.columns.map(function (column, index) { return ({ column: column, index: index }); }).filter(function (item) { return !item.column.hidden; });
        var head = "<thead><tr>".concat(visible.map(function (item) { return "<th>".concat(escapeHtml(item.column.name), "</th>"); }).join(''), "</tr></thead>");
        var bodyRows = table.rows
            .map(function (row) { return "<tr>".concat(visible.map(function (item) { var _a, _b; return "<td>".concat(escapeHtml((_b = (_a = row.cells[item.index]) === null || _a === void 0 ? void 0 : _a.getString()) !== null && _b !== void 0 ? _b : ''), "</td>"); }).join(''), "</tr>"); })
            .join('');
        return "<table>".concat(head, "<tbody>").concat(bodyRows, "</tbody></table>");
    };
    return HtmlRenderer;
}());
exports.HtmlRenderer = HtmlRenderer;
