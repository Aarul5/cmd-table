"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvTable = void 0;
var Table_1 = require("../Table");
var CsvTable = /** @class */ (function () {
    function CsvTable() {
    }
    /**
     * Parse a CSV string into a Table.
     * @param csvString Raw CSV content.
     * @param options Parsing options.
     */
    CsvTable.from = function (csvString, options) {
        if (options === void 0) { options = {}; }
        var _a = options.hasHeader, hasHeader = _a === void 0 ? true : _a, _b = options.delimiter, delimiter = _b === void 0 ? ',' : _b;
        var lines = csvString
            .trim()
            .split(/\r?\n/)
            .filter(function (l) { return l.trim() !== ''; });
        if (lines.length === 0) {
            return new Table_1.Table();
        }
        var parseLine = function (line) {
            var result = [];
            var current = '';
            var inQuotes = false;
            for (var i = 0; i < line.length; i++) {
                var ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++; // Skip escaped quote
                    }
                    else {
                        inQuotes = !inQuotes;
                    }
                }
                else if (ch === delimiter && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                }
                else {
                    current += ch;
                }
            }
            result.push(current.trim());
            return result;
        };
        var table = new Table_1.Table();
        var headers;
        var dataStartIndex;
        if (hasHeader) {
            headers = parseLine(lines[0]);
            dataStartIndex = 1;
        }
        else {
            // Generate column headers: Col1, Col2, ...
            var firstRow = parseLine(lines[0]);
            headers = firstRow.map(function (_, i) { return "Col".concat(i + 1); });
            dataStartIndex = 0;
        }
        headers.forEach(function (h) { return table.addColumn(h); });
        var _loop_1 = function (i) {
            var values = parseLine(lines[i]);
            var row = {};
            headers.forEach(function (h, j) {
                row[h] = values[j] !== undefined ? values[j] : '';
            });
            table.addRow(row);
        };
        for (var i = dataStartIndex; i < lines.length; i++) {
            _loop_1(i);
        }
        return table;
    };
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
