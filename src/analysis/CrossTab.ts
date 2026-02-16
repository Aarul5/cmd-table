import { Table } from '../Table';

export interface ICrossTabOptions {
    rowKey: string;
    colKey: string;
    valueKey: string;
    aggregator?: 'sum' | 'count' | 'first' | 'last' | ((values: any[]) => any);
    missingValue?: any;
}

export class CrossTab {
    public static create(data: any[], options: ICrossTabOptions): Table {
        const { rowKey, colKey, valueKey, aggregator = 'sum', missingValue = '-' } = options;
        const table = new Table();

        // 1. Identify Unique Rows and Columns
        const rows = new Set<string>();
        const cols = new Set<string>();
        data.forEach(item => {
            rows.add(String(item[rowKey]));
            cols.add(String(item[colKey]));
        });

        const sortedRows = Array.from(rows).sort();
        const sortedCols = Array.from(cols).sort();

        // 2. Setup Table Structure
        table.addColumn(rowKey); // First column is the row header
        sortedCols.forEach(col => table.addColumn(col));

        // 3. Build Data Matrix
        sortedRows.forEach(r => {
            const rowData: Record<string, any> = { [rowKey]: r };

            sortedCols.forEach(c => {
                // Find matching items
                const matches = data.filter(item =>
                    String(item[rowKey]) === r && String(item[colKey]) === c
                );

                if (matches.length === 0) {
                    rowData[c] = missingValue;
                } else {
                    const values = matches.map(m => m[valueKey]);
                    let result;
                    if (typeof aggregator === 'function') {
                        result = aggregator(values);
                    } else if (aggregator === 'count') {
                        result = values.length;
                    } else if (aggregator === 'first') {
                        result = values[0];
                    } else if (aggregator === 'last') {
                        result = values[values.length - 1];
                    } else {
                        // Sum
                        result = values.reduce((sum, v) => sum + (Number(v) || 0), 0);
                    }
                    rowData[c] = result;
                }
            });

            table.addRow(rowData);
        });

        return table;
    }
}
