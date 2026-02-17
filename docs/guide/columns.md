# Columns & Layout

## Column Options

Every column accepts these configuration options:

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Display name shown in the header |
| `key` | `string` | same as `name` | Key used to look up data in row objects |
| `width` | `number` | auto | Fixed column width in characters |
| `minWidth` | `number` | — | Minimum width (used with auto-sizing) |
| `maxWidth` | `number` | — | Maximum width before truncation |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Horizontal text alignment |
| `color` | `ColorName` | — | ANSI color for cell content |
| `hidden` | `boolean` | `false` | Hide this column from output |
| `priority` | `number` | `0` | Responsive priority (higher = hidden first) |
| `wrapWord` | `boolean` | `false` | Enable word wrapping for long content |
| `truncate` | `string` | `'…'` | Truncation character when content overflows |
| `paddingLeft` | `number` | `1` | Left padding (spaces) |
| `paddingRight` | `number` | `1` | Right padding (spaces) |

## Examples

### Basic Column Definition

```ts
const table = new Table();

// String shorthand — name and key are both 'Name'
table.addColumn('Name');

// Full config object
table.addColumn({
    name: 'Salary',
    key: 'salary',
    align: 'right',
    color: 'green',
    width: 12
});
```

### Constructor Columns

Define all columns at once:

```ts
const table = new Table({
    columns: [
        { name: 'ID', width: 5, align: 'right' },
        { name: 'Name', color: 'cyan' },
        { name: 'Department', width: 15 },
        { name: 'Salary', align: 'right', color: 'green' }
    ]
});
```

### Replacing Columns

Use `setColumns()` to replace all columns after construction:

```ts
table.setColumns([
    { name: 'Product', key: 'product' },
    { name: 'Price', key: 'price', align: 'right' }
]);
```

## Text Alignment

```ts
const table = new Table();
table.addColumn({ name: 'Left', align: 'left', width: 15 });   // Default
table.addColumn({ name: 'Center', align: 'center', width: 15 });
table.addColumn({ name: 'Right', align: 'right', width: 15 });

table.addRow({ Left: 'Hello', Center: 'Hello', Right: 'Hello' });
```

**Expected output:**
```
╭─────────────────┬─────────────────┬─────────────────╮
│ Left            │     Center      │           Right │
├─────────────────┼─────────────────┼─────────────────┤
│ Hello           │      Hello      │           Hello │
╰─────────────────┴─────────────────┴─────────────────╯
```

## Word Wrapping & Truncation

### Truncation (Default)

When content exceeds the column width, it's truncated with `…`:

```ts
table.addColumn({ name: 'Description', width: 15, truncate: '…' });
table.addRow({ Description: 'This is a very long description that will be cut' });
// Output: "This is a ve…"
```

### Word Wrap

Enable word wrapping to show full content across multiple lines:

```ts
table.addColumn({ name: 'Description', width: 15, wrapWord: true });
table.addRow({ Description: 'This is a very long description that will wrap' });
```

**Expected output:**
```
│ This is a very │
│ long           │
│ description    │
│ that will wrap │
```

## Responsive Layouts

Make tables adapt to narrow terminals by setting `responsiveMode`.

### Hide Mode

Low-priority columns are hidden first when the table doesn't fit.

```ts
const table = new Table({
    terminalWidth: 40,  // Or auto-detected from process.stdout.columns
    responsiveMode: 'hide'
});

table.addColumn({ name: 'ID', priority: 0 });          // Kept (low priority number)
table.addColumn({ name: 'Name', priority: 0 });         // Kept
table.addColumn({ name: 'Email', priority: 5 });         // Hidden first
table.addColumn({ name: 'Bio', priority: 10 });          // Hidden first (highest priority = hidden first)
```

::: tip Priority Logic
**Lower number = more important.** Columns with the highest `priority` value are hidden first when space is tight.
:::

### Stack Mode

Converts the table into a vertical key-value layout when it doesn't fit:

```ts
const table = new Table({
    terminalWidth: 30,
    responsiveMode: 'stack'
});
```

**Stacked output:**
```
╭───────┬──────────╮
│ Row 1            │
├───────┼──────────┤
│ Name  │ Alice    │
│ Role  │ Engineer │
│ Email │ a@co.com │
╰───────┴──────────╯
```

## Spanning

### Header Groups (Column Grouping)

Group multiple columns under a super-header:

```ts
const table = new Table({
    headerGroups: [
        { title: 'Personal', colSpan: 2 },
        { title: 'Work', colSpan: 2 }
    ]
});
table.addColumn('First');
table.addColumn('Last');
table.addColumn('Role');
table.addColumn('Team');
```

### Cell ColSpan (Horizontal Merge)

Merge cells horizontally within a row:

```ts
table.addRow([
    { content: 'Section Title', colSpan: 3, align: 'center' },
    'Status'
]);
```

### Cell RowSpan (Vertical Merge)

Use `mergeAdjacent()` to automatically merge identical cells vertically:

```ts
table.addRows([
    { Dept: 'Engineering', Name: 'Alice' },
    { Dept: 'Engineering', Name: 'Bob' },
    { Dept: 'HR', Name: 'Charlie' }
]);

table.mergeAdjacent(['Dept']); // 'Engineering' merges into a single tall cell
```

## Hidden Columns

Manually hide specific columns:

```ts
table.addColumn({ name: 'Internal ID', hidden: true });
```

The column data is still stored — it's just not rendered. Useful for export or programmatic access.
