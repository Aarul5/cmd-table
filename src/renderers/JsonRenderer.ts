import { IRenderer } from './IRenderer';
import { Table } from '../Table';

export class JsonRenderer implements IRenderer {
    public render(table: Table): string {
        const visibleColumns = table.columns.map((column, index) => ({ column, index })).filter((item) => !item.column.hidden);
        const data = table.rows.map((row) => {
            const obj: Record<string, any> = {};
            visibleColumns.forEach(({ column, index }) => {
                obj[column.key || column.name] = row.cells[index]?.content;
            });
            return obj;
        });
        return JSON.stringify(data, null, 2);
    }
}
