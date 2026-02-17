import { Table } from '../Table';
import { CsvOptions } from '../renderers/CsvRenderer';

export interface CsvParseOptions {
    hasHeader?: boolean;
    delimiter?: string;
}

export class CsvTable {
    /**
     * Parse a CSV string into a Table.
     * @param csvString Raw CSV content.
     * @param options Parsing options.
     */
    public static from(csvString: string, options: CsvParseOptions = {}): Table {
        const { hasHeader = true, delimiter = ',' } = options;
        const lines = csvString.trim().split(/\r?\n/).filter(l => l.trim() !== '');

        if (lines.length === 0) {
            return new Table();
        }

        const parseLine = (line: string): string[] => {
            const result: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++; // Skip escaped quote
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === delimiter && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
            result.push(current.trim());
            return result;
        };

        const table = new Table();
        let headers: string[];
        let dataStartIndex: number;

        if (hasHeader) {
            headers = parseLine(lines[0]);
            dataStartIndex = 1;
        } else {
            // Generate column headers: Col1, Col2, ...
            const firstRow = parseLine(lines[0]);
            headers = firstRow.map((_, i) => `Col${i + 1}`);
            dataStartIndex = 0;
        }

        headers.forEach(h => table.addColumn(h));

        for (let i = dataStartIndex; i < lines.length; i++) {
            const values = parseLine(lines[i]);
            const row: Record<string, string> = {};
            headers.forEach((h, j) => {
                row[h] = values[j] !== undefined ? values[j] : '';
            });
            table.addRow(row);
        }

        return table;
    }

    /**
     * Convert a Table to a CSV string.
     * @param table The table instance to export.
     * @param options CSV formatting options (delimiter, quote).
     */
    public static toCsv(table: Table, options?: CsvOptions): string {
        return table.export('csv', options);
    }
}
