import { Cell } from './Cell';
import { Table } from './Table';

export class Row {
    public cells: Cell[] = [];
    private table: Table;

    constructor(data: any[] | Record<string, any>, table: Table) {
        this.table = table;
        this.parseData(data);
    }

    private parseData(data: any[] | Record<string, any>) {
        if (Array.isArray(data)) {
            data.forEach((val) => this.cells.push(new Cell(val)));
            return;
        }

        if (this.table.columns.length === 0) {
            Object.keys(data).forEach((key) => this.table.addColumn({ name: key, key }));
        }

        this.table.columns.forEach((column) => {
            this.cells.push(new Cell(data[column.key]));
        });
    }
}
