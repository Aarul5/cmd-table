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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILTIN_THEMES = exports.THEME_Dots = exports.THEME_BoldBox = exports.THEME_DoubleLine = exports.THEME_Rounded = exports.THEME_Void = exports.THEME_Ramac = exports.THEME_Norc = exports.THEME_Honeywell = exports.THEME_DEFAULT = void 0;
exports.getTheme = getTheme;
exports.THEME_DEFAULT = {
    topBody: '-', topJoin: '+', topLeft: '+', topRight: '+',
    bottomBody: '-', bottomJoin: '+', bottomLeft: '+', bottomRight: '+',
    bodyLeft: '|', bodyRight: '|', bodyJoin: '|',
    joinBody: '-', joinLeft: '+', joinRight: '+', joinJoin: '+'
};
exports.THEME_Honeywell = {
    topBody: '═', topJoin: '╤', topLeft: '╔', topRight: '╗',
    bottomBody: '═', bottomJoin: '╧', bottomLeft: '╚', bottomRight: '╝',
    bodyLeft: '║', bodyRight: '║', bodyJoin: '│',
    joinBody: '─', joinLeft: '╟', joinRight: '╢', joinJoin: '┼'
};
exports.THEME_Norc = {
    topBody: '─', topJoin: '┬', topLeft: '┌', topRight: '┐',
    bottomBody: '─', bottomJoin: '┴', bottomLeft: '└', bottomRight: '┘',
    bodyLeft: '│', bodyRight: '│', bodyJoin: '│',
    joinBody: '─', joinLeft: '├', joinRight: '┤', joinJoin: '┼'
};
exports.THEME_Ramac = {
    topBody: '━', topJoin: '┳', topLeft: '┏', topRight: '┓',
    bottomBody: '━', bottomJoin: '┻', bottomLeft: '┗', bottomRight: '┛',
    bodyLeft: '┃', bodyRight: '┃', bodyJoin: '│',
    joinBody: '─', joinLeft: '┣', joinRight: '┫', joinJoin: '╋'
};
exports.THEME_Void = {
    topBody: '', topJoin: '', topLeft: '', topRight: '',
    bottomBody: '', bottomJoin: '', bottomLeft: '', bottomRight: '',
    bodyLeft: '', bodyRight: '', bodyJoin: '  ',
    joinBody: '', joinLeft: '', joinRight: '', joinJoin: ''
};
exports.THEME_Rounded = {
    topBody: '─', topJoin: '┬', topLeft: '╭', topRight: '╮',
    bottomBody: '─', bottomJoin: '┴', bottomLeft: '╰', bottomRight: '╯',
    bodyLeft: '│', bodyRight: '│', bodyJoin: '│',
    joinBody: '─', joinLeft: '├', joinRight: '┤', joinJoin: '┼'
};
exports.THEME_DoubleLine = {
    topBody: '═', topJoin: '╦', topLeft: '╔', topRight: '╗',
    bottomBody: '═', bottomJoin: '╩', bottomLeft: '╚', bottomRight: '╝',
    bodyLeft: '║', bodyRight: '║', bodyJoin: '║',
    joinBody: '═', joinLeft: '╠', joinRight: '╣', joinJoin: '╬'
};
exports.THEME_BoldBox = {
    topBody: '━', topJoin: '┳', topLeft: '┏', topRight: '┓',
    bottomBody: '━', bottomJoin: '┻', bottomLeft: '┗', bottomRight: '┛',
    bodyLeft: '┃', bodyRight: '┃', bodyJoin: '┃',
    joinBody: '━', joinLeft: '┣', joinRight: '┫', joinJoin: '╋'
};
exports.THEME_Dots = {
    topBody: '·', topJoin: '·', topLeft: '·', topRight: '·',
    bottomBody: '·', bottomJoin: '·', bottomLeft: '·', bottomRight: '·',
    bodyLeft: ':', bodyRight: ':', bodyJoin: ':',
    joinBody: '·', joinLeft: ':', joinRight: ':', joinJoin: ':'
};
exports.BUILTIN_THEMES = {
    default: exports.THEME_DEFAULT,
    honeywell: exports.THEME_Honeywell,
    norc: exports.THEME_Norc,
    ramac: exports.THEME_Ramac,
    void: exports.THEME_Void,
    rounded: exports.THEME_Rounded,
    doubleLine: exports.THEME_DoubleLine,
    boldBox: exports.THEME_BoldBox,
    dots: exports.THEME_Dots,
    doubleHeader: __assign(__assign({}, exports.THEME_DEFAULT), { topBody: '═', topJoin: '╤', topLeft: '╒', topRight: '╕', joinBody: '═', joinLeft: '╞', joinRight: '╡', joinJoin: '╪' }),
    thinRounded: exports.THEME_Rounded
};
function getTheme(name) {
    return exports.BUILTIN_THEMES[name];
}
