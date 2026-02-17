"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTable = void 0;
var JsonTable = /** @class */ (function () {
    function JsonTable() {
    }
    /**
     * Convert a Table to a JSON string.
     * @param table The table instance to export.
     */
    JsonTable.toJson = function (table) {
        return table.export('json');
    };
    return JsonTable;
}());
exports.JsonTable = JsonTable;
