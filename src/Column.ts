export type ContentAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'center' | 'bottom';

export interface IColumnOptions {
    name?: string;
    key?: string;
    width?: number; // Fixed width
    minWidth?: number;
    maxWidth?: number;
    align?: ContentAlign;
    vAlign?: VerticalAlign;
    paddingLeft?: number;
    paddingRight?: number;
    truncate?: string; // String to append on truncation (e.g. "...")
    wrapWord?: boolean;
    priority?: number; // lower value = more important during responsive trimming
    hidden?: boolean;
    color?: string; // Color name (e.g. 'red', 'bold')
}

export class Column {
    public name: string;
    public key: string;
    public width?: number;
    public minWidth: number = 1;
    public maxWidth?: number;
    public align: ContentAlign = 'left';
    public vAlign: VerticalAlign = 'top';
    public paddingLeft: number = 1;
    public paddingRight: number = 1;
    public truncate: string = '...';
    public wrapWord: boolean = true;
    public priority: number = 100;
    public hidden: boolean = false;
    public color?: string;

    constructor(options: IColumnOptions = {}) {
        this.name = options.name || '';
        this.key = options.key || this.name;
        this.width = options.width;
        if (options.minWidth !== undefined) this.minWidth = options.minWidth;
        if (options.maxWidth !== undefined) this.maxWidth = options.maxWidth;
        if (options.align) this.align = options.align;
        if (options.vAlign) this.vAlign = options.vAlign;
        if (options.paddingLeft !== undefined) this.paddingLeft = options.paddingLeft;
        if (options.paddingRight !== undefined) this.paddingRight = options.paddingRight;
        if (options.truncate !== undefined) this.truncate = options.truncate;
        if (options.wrapWord !== undefined) this.wrapWord = options.wrapWord;
        if (options.priority !== undefined) this.priority = options.priority;
        if (options.hidden !== undefined) this.hidden = options.hidden;
        if (options.color !== undefined) this.color = options.color;
    }
}

export type Action<T> = (item: T) => void;
