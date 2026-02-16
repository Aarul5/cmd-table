import { Column, IColumnOptions } from './Column';
import { Row } from './Row';
import { StringRenderer } from './renderers/StringRenderer';
import { CsvRenderer, CsvOptions } from './renderers/CsvRenderer';
import { JsonRenderer } from './renderers/JsonRenderer';
import { HtmlRenderer } from './renderers/HtmlRenderer';
import { MarkdownRenderer } from './renderers/MarkdownRenderer';
import { ITheme, THEME_DEFAULT, THEME_Rounded } from './themes/Theme';



export interface TreeNode {
    [key: string]: any;
    children?: TreeNode[];
}

export interface ITableOptions {
    columns?: IColumnOptions[];
    theme?: ITheme;
    compact?: boolean;
    terminalWidth?: number;
    responsiveMode?: 'hide' | 'stack' | 'none';
    zebra?: boolean;
    headerGroups?: Array<{ title: string; colSpan: number }>;
    headerColor?: string;
}

export class Table {
    public columns: Column[] = [];
    public rows: Row[] = [];
    public theme: ITheme;
    public compact: boolean = false;
    public terminalWidth?: number;
    public responsiveMode: 'hide' | 'stack' | 'none' = 'none';
    public zebra: boolean = false;
    public headerGroups: Array<{ title: string; colSpan: number }> = [];
    public footer?: Record<string, any> | any[];
    public headerColor?: string;

    constructor(options: ITableOptions = {}) {
        this.theme = options.theme || THEME_Rounded;
        this.compact = Boolean(options.compact);
        this.terminalWidth = options.terminalWidth;
        this.responsiveMode = options.responsiveMode || 'none';
        this.zebra = Boolean(options.zebra);
        this.headerGroups = options.headerGroups || [];
        this.headerColor = options.headerColor || 'magenta'; // Default magenta header
        if (options.columns) {
            options.columns.forEach((col) => this.addColumn(col));
        }
    }

    public addColumn(options: IColumnOptions | string): Column {
        const colOptions = typeof options === 'string' ? { name: options, key: options } : options;

        // Auto-style first column as cyan if no color specified
        if (this.columns.length === 0 && colOptions.color === undefined) {
            colOptions.color = 'cyan';
        }

        const col = new Column(colOptions);
        this.columns.push(col);
        return col;
    }

    public setColumns(columns: Array<IColumnOptions | string>): this {
        this.columns = [];
        columns.forEach((column) => this.addColumn(column));
        return this;
    }

    public addRow(data: any[] | Record<string, any>): Row {
        const row = new Row(data, this);
        this.rows.push(row);
        return row;
    }

    public addRows(rows: Array<any[] | Record<string, any>>): this {
        rows.forEach((row) => this.addRow(row));
        return this;
    }

    public setFooter(footer: Record<string, any> | any[]): this {
        this.footer = footer;
        return this;
    }

    public summarize(columns: string[], op: 'sum' | 'avg' | 'count' = 'sum'): this {
        const footer: Record<string, any> = this.footer && !Array.isArray(this.footer) ? { ...this.footer } : {};
        columns.forEach((name) => {
            const colIndex = this.columns.findIndex((c) => c.name === name || c.key === name);
            if (colIndex < 0) return;
            const values = this.rows
                .map((row) => Number(row.cells[colIndex]?.content))
                .filter((value) => Number.isFinite(value));
            if (op === 'count') footer[name] = values.length;
            else if (op === 'avg') footer[name] = values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0;
            else footer[name] = values.reduce((a, b) => a + b, 0);
        });
        this.footer = footer;
        return this;
    }

    public paginate(page: number, pageSize: number): Table {
        const start = Math.max(0, (page - 1) * pageSize);
        const end = start + pageSize;
        const next = new Table({
            theme: this.theme,
            compact: this.compact,
            terminalWidth: this.terminalWidth,
            responsiveMode: this.responsiveMode,
            zebra: this.zebra,
            headerGroups: this.headerGroups,
            columns: this.columns.map((column) => ({ ...column }))
        });
        next.rows = this.rows.slice(start, end);
        next.footer = this.footer;
        return next;
    }

