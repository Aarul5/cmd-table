import { Table } from 'cmd-table';
import type { TableRenderOptions } from './types.js';

export function renderTable(
  data: Record<string, unknown>[],
  options: TableRenderOptions = {},
): string {
  if (data.length === 0) return '';

  const keys = options.columns ?? Object.keys(data[0]);

  let rows = data;
  if (options.filter) {
    const term = options.filter.toLowerCase();
    rows = rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(term)),
    );
  }
  if (options.sort) {
    const key = options.sort;
    rows = [...rows].sort((a, b) => String(a[key] ?? '').localeCompare(String(b[key] ?? '')));
  }

  const table = new Table();
  for (const key of keys) {
    table.addColumn({ name: key, key });
  }
  for (const row of rows) {
    const cells: Record<string, string> = {};
    for (const key of keys) {
      cells[key] = String(row[key] ?? '');
    }
    table.addRow(cells);
  }

  switch (options.output) {
    case 'csv':
      return table.export('csv');
    case 'json':
      return table.export('json');
    case 'md':
      return table.export('md');
    default:
      return table.render();
  }
}
