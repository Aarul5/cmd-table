# cmd-table

[![npm](https://img.shields.io/npm/v/cmd-table)](https://www.npmjs.com/package/cmd-table)
[![license](https://img.shields.io/npm/l/cmd-table)](https://github.com/Aarul5/cmd-table/blob/main/LICENSE)
[![CI](https://github.com/Aarul5/cmd-table/actions/workflows/ci.yml/badge.svg)](https://github.com/Aarul5/cmd-table/actions/workflows/ci.yml)
[![downloads](https://img.shields.io/npm/dm/cmd-table)](https://www.npmjs.com/package/cmd-table)
[![size](https://img.shields.io/bundlephobia/minzip/cmd-table)](https://bundlephobia.com/package/cmd-table)

A modern, feature-rich, and enterprise-grade CLI table library for Node.js.

## Features

*   **Zero Dependencies**: Lightweight and fast.
*   **Modern Theming**: "Rounded" theme by default, plus `honeywell`, `void`, `double`, `dots`, and more.
*   **Rich Styling**: ANSI color support for headers and columns (defaults to **Magenta** headers and **Cyan** keys).
*   **Advanced Layouts**: `colSpan`, `rowSpan`, auto-sizing, word-wrap, and specific column widths.
*   **Responsive**: Hide or stack columns on smaller screens based on priority.
*   **Data Visualization**:
    *   **Tree View**: Visualize hierarchical data with automatic indentation.
    *   **Auto-Merge**: Automatically vertically merge identical adjacent cells.
    *   **Header Groups**: Spans multiple columns under a super-header.
    *   **Footers & Summaries**: Automatic sum/avg/count or custom footers.
*   **Data Operations**: Built-in column sorting (`asc`/`desc`).
*   **Streaming**: Efficiently render large datasets row-by-row.
*   **Exports**: Export tables to Markdown, CSV, JSON, or HTML.
*   **CLI Tool**: Standalone executable to pipe JSON data into formatted tables.

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

## Styling

Customize colors for headers and specific columns.

```ts
const table = new Table({
  headerColor: 'blue', // Override default magenta
});

table.addColumn({ name: 'Error', color: 'red' });
table.addColumn({ name: 'Warning', color: 'yellow' });
```

## Advanced Visualization

### Tree View (Hierarchical Data)

Visualize nested data structures like file systems or org charts.

```ts
import { Table, addTree } from 'cmd-table';

const table = new Table();
table.addColumn('Name');
table.addColumn('Size');

const files = [
  { Name: 'src', Size: '-', children: [{ Name: 'index.ts', Size: '2KB' }] },
  { Name: 'package.json', Size: '1KB' }
];

addTree(table, 'Name', files);
console.log(table.render());
```

### Auto-Merge (Grouping)

Automatically merge vertically adjacent cells with the same content.

```ts
import { Table, mergeAdjacent } from 'cmd-table';

const table = new Table();
table.addColumn('Department');
table.addColumn('Employee');

table.addRows([
  { Department: 'Engineering', Employee: 'Alice' },
  { Department: 'Engineering', Employee: 'Bob' },
  { Department: 'HR', Employee: 'Charlie' }
]);

// Merges the 'Engineering' cells vertically
mergeAdjacent(table, ['Department']);
console.log(table.render());
```

### Column & Row Spans

Merge cells horizontally or vertically within the table.

```ts
// Span 2 columns
table.addRow([
  { content: 'Summary', colSpan: 2 },
  'Status'
]);

// Span 2 rows (vertical merge) is handled by Auto-Merge or manual rowSpan
```

## Themes

Choose from built-in themes to instantly style your table.

```ts
import { Table, THEME_DoubleLine } from 'cmd-table';

// Apply a theme globally
const table = new Table({ theme: THEME_DoubleLine });
```

Available themes:
*   `THEME_Rounded` (Default)
*   `THEME_Honeywell`
*   `THEME_DoubleLine`
*   `THEME_BoldBox`
*   `THEME_Dots`
*   `THEME_Void` (Borderless)

## Streaming (Large Datasets)

For large datasets, use the `StreamRenderer` to print rows as they are processed, rather than building the entire table in memory.

```ts
import { Table, StreamRenderer } from 'cmd-table';

// Define columns first
const table = new Table({ columns: ['ID', 'Message'] });
const stream = new StreamRenderer(table);

// Render header once
console.log(stream.renderHeader());

// Render rows in chunks or individually as data arrives
data.forEach(item => {
  const row = table.addRow([item.id, item.msg]);
  console.log(stream.renderRows([row]));
});

// Render footer
console.log(stream.renderFooter());
```

## CLI Tool

You can use the library directly from the terminal to format JSON data.

```bash
# Pipe JSON data
cat data.json | npx cmd-table

# Specify columns and theme
cat data.json | npx cmd-table --columns=name,age --theme=double
```

### Data Operations (Sorting)

Sort the table by a specific column.

```ts
// Sort by 'Name' in ascending order
table.sort('Name');

// Sort by 'Age' in descending order
table.sort('Age', 'desc');
```

### Pagination

paginate your table data.

```ts
// Get the first page with 10 rows per page
const page1 = table.paginate(1, 10);
console.log(page1.render());

// OR get all pages at once
const pages = table.getPages(10);
pages.forEach(page => console.log(page.render()));
```

## Advanced Features

### Responsive Layouts

Make your tables adapt to different terminal widths.

```ts
const table = new Table({
  terminalWidth: process.stdout.columns || 80,
  responsiveMode: 'hide', // or 'stack'
});

// 'hide': Low priority columns are hidden if they don't fit.
// 'stack': Table converts to a vertical list view if it doesn't fit.
table.addColumn({ name: 'ID', priority: 1 }); // High priority
table.addColumn({ name: 'Description', priority: 0 }); // Low priority
```

### Header Groups

Group multiple columns under a "super-header".

```ts
const table = new Table({
  headerGroups: [
    { title: 'Identity', colSpan: 2 }, // Spans 'Name' and 'Role'
    { title: 'Performance', colSpan: 2 } // Spans 'Score' and 'Grade'
  ]
});
```

### Footers & Summaries

Add a footer row manually or calculate summaries.

```ts
// Manual Footer
table.setFooter({ Name: 'Total', Cost: '100.00' });

// Automatic Summary (Sum, Avg, Count)
table.summarize(['Cost'], 'sum');
```

## Exports

Export your table data to various formats using the simplified `export()` method.

```ts
// Markdown
const md = table.export('md');

// CSV
const csv = table.export('csv'); // uses comma delimiter by default
// For custom options, use the renderer directly:
// new CsvRenderer({ delimiter: ';' }).render(table)

// JSON
const json = table.export('json');

// HTML
const html = table.export('html');
```

## Interactive Table (TUI)

Build interactive terminal interfaces using `cmd-table`.

Use the built-in `InteractiveTable` class for instant pagination and sorting features without boilerplate.

```ts
import { Table, InteractiveTable } from 'cmd-table';

const table = new Table();
// ... add columns and rows ...

// Start interactive mode (Handles keys: n/p for pages, s for sort, q for quit)
new InteractiveTable(table, { pageSize: 10 }).start();
```

To see it in action:
```bash
npx ts-node examples/interactive_table.ts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

MIT