    public render(): string {
        const renderer = new StringRenderer();
        return renderer.render(this);
    }

    public getPages(pageSize: number): Table[] {
        const pages: Table[] = [];
        const totalPages = Math.ceil(this.rows.length / pageSize);
        for (let i = 1; i <= totalPages; i++) {
            pages.push(this.paginate(i, pageSize));
        }
        return pages;
    }

    public export(format: 'csv' | 'json' | 'html' | 'md' | 'markdown', options: any = {}): string {
        switch (format) {
            case 'csv':
                return new CsvRenderer(options as CsvOptions).render(this);
            case 'json':
                return new JsonRenderer().render(this);
            case 'html':
                return new HtmlRenderer().render(this);
            case 'md':
            case 'markdown':
                return new MarkdownRenderer().render(this);
            default:
                throw new Error(`Unknown export format: ${format}`);
        }
    }

    public static fromVertical(record: Record<string, any>, options: ITableOptions = {}): Table {
        const table = new Table({ ...options, columns: [{ name: 'Key', key: 'key' }, { name: 'Value', key: 'value' }] });
        Object.entries(record).forEach(([key, value]) => table.addRow({ key, value }));
        return table;
    }

    public sort(columnName: string, direction: 'asc' | 'desc' = 'asc'): this {
        const colIndex = this.columns.findIndex((c) => c.name === columnName || c.key === columnName);
        if (colIndex === -1) return this;

        this.rows.sort((a, b) => {
            const cellA = a.cells[colIndex];
            const cellB = b.cells[colIndex];
            const valA = cellA ? cellA.content : '';
            const valB = cellB ? cellB.content : '';

            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            const numA = Number(valA);
            const numB = Number(valB);

            if (!isNaN(numA) && !isNaN(numB)) {
                return direction === 'asc' ? numA - numB : numB - numA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();

            if (strA < strB) return direction === 'asc' ? -1 : 1;
            if (strA > strB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return this;
    }

    public static fromCross<T extends string | number>(
        rowHeader: string,
        columnHeaders: T[],
        rows: Array<{ label: string; values: Record<string, any> }>,
        options: ITableOptions = {}
    ): Table {
        const table = new Table({
            ...options,
            columns: [
                { name: rowHeader, key: rowHeader },
                ...columnHeaders.map((header) => ({ name: String(header), key: String(header) }))
            ]
        });

        rows.forEach((row) => {
            table.addRow({
                [rowHeader]: row.label,
                ...row.values
            });
        });

        return table;
    }

    public addTree(labelColumn: string, nodes: TreeNode[], indentSize: number = 2): void {
        const processNode = (node: TreeNode, depth: number) => {
            const rowData = { ...node };
            delete rowData.children;

            // Indent label
            if (rowData[labelColumn]) {
                const prefix = depth > 0 ? ' '.repeat((depth - 1) * indentSize) + '├─ ' : '';
                rowData[labelColumn] = prefix + rowData[labelColumn];
            }

            this.addRow(rowData);

            if (node.children) {
                node.children.forEach((child) => {
                    processNode(child, depth + 1);
                });
            }
        };

        nodes.forEach((node) => processNode(node, 0));
    }

    public mergeAdjacent(columns?: string[]): void {
        const colIndices = columns
            ? columns.map((name) => this.columns.findIndex((c) => c.name === name || c.key === name)).filter((i) => i >= 0)
            : this.columns.map((_, i) => i);

        if (colIndices.length === 0) return;

        colIndices.forEach((colIndex) => {
            let lastCell = this.rows[0]?.cells[colIndex];

            for (let i = 1; i < this.rows.length; i++) {
                const currentCell = this.rows[i].cells[colIndex];

                if (lastCell && currentCell && lastCell.content === currentCell.content) {
                    lastCell.rowSpan = (lastCell.rowSpan || 1) + 1;
                    currentCell.merged = true;
                } else {
                    lastCell = currentCell;
                }
            }
        });
    }
}
