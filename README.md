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
*   **Interactive TUI**: Built-in interactive mode for exploring large datasets with pagination and sorting.
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

## Interactive Table (TUI)

Build interactive terminal interfaces using `cmd-table`.

Use the built-in `InteractiveTable` class for instant pagination and sorting features without boilerplate. **This is the recommended way to display large datasets.**

```ts
import { Table, InteractiveTable } from 'cmd-table';

const table = new Table();
// ... add hundreds of rows ...

// Start interactive mode (Handles keys: n/p for pages, s for sort, q for quit)
new InteractiveTable(table, { pageSize: 15 }).start();
```

To see it in action:
```bash
npx ts-node examples/interactive_table.ts
npx ts-node examples/large_table.ts
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

### Responsive Layouts

Make your tables adapt to different terminal widths.

```ts
const table = new Table({
  terminalWidth: process.stdout.columns || 80,
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

Format JSON data directly from the terminal.

```bash
cat data.json | npx cmd-table --columns=name,age --theme=double
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

MIT
