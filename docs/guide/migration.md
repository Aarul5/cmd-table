# Migration from cli-table3

`cmd-table` is designed to be a drop-in upgrade for `cli-table3` and `table`, offering a significantly more modern API, robust typing, and many more features out of the box.

If you have an existing codebase using `cli-table3`, migrating to `cmd-table` takes just a few steps.

## Installation

Remove `cli-table3` and install `cmd-table`:

```bash
npm uninstall cli-table3
npm install cmd-table
```

## Basic Table Instantiation & Headers

In **cli-table3**, you pass headers and column configurations as arrays into the Table constructor:

```javascript
// cli-table3
const Table = require('cli-table3');

const table = new Table({
    head: ['Name', 'Role'],
    colWidths: [20, 30]
});
```

In **cmd-table**, you instantiate the table and define columns independently, ensuring a cleaner setup that is easier to dynamically configure at runtime:

```typescript
// cmd-table
import { Table } from 'cmd-table';

const table = new Table();

// You can add headers directly:
table.addColumn({ name: 'Name', maxWidth: 20 });
table.addColumn({ name: 'Role', maxWidth: 30 });
```

## Adding Rows

Both libraries support adding rows as array data.

```javascript
// cli-table3
table.push(
    ['Alice', 'Developer'],
    ['Bob', 'Manager']
);
```

```typescript
// cmd-table
table.addRows([
    ['Alice', 'Developer'],
    ['Bob', 'Manager']
]);

// Or dynamically push single rows:
table.addRow(['Charlie', 'Designer']);
```

### Object-Based Rows (New in cmd-table)

If your data is already an object, `cmd-table` lets you skip the tedious mapping pass. You can bind columns by `key`.

```typescript
import { Table } from 'cmd-table';
const table = new Table();
table.addColumn({ name: 'Name', key: 'name' });
table.addColumn({ name: 'Role', key: 'role' });

// Add raw objects directly
table.addRows([
    { name: 'Alice', role: 'Developer' },
    { name: 'Bob',   role: 'Manager' }
]);
```

## RowSpan and ColSpan

The syntax for spans is nearly identical. In both libraries, you can pass an object defining `content` alongside formatting options like `colSpan` and `align`.

```javascript
// cli-table3 & cmd-table
table.addRow([
    { content: 'System Summary', colSpan: 2, align: 'center' }
]);
```

## Styling and Colors

In **cli-table3**, you configured the color of borders and headers in the constructor via a `style` property.

```javascript
// cli-table3
const table = new Table({
  style: {
    head: ['green'],
    border: ['grey']
  }
});
```

In **cmd-table**, border styling and colors are unified under *Themes*. You can assign colors to the overall table headers, or individually override them per column.

```typescript
// cmd-table
import { Table, THEME_DoubleLine } from 'cmd-table';

const table = new Table({
    theme: THEME_DoubleLine, // Modern pre-built visual borders
    headerColor: 'green'     // Global header color
});

// Setting color directly per column
table.addColumn({ name: 'Error', color: 'red' });
```

## Advanced Capabilities

Once you've made the switch, you immediately gain access to `cmd-table`'s extended feature set that `cli-table3` lacks:

- **Interactivity (`InteractiveTable`)**: Search, sort, paginate, and select rows.
- **Sparklines & Visuals**: Add mini-graphs or progress bars directly into your cells.
- **Pivots & Tree Views**: Automatically aggregate data metrics or expand nested tree rows.
- **Exporting Options**: Convert your table output to CSV, Markdown, JSON, or HTML without rewriting the table shape.

Check out the [Getting Started](./getting-started.md) guide and the [Visualizations](./visuals.md) section to learn more!
