"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
var Column = /** @class */ (function () {
    function Column(options) {
        if (options === void 0) { options = {}; }
        this.minWidth = 1;
        this.align = 'left';
        this.vAlign = 'top';
        this.paddingLeft = 1;
        this.paddingRight = 1;
        this.truncate = '...';
        this.wrapWord = true;
        this.priority = 100;
        this.hidden = false;
        this.name = options.name || '';
        this.key = options.key || this.name;
        this.width = options.width;
        if (options.minWidth !== undefined)
            this.minWidth = options.minWidth;
        if (options.maxWidth !== undefined)
            this.maxWidth = options.maxWidth;
        if (options.align)
            this.align = options.align;
        if (options.vAlign)
            this.vAlign = options.vAlign;
        if (options.paddingLeft !== undefined)
            this.paddingLeft = options.paddingLeft;
        if (options.paddingRight !== undefined)
            this.paddingRight = options.paddingRight;
        if (options.truncate !== undefined)
            this.truncate = options.truncate;
        if (options.wrapWord !== undefined)
            this.wrapWord = options.wrapWord;
        if (options.priority !== undefined)
            this.priority = options.priority;
        if (options.hidden !== undefined)
            this.hidden = options.hidden;
        if (options.color !== undefined)
            this.color = options.color;
    }
    return Column;
}());
exports.Column = Column;
