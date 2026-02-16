export interface ITheme {
    topBody: string;
    topJoin: string;
    topLeft: string;
    topRight: string;

    bottomBody: string;
    bottomJoin: string;
    bottomLeft: string;
    bottomRight: string;

    bodyLeft: string;
    bodyRight: string;
    bodyJoin: string;

    joinBody: string;
    joinLeft: string;
    joinRight: string;
    joinJoin: string;

    headerJoin?: string;
}

export const THEME_DEFAULT: ITheme = {
    topBody: '-', topJoin: '+', topLeft: '+', topRight: '+',
    bottomBody: '-', bottomJoin: '+', bottomLeft: '+', bottomRight: '+',
    bodyLeft: '|', bodyRight: '|', bodyJoin: '|',
    joinBody: '-', joinLeft: '+', joinRight: '+', joinJoin: '+'
};

export const THEME_Honeywell: ITheme = {
    topBody: '═', topJoin: '╤', topLeft: '╔', topRight: '╗',
    bottomBody: '═', bottomJoin: '╧', bottomLeft: '╚', bottomRight: '╝',
    bodyLeft: '║', bodyRight: '║', bodyJoin: '│',
    joinBody: '─', joinLeft: '╟', joinRight: '╢', joinJoin: '┼'
};

export const THEME_Norc: ITheme = {
    topBody: '─', topJoin: '┬', topLeft: '┌', topRight: '┐',
    bottomBody: '─', bottomJoin: '┴', bottomLeft: '└', bottomRight: '┘',
    bodyLeft: '│', bodyRight: '│', bodyJoin: '│',
    joinBody: '─', joinLeft: '├', joinRight: '┤', joinJoin: '┼'
};

export const THEME_Ramac: ITheme = {
    topBody: '━', topJoin: '┳', topLeft: '┏', topRight: '┓',
    bottomBody: '━', bottomJoin: '┻', bottomLeft: '┗', bottomRight: '┛',
    bodyLeft: '┃', bodyRight: '┃', bodyJoin: '│',
    joinBody: '─', joinLeft: '┣', joinRight: '┫', joinJoin: '╋'
};

export const THEME_Void: ITheme = {
    topBody: '', topJoin: '', topLeft: '', topRight: '',
    bottomBody: '', bottomJoin: '', bottomLeft: '', bottomRight: '',
    bodyLeft: '', bodyRight: '', bodyJoin: '  ',
    joinBody: '', joinLeft: '', joinRight: '', joinJoin: ''
};

export const THEME_Rounded: ITheme = {
    topBody: '─', topJoin: '┬', topLeft: '╭', topRight: '╮',
    bottomBody: '─', bottomJoin: '┴', bottomLeft: '╰', bottomRight: '╯',
    bodyLeft: '│', bodyRight: '│', bodyJoin: '│',
    joinBody: '─', joinLeft: '├', joinRight: '┤', joinJoin: '┼'
};

export const THEME_DoubleLine: ITheme = {
    topBody: '═', topJoin: '╦', topLeft: '╔', topRight: '╗',
    bottomBody: '═', bottomJoin: '╩', bottomLeft: '╚', bottomRight: '╝',
    bodyLeft: '║', bodyRight: '║', bodyJoin: '║',
    joinBody: '═', joinLeft: '╠', joinRight: '╣', joinJoin: '╬'
};

export const THEME_BoldBox: ITheme = {
    topBody: '━', topJoin: '┳', topLeft: '┏', topRight: '┓',
    bottomBody: '━', bottomJoin: '┻', bottomLeft: '┗', bottomRight: '┛',
    bodyLeft: '┃', bodyRight: '┃', bodyJoin: '┃',
    joinBody: '━', joinLeft: '┣', joinRight: '┫', joinJoin: '╋'
};

export const THEME_Dots: ITheme = {
    topBody: '·', topJoin: '·', topLeft: '·', topRight: '·',
    bottomBody: '·', bottomJoin: '·', bottomLeft: '·', bottomRight: '·',
    bodyLeft: ':', bodyRight: ':', bodyJoin: ':',
    joinBody: '·', joinLeft: ':', joinRight: ':', joinJoin: ':'
};

export const BUILTIN_THEMES = {
    default: THEME_DEFAULT,
    honeywell: THEME_Honeywell,
    norc: THEME_Norc,
    ramac: THEME_Ramac,
    void: THEME_Void,
    rounded: THEME_Rounded,
    doubleLine: THEME_DoubleLine,
    boldBox: THEME_BoldBox,
    dots: THEME_Dots,
    doubleHeader: {
        ...THEME_DEFAULT,
        topBody: '═', topJoin: '╤', topLeft: '╒', topRight: '╕',
        joinBody: '═', joinLeft: '╞', joinRight: '╡', joinJoin: '╪'
    },
    thinRounded: THEME_Rounded
} as const satisfies Record<string, ITheme>;

export type ThemeName = keyof typeof BUILTIN_THEMES;

export function getTheme(name: ThemeName): ITheme {
    return BUILTIN_THEMES[name];
}
