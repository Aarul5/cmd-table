import { Table } from '../Table';
import { CsvOptions } from '../renderers/CsvRenderer';

export class CsvTable {
    /**
     * Convert a Table to a CSV string.
     * @param table The table instance to export.
     * @param options CSV formatting options (delimiter, quote).
     */
    public static toCsv(table: Table, options?: CsvOptions): string {
        return table.export('csv', options);
    }
}
