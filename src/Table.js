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
exports.Table = void 0;
var Column_1 = require("./Column");
var Row_1 = require("./Row");
var StringRenderer_1 = require("./renderers/StringRenderer");
var CsvRenderer_1 = require("./renderers/CsvRenderer");
var JsonRenderer_1 = require("./renderers/JsonRenderer");
var HtmlRenderer_1 = require("./renderers/HtmlRenderer");
var MarkdownRenderer_1 = require("./renderers/MarkdownRenderer");
var Theme_1 = require("./themes/Theme");
var Table = /** @class */ (function () {
    function Table(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.columns = [];
        this.rows = [];
        this.compact = false;
        this.responsiveMode = 'none';
        this.zebra = false;
        this.headerGroups = [];
        this.theme = options.theme || Theme_1.THEME_Rounded;
        this.compact = Boolean(options.compact);
        this.terminalWidth = options.terminalWidth;
        this.responsiveMode = options.responsiveMode || 'none';
        this.zebra = Boolean(options.zebra);
        this.headerGroups = options.headerGroups || [];
        this.headerColor = options.headerColor || 'magenta'; // Default magenta header
        if (options.columns) {
            options.columns.forEach(function (col) { return _this.addColumn(col); });
        }
    }
    Table.prototype.addColumn = function (options) {
        var colOptions = typeof options === 'string' ? { name: options, key: options } : options;
        // Auto-style first column as cyan if no color specified
        if (this.columns.length === 0 && colOptions.color === undefined) {
            colOptions.color = 'cyan';
        }
        var col = new Column_1.Column(colOptions);
        this.columns.push(col);
        return col;
    };
    Table.prototype.setColumns = function (columns) {
        var _this = this;
        this.columns = [];
        columns.forEach(function (column) { return _this.addColumn(column); });
        return this;
    };
    Table.prototype.addRow = function (data) {
        var row = new Row_1.Row(data, this);
        this.rows.push(row);
        return row;
    };
    Table.prototype.addRows = function (rows) {
        var _this = this;
        rows.forEach(function (row) { return _this.addRow(row); });
        return this;
    };
    Table.prototype.setFooter = function (footer) {
        this.footer = footer;
        return this;
    };
    Table.prototype.summarize = function (columns, op) {
        var _this = this;
        if (op === void 0) { op = 'sum'; }
        var footer = this.footer && !Array.isArray(this.footer) ? __assign({}, this.footer) : {};
        columns.forEach(function (name) {
            var colIndex = _this.columns.findIndex(function (c) { return c.name === name || c.key === name; });
            if (colIndex < 0)
                return;
            var values = _this.rows
                .map(function (row) { var _a; return Number((_a = row.cells[colIndex]) === null || _a === void 0 ? void 0 : _a.content); })
                .filter(function (value) { return Number.isFinite(value); });
            if (op === 'count')
                footer[name] = values.length;
            else if (op === 'avg')
                footer[name] = values.length ? Number((values.reduce(function (a, b) { return a + b; }, 0) / values.length).toFixed(2)) : 0;
            else
                footer[name] = values.reduce(function (a, b) { return a + b; }, 0);
        });
        this.footer = footer;
        return this;
    };
    Table.prototype.paginate = function (page, pageSize) {
        var start = Math.max(0, (page - 1) * pageSize);
        var end = start + pageSize;
        var next = new Table({
            theme: this.theme,
            compact: this.compact,
            terminalWidth: this.terminalWidth,
            responsiveMode: this.responsiveMode,
            zebra: this.zebra,
            headerGroups: this.headerGroups,
            columns: this.columns.map(function (column) { return (__assign({}, column)); })
        });
        next.rows = this.rows.slice(start, end);
        next.footer = this.footer;
        return next;
    };
    Table.prototype.render = function () {
        var renderer = new StringRenderer_1.StringRenderer();
        return renderer.render(this);
    };
    Table.prototype.getPages = function (pageSize) {
        var pages = [];
        var totalPages = Math.ceil(this.rows.length / pageSize);
        for (var i = 1; i <= totalPages; i++) {
            pages.push(this.paginate(i, pageSize));
        }
        return pages;
    };
    Table.prototype.export = function (format, options) {
        if (options === void 0) { options = {}; }
        switch (format) {
            case 'csv':
                return new CsvRenderer_1.CsvRenderer(options).render(this);
            case 'json':
                return new JsonRenderer_1.JsonRenderer().render(this);
            case 'html':
                return new HtmlRenderer_1.HtmlRenderer().render(this);
            case 'md':
            case 'markdown':
                return new MarkdownRenderer_1.MarkdownRenderer().render(this);
            default:
                throw new Error("Unknown export format: ".concat(format));
        }
    };
    Table.fromVertical = function (record, options) {
        if (options === void 0) { options = {}; }
        var table = new Table(__assign(__assign({}, options), { columns: [{ name: 'Key', key: 'key' }, { name: 'Value', key: 'value' }] }));
        Object.entries(record).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return table.addRow({ key: key, value: value });
        });
        return table;
    };
    Table.prototype.sort = function (columnName, direction) {
        if (direction === void 0) { direction = 'asc'; }
        var colIndex = this.columns.findIndex(function (c) { return c.name === columnName || c.key === columnName; });
        if (colIndex === -1)
            return this;
        this.rows.sort(function (a, b) {
            var cellA = a.cells[colIndex];
            var cellB = b.cells[colIndex];
            var valA = cellA ? cellA.content : '';
            var valB = cellB ? cellB.content : '';
            if (valA === valB)
                return 0;
            if (valA === null || valA === undefined)
                return 1;
            if (valB === null || valB === undefined)
                return -1;
            var numA = Number(valA);
            var numB = Number(valB);
            if (!isNaN(numA) && !isNaN(numB)) {
                return direction === 'asc' ? numA - numB : numB - numA;
            }
            var strA = String(valA).toLowerCase();
            var strB = String(valB).toLowerCase();
            if (strA < strB)
                return direction === 'asc' ? -1 : 1;
            if (strA > strB)
                return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return this;
    };
    Table.fromCross = function (rowHeader, columnHeaders, rows, options) {
        if (options === void 0) { options = {}; }
        var table = new Table(__assign(__assign({}, options), { columns: __spreadArray([
                { name: rowHeader, key: rowHeader }
            ], columnHeaders.map(function (header) { return ({ name: String(header), key: String(header) }); }), true) }));
        rows.forEach(function (row) {
            var _a;
            table.addRow(__assign((_a = {}, _a[rowHeader] = row.label, _a), row.values));
        });
        return table;
    };
    Table.prototype.addTree = function (labelColumn, nodes, indentSize) {
        var _this = this;
        if (indentSize === void 0) { indentSize = 2; }
        var processNode = function (node, depth) {
            var rowData = __assign({}, node);
            delete rowData.children;
            // Indent label
            if (rowData[labelColumn]) {
                var prefix = depth > 0 ? ' '.repeat((depth - 1) * indentSize) + '├─ ' : '';
                rowData[labelColumn] = prefix + rowData[labelColumn];
            }
            _this.addRow(rowData);
            if (node.children) {
                node.children.forEach(function (child) {
                    processNode(child, depth + 1);
                });
            }
        };
        nodes.forEach(function (node) { return processNode(node, 0); });
    };
    Table.prototype.mergeAdjacent = function (columns) {
        var _this = this;
        var colIndices = columns
            ? columns.map(function (name) { return _this.columns.findIndex(function (c) { return c.name === name || c.key === name; }); }).filter(function (i) { return i >= 0; })
            : this.columns.map(function (_, i) { return i; });
        if (colIndices.length === 0)
            return;
        colIndices.forEach(function (colIndex) {
            var _a;
            var lastCell = (_a = _this.rows[0]) === null || _a === void 0 ? void 0 : _a.cells[colIndex];
            for (var i = 1; i < _this.rows.length; i++) {
                var currentCell = _this.rows[i].cells[colIndex];
                if (lastCell && currentCell && lastCell.content === currentCell.content) {
                    lastCell.rowSpan = (lastCell.rowSpan || 1) + 1;
                    currentCell.merged = true;
                }
                else {
                    lastCell = currentCell;
                }
            }
        });
    };
    return Table;
}());
exports.Table = Table;
