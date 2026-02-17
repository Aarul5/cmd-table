"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var Cell = /** @class */ (function () {
    function Cell(content) {
        this.colSpan = 1;
        this.rowSpan = 1;
        this.merged = false;
        if (typeof content === 'object' && content !== null && 'content' in content) {
            this.content = content.content;
            this.colSpan = content.colSpan || 1;
            this.rowSpan = content.rowSpan || 1;
            this.align = content.align;
            this.vAlign = content.vAlign;
        }
        else {
            this.content = content;
        }
    }
    Cell.prototype.getString = function () {
        return this.content === undefined || this.content === null ? '' : String(this.content);
    };
    return Cell;
}());
exports.Cell = Cell;
