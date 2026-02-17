# Integrations

cmd-table can **import** data from CSV, HTML, and even JSX — and **export** to multiple formats.

## CSV Parser

Parse CSV strings directly into tables. Supports headers, quoted fields, custom delimiters, and CRLF line endings.

```ts
import { CsvTable } from 'cmd-table';

const csv = `name,age,city
Alice,30,New York
Bob,25,"San Francisco"
Charlie,35,Chicago`;

const table = CsvTable.from(csv);
console.log(table.render());
```

**Expected output:**
```
╭─────────┬─────┬───────────────╮
│ name    │ age │ city          │
├─────────┼─────┼───────────────┤
│ Alice   │ 30  │ New York      │
│ Bob     │ 25  │ San Francisco │
│ Charlie │ 35  │ Chicago       │
╰─────────┴─────┴───────────────╯
```

### CSV Options

```ts
CsvTable.from(csvString, options?)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `delimiter` | `string` | `','` | Field separator character |
| `hasHeaders` | `boolean` | `true` | First row is header row |

### Tab-Separated Values

```ts
const tsv = `name\tage\tcity
Alice\t30\tNew York
Bob\t25\tChicago`;

const table = CsvTable.from(tsv, { delimiter: '\t' });
```

## HTML Scraper

Parse HTML `<table>` elements directly. Zero-dependency, regex-based parser.

```ts
import { HtmlTable } from 'cmd-table';

const html = `
<table>
    <thead>
        <tr><th>Product</th><th>Price</th></tr>
    </thead>
    <tbody>
        <tr><td>Widget</td><td>$9.99</td></tr>
        <tr><td>Gadget</td><td>$24.99</td></tr>
    </tbody>
</table>`;

const table = HtmlTable.from(html);
console.log(table.render());
```

::: tip
The scraper handles `<thead>`/`<tbody>`, `<th>` and `<td>` elements, nested tags, and whitespace normalization.
:::

## JSX / Declarative Tables

Define tables using JSX syntax. Works with the built-in lightweight factory — no React dependency needed.

### Setup

Add to your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "h"
    }
}
```

### Usage

```tsx
import { h, render } from 'cmd-table';

const element = (
    <cmd-table theme="doubleHeader" compact>
        <cmd-column name="Task" key="task" />
        <cmd-column name="Status" key="status" width={15} />
        <cmd-row task="Write docs" status="Done" />
        <cmd-row task="Write tests" status="In Progress" />
        <cmd-row task="Deploy" status="Pending" />
    </cmd-table>
);

const table = render(element);
console.log(table.render());
```

### JSX Elements

| Element | Props | Description |
|---|---|---|
| `<cmd-table>` | `theme`, `compact` | Root element, wraps columns and rows |
| `<cmd-column>` | `name`, `key`, `width` | Defines a column |
| `<cmd-row>` | `{[key]: value}` | Adds a row (keys must match column keys) |

## Streaming (Large Datasets)

For very large datasets where you don't want to buffer the entire output, use `StreamRenderer`:

```ts
import { Table, StreamRenderer } from 'cmd-table';

const table = new Table();
table.addColumn('ID');
table.addColumn('Value');

const stream = new StreamRenderer(table);

// Print header
process.stdout.write(stream.renderHeader().join('\n') + '\n');

// Stream rows one by one
for (let i = 0; i < 10000; i++) {
    table.addRow({ ID: i, Value: Math.random().toFixed(4) });
    const lines = stream.renderRows(table.rows.length - 1);
    process.stdout.write(lines.join('\n') + '\n');
}

// Print footer/border
process.stdout.write(stream.renderFooter().join('\n') + '\n');
```

::: warning
`StreamRenderer` writes directly to stdout. It doesn't support re-rendering or scrolling. For interactive browsing of large data, use [`AsyncInteractiveTable`](/guide/async) instead.
:::
