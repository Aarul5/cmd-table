"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
var Cell_1 = require("./Cell");
var Row = /** @class */ (function () {
    function Row(data, table) {
        this.cells = [];
        this.table = table;
        this.originalData = data;
        this.parseData(data);
    }
    Row.prototype.getData = function () {
        return this.originalData;
    };
    Row.prototype.parseData = function (data) {
        var _this = this;
        if (Array.isArray(data)) {
            data.forEach(function (val) { return _this.cells.push(new Cell_1.Cell(val)); });
            return;
        }
        if (this.table.columns.length === 0) {
            Object.keys(data).forEach(function (key) { return _this.table.addColumn({ name: key, key: key }); });
        }
        this.table.columns.forEach(function (column) {
            _this.cells.push(new Cell_1.Cell(data[column.key]));
        });
    };
    return Row;
}());
exports.Row = Row;
