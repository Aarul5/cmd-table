export interface ICellOptions {
    content: any;
    colSpan?: number;
    rowSpan?: number;
    align?: 'left' | 'center' | 'right';
    vAlign?: 'top' | 'center' | 'bottom';
}

export class Cell {
    public content: any;
    public colSpan: number = 1;
    public rowSpan: number = 1;
    public merged: boolean = false;
    public align?: 'left' | 'center' | 'right';
    public vAlign?: 'top' | 'center' | 'bottom';

    constructor(content: any | ICellOptions) {
        if (typeof content === 'object' && content !== null && 'content' in content) {
            this.content = content.content;
            this.colSpan = content.colSpan || 1;
            this.rowSpan = content.rowSpan || 1;
            this.align = content.align;
            this.vAlign = content.vAlign;
        } else {
            this.content = content;
        }
    }

    public getString(): string {
        return this.content === undefined || this.content === null ? '' : String(this.content);
    }
}
