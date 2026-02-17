# Getting Started

## Installation

```bash
npm install cmd-table
```

::: tip TypeScript Ready
cmd-table ships with full TypeScript declarations. No `@types` package needed.
:::

## Your First Table

The fastest way to create a table — just add rows with objects. Columns are auto-detected from the keys.

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addRow({ Name: 'Alice', Role: 'Engineer', Status: 'Active' });
table.addRow({ Name: 'Bob', Role: 'Designer', Status: 'Away' });
table.addRow({ Name: 'Charlie', Role: 'PM', Status: 'Active' });

console.log(table.render());
```

**Expected output:**
```
╭─────────┬──────────┬────────╮
│ Name    │ Role     │ Status │
├─────────┼──────────┼────────┤
│ Alice   │ Engineer │ Active │
│ Bob     │ Designer │ Away   │
│ Charlie │ PM       │ Active │
╰─────────┴──────────┴────────╯
```

## Adding Data

### Method 1: Object Rows (Recommended)

Pass an object where keys match column names. Columns are auto-created on the first row if not explicitly defined.

```ts
table.addRow({ Name: 'Alice', Age: 30 });
```

### Method 2: Array Rows

Pass an array of values. Values map to columns in order.

```ts
table.addColumn('Name');
table.addColumn('Age');
table.addRow(['Alice', 30]);
```

### Method 3: Bulk Add

Add many rows at once with `addRows()`.

```ts
table.addRows([
    { Name: 'Alice', Age: 30 },
    { Name: 'Bob', Age: 25 },
    { Name: 'Charlie', Age: 35 }
]);
```

### Method 4: Cell Objects

For fine-grained control, pass cell objects with alignment, spans, etc.

```ts
table.addRow([
    { content: 'Merged Header', colSpan: 2, align: 'center' },
    'Normal Cell'
]);
```

## Defining Columns Explicitly

While auto-detection is convenient, explicit columns give you full control.

```ts
const table = new Table();

table.addColumn('Name');                          // Simple string
table.addColumn({ name: 'Age', align: 'right' }); // With config
table.addColumn({ name: 'Status', color: 'green', width: 12 }); // Styled

table.addRow({ Name: 'Alice', Age: 30, Status: 'Active' });
```

## Constructor Options

You can configure the table globally via the constructor:

```ts
const table = new Table({
    columns: [
        { name: 'ID', width: 5, align: 'right' },
        { name: 'Name', color: 'cyan' }
    ],
    headerColor: 'blue',
    compact: true,      // No row separators
    zebra: true,        // Alternating row dimming
    responsiveMode: 'hide'
});
```

See the full list of options in the [API Quick Reference](/guide/api).

## Next Steps

- [Columns & Layout](/guide/columns) — width, alignment, responsive, spans
- [Styling & Themes](/guide/styling) — colors, themes, zebra striping
- [Interactive TUI](/guide/interactive) — search, filter, paginate
