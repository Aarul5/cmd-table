"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvTable = void 0;
var CsvTable = /** @class */ (function () {
    function CsvTable() {
    }
    /**
     * Convert a Table to a CSV string.
     * @param table The table instance to export.
     * @param options CSV formatting options (delimiter, quote).
     */
    CsvTable.toCsv = function (table, options) {
        return table.export('csv', options);
    };
    return CsvTable;
}());
exports.CsvTable = CsvTable;
