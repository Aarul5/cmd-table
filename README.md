# cmd-table

A modern, feature-rich, and enterprise-grade CLI table library for Node.js.

## Features

*   **Zero Dependencies**: Lightweight and fast.
*   **Modern Theming**: "Rounded" theme by default, plus `honeywell`, `void`, `double`, `dots`, and more.
*   **Rich Styling**: ANSI color support for headers and columns (defaults to **Magenta** headers and **Cyan** keys).
*   **Advanced Layouts**: `colSpan`, `rowSpan`, auto-sizing, word-wrap, and specific column widths.
*   **Data Visualization**:
    *   **Tree View**: Visualize hierarchical data with automatic indentation.
    *   **Auto-Merge**: Automatically vertically merge identical adjacent cells.
*   **Responsive**: Hide or stack columns on smaller screens.
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

## Exports

Export your table data to various formats.

```ts
import { MarkdownRenderer, CsvRenderer } from 'cmd-table';

const md = new MarkdownRenderer().render(table);
const csv = new CsvRenderer().render(table);
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

This project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

MIT
