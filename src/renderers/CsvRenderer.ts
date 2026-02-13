import { IRenderer } from './IRenderer';
import { Table } from '../Table';

export interface CsvOptions {
    delimiter?: string;
    quote?: string;
    includeHeader?: boolean;
}

export class CsvRenderer implements IRenderer {
    private delimiter: string;
    private quote: string;
    private includeHeader: boolean;

    constructor(options: CsvOptions = {}) {
        this.delimiter = options.delimiter || ',';
        this.quote = options.quote || '"';
        this.includeHeader = options.includeHeader !== false;
    }

    public render(table: Table): string {
        const visibleIndices = table.columns.map((column, index) => ({ column, index })).filter((item) => !item.column.hidden);
        const rows: string[] = [];
        if (this.includeHeader) {
            rows.push(this.drawRow(visibleIndices.map((item) => item.column.name)));
        }
        rows.push(
            ...table.rows.map((row) => this.drawRow(visibleIndices.map((item) => row.cells[item.index]?.getString() ?? '')))
        );
        return rows.join('\n');
    }

    private drawRow(values: string[]): string {
        return values.map((value) => this.escape(value)).join(this.delimiter);
    }

    private escape(value: string): string {
        if (value.includes(this.delimiter) || value.includes(this.quote) || value.includes('\n')) {
            return this.quote + value.replace(new RegExp(this.quote, 'g'), this.quote + this.quote) + this.quote;
        }
        return value;
    }
}
