# Columns & Layout

## Adding Columns

You can add columns with a simple string or a configuration object.

```ts
const table = new Table();

// Simple
table.addColumn('Name');

// Configuration
table.addColumn({ 
    name: 'Status', 
    color: 'green',
    width: 20 
});
```

## Responsive Layouts

Make your tables adapt to different terminal widths using `responsiveMode`.

```ts
const table = new Table({
  // terminalWidth: process.stdout.columns, // Defaults to current width
  responsiveMode: 'hide', // 'hide' or 'stack'
});

// 'hide': Low priority columns are hidden if they don't fit.
table.addColumn({ name: 'ID', priority: 1 }); // High priority (kept)
table.addColumn({ name: 'Description', priority: 0 }); // Low priority (hidden if tight)
```

## Spanning

### Header Groups (ColSpan)
Group columns under a super-header.

```ts
const table = new Table({
  headerGroups: [
    { title: 'Identity', colSpan: 2 }, // Spans 'Name' and 'Role'
    { title: 'Performance', colSpan: 2 } // Spans 'Score' and 'Grade'
  ]
});
```

### Cell Spans
Merge cells horizontally or vertically.

```ts
// RowSpan (Vertical Merge) via mergeAdjacent
table.mergeAdjacent(['Department']);

// ColSpan (Horizontal Merge) via manual row
table.addRow([
  { content: 'Summary', colSpan: 2 },
  'Status'
]);
```
