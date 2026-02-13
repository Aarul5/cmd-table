import { Table } from '../Table';

export interface IRenderer {
    render(table: Table): string;
}
