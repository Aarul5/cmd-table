import { Table } from '../Table';

export class JsonTable {
    /**
     * Convert a Table to a JSON string.
     * @param table The table instance to export.
     */
    public static toJson(table: Table): string {
        return table.export('json');
    }
}
