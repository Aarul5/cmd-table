# cmd-table

[![npm](https://img.shields.io/npm/v/cmd-table)](https://www.npmjs.com/package/cmd-table) [![license](https://img.shields.io/npm/l/cmd-table)](https://github.com/Aarul5/cmd-table/blob/main/LICENSE) [![CI](https://github.com/Aarul5/cmd-table/actions/workflows/ci.yml/badge.svg)](https://github.com/Aarul5/cmd-table/actions/workflows/ci.yml) [![downloads](https://img.shields.io/npm/dm/cmd-table)](https://www.npmjs.com/package/cmd-table) [![Documentation](https://img.shields.io/badge/documentation-live-brightgreen)](https://aarul5.github.io/cmd-table/)

A modern, feature-rich, and enterprise-grade CLI table library for Node.js.

<p>
  <a href="https://aarul5.github.io/cmd-table/">
    <img src="https://img.shields.io/badge/Read_the_Documentation-8A2BE2?style=for-the-badge&logo=rocket&logoColor=white" alt="Documentation" />
  </a>
</p>

## Features

*   **Standalone & Lightweight**: Nothing extra to install.
*   **Modern Theming**: "Rounded" theme by default, plus `honeywell`, `void`, `double`, `dots`, and more.
*   **Rich Styling**: ANSI color support for headers and columns (defaults to **Magenta** headers and **Cyan** keys).
*   **Advanced Layouts**: `colSpan`, `rowSpan`, auto-sizing, word-wrap, and specific column widths.
*   **Responsive**: Hide or stack columns on smaller screens based on priority.
*   **Interactive TUI**: Built-in interactive mode for exploring large datasets with search, filtering, and row selection.
*   **Data Visualization**:
    *   **Sparklines & Heatmaps**: Visualize trends and data density directly in cells.
    *   **Progress Bars**: Render inline `████░░░░ 65%` progress indicators in any cell.
    *   **Tree View**: Visualize hierarchical data with automatic indentation.
    *   **Auto-Merge**: Automatically vertically merge identical adjacent cells.
    *   **Header Groups**: Spans multiple columns under a super-header.
    *   **Footers & Summaries**: Automatic sum/avg/count or custom footers.
*   **Data Operations**: Built-in column sorting (`asc`/`desc`), aggregation (pivot tables), and **matrix transposing (`transpose()`)**.
*   **Integrations**:
    *   **SQL / SQLite**: Browse database tables with `SqlDataSource` adapter.
    *   **CSV Parser**: Parse CSV strings into tables with `CsvTable.from()`.
    *   **HTML Scraper**: Parse HTML tables directly.
    *   **JSX Support**: Define tables declaratively.
*   **Streaming**: Efficiently render large datasets row-by-row.
*   **Exports**: Export tables to Markdown, CSV, JSON, or HTML.
*   **Per-Column Formatters**: Transform cell values for display via `formatter: (v, rowIndex) => string` — currency, dates, icons, and more.
*   **CLI Tool**: Standalone executable to pipe JSON / CSV data into formatted tables.

## Why cmd-table?

cmd-table is the most feature-rich CLI table library for Node.js — with zero production dependencies. The top alternatives are either stagnant or lack modern features.

| Feature | cmd-table | cli-table3 | table | tty-table |
| :--- | :---: | :---: | :---: | :---: |
| Standalone & lightweight | **Yes** | No | No | No |
| Interactive TUI (search, filter, select) | **Yes** | No | No | No |
| Async pagination (databases, APIs) | **Yes** | No | No | No |
| SQL / SQLite integration | **Yes** | No | No | No |
| Sparklines & Heatmaps | **Yes** | No | No | No |
| Tree view | **Yes** | No | No | No |
| Pivot tables & CrossTabs | **Yes** | No | No | No |
| CSV / HTML parser (built-in) | **Yes** | No | No | No |
| JSX / React syntax | **Yes** | No | No | No |
| Header groups & footers | **Yes** | No | No | No |
| Streaming renderer | **Yes** | No | Yes | No |
| Multiple export formats | **Yes** | No | No | No |
| Auto-merge cells | **Yes** | No | No | No |
| Responsive layouts | **Yes** | No | No | Yes |
| TypeScript-first | **Yes** | Partial | Yes | No |
| Actively maintained (2025) | **Yes** | No | No | Yes |

## Installation

```bash
npm install cmd-table
```

## Basic Usage

The library creates a beautiful "Rounded" table by default.

```ts
import { Table } from 'cmd-table';

const table = new Table();

// First column defaults to 'cyan' color for keys
table.addColumn('Name'); 
table.addColumn('Role');
table.addColumn('Status');

table.addRow({ Name: 'Alice', Role: 'Dev', Status: 'Active' });
table.addRow({ Name: 'Bob', Role: 'PM', Status: 'Offline' });

console.log(table.render());
```

## Interactive Table (TUI)

Build interactive terminal interfaces using `cmd-table`.

Use the built-in `InteractiveTable` class for instant pagination and sorting features without boilerplate. **This is the recommended way to display large datasets.**

```ts
import { Table, InteractiveTable } from 'cmd-table';

const table = new Table();
// ... add hundreds of rows ...

// Advanced Usage: Handle Selection
const interactive = new InteractiveTable(table, {
    onSelect: (rows) => {
        console.log('Selected:', rows);
        process.exit(0);
    },
    onExit: () => process.exit(0)
});

interactive.start();
```

### Interactive Controls

| Key | Action |
| :--- | :--- |
| `Right` / `n` | Next Page |
| `Left` / `p` | Previous Page |
| `s` | Sort by Column (Cycle) |
| `/` | **Search / Filter Rows** |
| `Space` | **Select / Deselect Visible Rows** |
| `Enter` | **Confirm Selection & Exit** |
| `Esc` | Clear Search / Clear Selection |
| `q` / `Ctrl+C` | Quit |

To see it in action:
```bash
npx ts-node examples/interactive_table.ts
npx ts-node examples/large_table.ts
```

### Async Data (Pagination)

For very large datasets (databases, APIs), use `AsyncInteractiveTable` with an `IDataSource`.

```ts
import { AsyncInteractiveTable, IDataSource } from 'cmd-table';

class MyApi implements IDataSource {
    async count() { return 1000; }
    async getRows(offset, limit) { return fetch(`/api/data?skip=${offset}&take=${limit}`); }
}

const app = new AsyncInteractiveTable(new MyApi(), new Table());
app.start();
```

### SQL / SQLite Integration

Browse real database tables interactively using the built-in `SqlDataSource` adapter (requires `better-sqlite3`).

```bash
npm install better-sqlite3
```

```ts
import Database from 'better-sqlite3';
import { Table, AsyncInteractiveTable, SqlDataSource } from 'cmd-table';

const db = new Database('mydata.db');
const source = new SqlDataSource(db, 'employees');

const template = new Table();
template.addColumn('id');
template.addColumn('name');
template.addColumn('department');

const app = new AsyncInteractiveTable(source, template);
await app.start();
db.close();
```

`SqlDataSource` supports pagination, column sorting, and full-text search across all columns.

To run the included demo:
```bash
npx ts-node examples/sqlite_demo.ts
```

## Core Features

### Styling & Themes

Customize colors for headers and specific columns, or check out built-in themes.

```ts
import { Table, THEME_DoubleLine } from 'cmd-table';

const table = new Table({
  theme: THEME_DoubleLine, // Apply theme globally
  headerColor: 'blue', // Override default magenta
});

table.addColumn({ name: 'Error', color: 'red' });
table.addColumn({ name: 'Warning', color: 'yellow' });
```

Available themes: `THEME_Rounded` (Default), `THEME_Honeywell`, `THEME_DoubleLine`, `THEME_BoldBox`, `THEME_Dots`, `THEME_Void`.

### Data Operations (Sorting)

Sort the table by a specific column.

```ts
// Sort by 'Name' in ascending order
table.sort('Name');

// Sort by 'Age' in descending order
table.sort('Age', 'desc');
```

### Pagination

Programmatically paginate your table data.

```ts
// Get all pages at once
const pages = table.getPages(10);
pages.forEach(page => console.log(page.render()));
```

### Exports

Export your table data to various formats using the simplified `export()` method.

```ts
// Markdown, CSV, JSON, HTML
const md = table.export('md');
const csv = table.export('csv');
const json = table.export('json');
```

## Advanced Visualization

### Tree View (Hierarchical Data)

Visualize nested data structures like file systems or org charts.

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addColumn('Name');
table.addColumn('Size');

const files = [
  { Name: 'src', Size: '-', children: [{ Name: 'index.ts', Size: '2KB' }] },
  { Name: 'package.json', Size: '1KB' }
];

table.addTree('Name', files);
console.log(table.render());
```

### Auto-Merge (Grouping)

Automatically merge vertically adjacent cells with the same content.

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addColumn('Department');
table.addColumn('Employee');

table.addRows([
  { Department: 'Engineering', Employee: 'Alice' },
  { Department: 'Engineering', Employee: 'Bob' },
  { Department: 'HR', Employee: 'Charlie' }
]);

// Merges the 'Engineering' cells vertically
table.mergeAdjacent(['Department']);
console.log(table.render());
```

### CrossTab (Matrix View)

Generate a matrix view (e.g., Sales by Product vs Month).

```ts
import { CrossTab } from 'cmd-table';

const matrix = CrossTab.create(salesData, {
    rowKey: 'Product',
    colKey: 'Month',
    valueKey: 'Amount',
    aggregator: 'sum', // or 'count', 'first', 'last', or custom function
    missingValue: 0
});
console.log(matrix.render());
```

### Pivot Tables

Group and aggregate data naturally.

```ts
import { PivotTable } from 'cmd-table';

const pivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: 'sum' // or 'avg', 'min', 'max', 'count', or custom function
});
console.log(pivot.render());
```

### Statistical Aggregations

Use built-in statistical functions for your own analysis.

```ts
import { Aggregations } from 'cmd-table';

const values = [10, 20, 30, 40, 50];
console.log(Aggregations.avg(values)); // 30
console.log(Aggregations.stdDev(values)); // 14.14
console.log(Aggregations.percentile(values, 0.9)); // 90th percentile
```

### Responsive Layouts

Make your tables adapt to different terminal widths.

```ts
const table = new Table({
  // terminalWidth: process.stdout.columns, // Defaults to current terminal width or 80
  responsiveMode: 'hide', // or 'stack'
});

// 'hide': Low priority columns are hidden if they don't fit.
table.addColumn({ name: 'ID', priority: 1 }); // High priority
table.addColumn({ name: 'Description', priority: 0 }); // Low priority
```

### Header Groups & Footers

Group columns or add summaries.

```ts
const table = new Table({
  headerGroups: [
    { title: 'Identity', colSpan: 2 }, // Spans 'Name' and 'Role'
    { title: 'Performance', colSpan: 2 } // Spans 'Score' and 'Grade'
  ]
});

// Automatic Summary (Sum, Avg, Count)
table.summarize(['Cost'], 'sum');
```

### Column & Row Spans

Merge cells horizontally manually.

```ts
table.addRow([
  { content: 'Summary', colSpan: 2 },
  'Status'
]);
```

## Performance (Streaming)

For very large datasets, use the `StreamRenderer` to print rows as they are processed.

```ts
import { Table, StreamRenderer } from 'cmd-table';
const stream = new StreamRenderer(table);
// ... renderHeader, renderRows, renderFooter ...
```

## CLI Tool

Format JSON / CSV data directly from the terminal.

```bash
# Format JSON
cat data.json | npx cmd-table --columns=name,age --theme=double

# Format CSV (Auto-detected)
cat data.csv | npx cmd-table

# Interactive Explorer (TUI)
cat large_data.csv | npx cmd-table --interactive
```

## Direct Access (Power Users)

You are never locked into the "default" way of doing things. You have full access to the table's internal data structures.

```ts
const table = new Table();
// ... add data ...

// 1. Manually Sort Rows (Custom Logic)
table.rows.sort((a, b) => {
    // Access raw cell content directly
    const valA = a.cells[1].content; 
    const valB = b.cells[1].content;
    return valA - valB;
});

// 2. Direct Cell Modification
table.rows.forEach(row => {
    const statusCell = row.cells[2];
    if (statusCell.content === 'FAIL') {
        // Manually wrap content in ANSI red
        statusCell.content = `\x1b[31m${statusCell.content}\x1b[39m`; 
    }
});

// 3. Build Your Own Renderer
const myCustomString = table.rows.map(row => row.cells[0].content).join(' | ');
```

## 🎨 Visual Enhancements

### Sparklines
Render mini bar charts inside cells.
```typescript
import { Sparkline } from 'cmd-table';

table.addRow({
    history: Sparkline.generate([10, 50, 90, 40, 20]) // Output:  ▄█▄▂
});
```

### Heatmaps
Colorize values based on a range (Low=Red, Mid=Yellow, High=Green).
```typescript
import { Heatmap } from 'cmd-table';

table.addRow({
    efficiency: Heatmap.color(85, 0, 100) + '%' // Green text
});
```

### Progress Bars
Render inline Unicode block-character progress bars inside any cell, typically via a column formatter.

```typescript
import { Table, ProgressBar } from 'cmd-table';

const t = new Table();
t.addColumn({ name: 'Module', key: 'module' });
t.addColumn({
    name: 'Coverage',
    key: 'coverage',
    minWidth: 15,
    align: 'right',
    formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 10 }),
});
t.addRow({ module: 'core', coverage: 82 });
t.addRow({ module: 'cli',  coverage: 47 });
console.log(t.render());
// │ core │ ████████░░ 82% │
// │ cli  │ ████░░░░░░ 47% │
```

**`ProgressBar.generate(value, max?, options?)` options:**

| Option | Default | Description |
|--------|---------|-------------|
| `width` | `10` | Bar character width |
| `filled` | `'█'` | Filled character |
| `empty` | `'░'` | Empty character |
| `showPercent` | `true` | Append `65%` label |
| `label` | auto | Override with custom text, e.g. `'3/5'` |

### Per-Column Formatter Callbacks
Transform cell values for display using a `formatter` function.

```typescript
import { Table } from 'cmd-table';

const t = new Table();
t.addColumn({
    name: 'Price', key: 'price',
    minWidth: 10,
    align: 'right',
    formatter: (v) => '$' + Number(v).toFixed(2),
});
t.addColumn({
    name: 'Status', key: 'status',
    formatter: (v) => v === 'ok' ? '✅ OK' : '❌ Fail',
});
t.addRow({ price: 9.5, status: 'ok' });
t.addRow({ price: 99,  status: 'fail' });
console.log(t.render());
```

- `formatter` receives the **raw cell value** as a string and the **zero-based row index**.
- The header row is **never** passed through the formatter.
- Works with `color`, `align`, `wrapWord`, and `maxWidth`.

### Conditional Row Styling
Apply an ANSI color to an entire row dynamically based on the data object.

```typescript
const table = new Table({
    rowColor: (row, index) => {
        if (Number(row.score) >= 90) return 'green';
        if (Number(row.score) >= 70) return 'yellow';
        return 'red';
    }
});
```

- Header row is unaffected.
- Compatible with per-column formatters and `zebra` striping.
- Return `undefined` to leave the row unstyled.

### Advanced Borders
New themes are available:
```typescript
import { BUILTIN_THEMES } from 'cmd-table';

const table = new Table({
    theme: BUILTIN_THEMES.doubleHeader // Double lines for header, single for body
    // or BUILTIN_THEMES.thinRounded
});
```

## 🔌 Integrations

### CSV Parser
Parse CSV strings directly into tables — supports headers, quoted fields, custom delimiters, and CRLF.

```typescript
import { CsvTable } from 'cmd-table';

const csv = 'name,age\nAlice,30\nBob,25';
const table = CsvTable.from(csv);
console.log(table.render());

// Custom delimiter
const tsv = CsvTable.from(tsvData, { delimiter: '\t' });
```

### HTML Scraper
Parse HTML tables directly into `cmd-table`. (Zero-dependency, regex-based).

```typescript
import { HtmlTable } from 'cmd-table';

const html = `<table><tr><td>Data</td></tr></table>`;
const table = HtmlTable.from(html);
console.log(table.render());
```

### Data Exports
Export tables to standard formats using dedicated helpers (symmetric to `from` methods).

```typescript
import { HtmlTable, CsvTable, JsonTable } from 'cmd-table';

// Export to HTML string
const html = HtmlTable.toHtml(table);

// Export to CSV string
const csv = CsvTable.toCsv(table);

// Export to JSON string
const json = JsonTable.toJson(table);
```

### React / JSX Support
Define tables using JSX syntax (works with any JSX runtime or our lightweight factory).

```tsx
import { h, render } from 'cmd-table';

const element = (
    <cmd-table theme="doubleHeader">
        <cmd-column name="Task" key="task" />
        <cmd-row task="Do Chores" />
    </cmd-table>
);

const table = render(element);
console.log(table.render());
```

## Roadmap

### Shipped

| Feature | Version | Status |
| :--- | :--- | :--- |
| Core table rendering with themes | v1.0.0 | Done |
| Interactive TUI (search, filter, select) | v1.0.0 | Done |
| Sparklines & Heatmaps | v1.0.0 | Done |
| Pivot tables & CrossTabs | v1.0.0 | Done |
| HTML scraper & JSX support | v1.0.0 | Done |
| Exports (Markdown, CSV, JSON, HTML) | v1.0.0 | Done |
| Responsive layouts | v1.0.0 | Done |
| Streaming renderer | v1.0.0 | Done |
| Header groups & footers | v1.0.0 | Done |
| Auto-merge cells | v1.0.0 | Done |
| Tree view | v1.0.0 | Done |
| Async Interactive Table & IDataSource | v1.1.0 | Done |
| CLI tool with `--interactive` flag | v1.1.0 | Done |
| SQL / SQLite integration | v1.2.0 | Done |
| CSV parser (`CsvTable.from()`) | v1.2.0 | Done |
| 183 tests, 16 modules at 100% coverage | v1.2.0–v1.3.0 | Done |
| VitePress documentation site | v1.2.2 | Done |
| Per-column formatter callbacks | v1.3.0 | Done |
| Progress bars in cells (`ProgressBar`) | v1.3.0 | Done |
| Conditional row coloring / zebra striping | v1.3.1 | Done |
| Transposed table (`table.transpose()`) | v1.3.1 | Done |

### Planned

| Feature | Priority | Status |
| :--- | :--- | :--- |
| Border control hooks (`drawHorizontalLine`) | High | Planned |
| Dual ESM/CJS exports | High | Planned |
| Diff table (side-by-side comparison) | Medium | Planned |
| Emoji/icon width support | Medium | Planned |
| Browser console rendering | Medium | Planned |
| Gantt-chart rows | Medium | Planned |
| YAML export | Medium | Planned |
| `cmd-table-jest-reporter` | Medium | Planned |
| `cmd-table-vitest-reporter` | Medium | Planned |


## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

MIT
