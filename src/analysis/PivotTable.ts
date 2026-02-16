import { Table } from '../Table';
import { Aggregations } from './Aggregations';

export interface IPivotOptions {
    groupBy: string; // Column to group rows by
    pivot?: string; // Column to pivot into headers (optional)
    algorithm?: 'sum' | 'avg' | 'min' | 'max' | 'count' | ((values: any[]) => any);
    targetColumn?: string; // Column to aggregate (required if algorithm is not count)
    onError?: (err: any) => any;
}

export class PivotTable {
    public static create(data: any[], options: IPivotOptions): Table {
        const { groupBy, pivot, algorithm = 'count', targetColumn, onError } = options;
        const table = new Table();

        try {
            // 1. Group Data
            const groups: Record<string, any[]> = {};
            data.forEach(row => {
                const key = String(row[groupBy]);
                if (!groups[key]) groups[key] = [];
                groups[key].push(row);
            });

            // 2. Identify Pivot Columns (if any)
            let pivotKeys: string[] = ['Value'];
            if (pivot) {
                const allPivotValues = new Set<string>();
                data.forEach(row => allPivotValues.add(String(row[pivot])));
                pivotKeys = Array.from(allPivotValues).sort();
            }

            // 3. Setup Table Columns
            table.addColumn(groupBy);
            pivotKeys.forEach(key => table.addColumn(key));

            // 4. Process Groups
            Object.entries(groups).forEach(([groupKey, rows]) => {
                const rowData: Record<string, any> = { [groupBy]: groupKey };

                pivotKeys.forEach(pivotKey => {
                    // Filter rows for this pivot cell
                    const cellRows = pivot
                        ? rows.filter(r => String(r[pivot]) === pivotKey)
                        : rows;

                    // Extract values to aggregate
                    const values = targetColumn
                        ? cellRows.map(r => r[targetColumn])
                        : cellRows; // If no target, pass whole objects (for count)

                    // Execute Algorithm
                    let result;
                    if (typeof algorithm === 'function') {
                        result = algorithm(values);
                    } else if (algorithm === 'count') {
                        result = values.length;
                    } else {
                        // Numeric aggregations
                        const nums = values.map(v => Number(v)).filter(n => !isNaN(n));
                        // @ts-ignore
                        result = Aggregations[algorithm](nums);
                    }

                    rowData[pivotKey] = result;
                });

                table.addRow(rowData);
            });

        } catch (error) {
            if (onError) onError(error);
            else throw error;
        }

        return table;
    }
}
