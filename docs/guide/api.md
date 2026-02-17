# API Quick Reference

A condensed reference for all public classes, methods, and options.

## Table

The core class. Holds columns, rows, and rendering configuration.

### Constructor

```ts
new Table(options?: TableOptions)
```

| Option | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnConfig[]` | `[]` | Column definitions |
| `theme` | `ITheme` | `THEME_Rounded` | Border theme |
| `headerColor` | `ColorName` | `'magenta'` | Header text color |
| `compact` | `boolean` | `false` | Remove row separators |
| `zebra` | `boolean` | `false` | Dim alternating rows |
| `responsiveMode` | `'none' \| 'hide' \| 'stack'` | `'none'` | Responsive behavior |
| `terminalWidth` | `number` | auto | Override terminal width |
| `headerGroups` | `HeaderGroup[]` | `[]` | Column grouping headers |

### Methods

| Method | Returns | Description |
|---|---|---|
| `addColumn(config)` | `void` | Add a column (string or config object) |
| `setColumns(configs)` | `void` | Replace all columns |
| `addRow(data)` | `void` | Add a row (object, array, or cell array) |
| `addRows(data[])` | `void` | Add multiple rows |
| `render()` | `string` | Render the table to a string |
| `sort(column, dir?)` | `void` | Sort rows by column (`'asc'` or `'desc'`) |
| `paginate(pageSize)` | `void` | Slice rows to first page |
| `getPages(pageSize)` | `Table[]` | Split into page-sized Table instances |
| `export(format)` | `string` | Export to `'md'`, `'csv'`, `'json'`, or `'html'` |
| `summarize(cols, algo)` | `void` | Compute footer (`'sum'`, `'avg'`, `'count'`) |
| `setFooter(data)` | `void` | Set a custom footer row |
| `addTree(col, data)` | `void` | Add hierarchical tree data |
| `mergeAdjacent(cols?)` | `void` | Vertically merge identical adjacent cells |

### Static Methods

| Method | Returns | Description |
|---|---|---|
| `Table.fromVertical(data)` | `Table` | Create from vertical key-value pairs |
| `Table.fromCross(data, opts)` | `Table` | Create from CrossTab results |

### Properties

| Property | Type | Description |
|---|---|---|
| `columns` | `Column[]` | Array of column definitions |
| `rows` | `Row[]` | Array of row objects |
| `footer` | `any[] \| Record` | Footer row data |
| `theme` | `ITheme` | Current theme |

---

## Column

Column configuration options:

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Display name |
| `key` | `string` | `name` | Data lookup key |
| `width` | `number` | auto | Fixed width |
| `minWidth` | `number` | — | Minimum width |
| `maxWidth` | `number` | — | Maximum width |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Text alignment |
| `color` | `ColorName` | — | Cell text color |
| `hidden` | `boolean` | `false` | Hide column |
| `priority` | `number` | `0` | Responsive priority (higher = hidden first) |
| `wrapWord` | `boolean` | `false` | Word wrap |
| `truncate` | `string` | `'…'` | Truncation character |
| `paddingLeft` | `number` | `1` | Left padding |
| `paddingRight` | `number` | `1` | Right padding |

---

## Row

| Property / Method | Type | Description |
|---|---|---|
| `cells` | `Cell[]` | Array of cells in this row |
| `getData()` | `any` | Returns the original data passed to `addRow()` |

---

## Cell

| Property | Type | Description |
|---|---|---|
| `content` | `string` | Cell text content |
| `colSpan` | `number` | Horizontal span (default: 1) |
| `rowSpan` | `number` | Vertical span (default: 1) |
| `align` | `string` | Override alignment for this cell |
| `vAlign` | `string` | Vertical alignment (`'top'`, `'middle'`, `'bottom'`) |

---

## InteractiveTable

```ts
new InteractiveTable(table: Table, options: InteractiveOptions)
```

| Option | Type | Description |
|---|---|---|
| `onSelect` | `(rows: Row[]) => void` | Selection callback |
| `onExit` | `() => void` | Exit callback |

| Method | Description |
|---|---|
| `start()` | Launch the TUI |

---

## AsyncInteractiveTable

```ts
new AsyncInteractiveTable(source: IDataSource, template: Table)
```

| Method | Description |
|---|---|
| `start()` | Launch the async TUI |

---

## IDataSource

Interface for async data sources:

| Method | Required | Description |
|---|---|---|
| `count()` | ✅ | Return total row count |
| `getRows(offset, limit)` | ✅ | Fetch a page of rows |
| `sort(column, direction)` | Optional | Sort server-side |
| `filter(query)` | Optional | Filter server-side |

---

## Analysis

### Aggregations

| Method | Description |
|---|---|
| `Aggregations.sum(values)` | Sum of values |
| `Aggregations.avg(values)` | Average |
| `Aggregations.min(values)` | Minimum |
| `Aggregations.max(values)` | Maximum |
| `Aggregations.count(values)` | Count |
| `Aggregations.stdDev(values)` | Standard deviation |
| `Aggregations.variance(values)` | Variance |
| `Aggregations.percentile(values, p)` | Percentile (0-1) |

### PivotTable

```ts
PivotTable.create(data, { groupBy, targetColumn, algorithm, pivotColumn?, onError? })
```

### CrossTab

```ts
CrossTab.create(data, { rowKey, colKey, valueKey, aggregator, missingValue? })
```

---

## Integrations

| Class | Static Methods |
|---|---|
| `CsvTable` | `.from(csv, opts?)`, `.toCsv(table)` |
| `HtmlTable` | `.from(html)`, `.toHtml(table)` |
| `JsonTable` | `.toJson(table)` |
| `SqlDataSource` | `new SqlDataSource(db, tableName)` |

---

## Utilities

| Function | Description |
|---|---|
| `colorize(text, color)` | Wrap text in ANSI color codes |
| `Sparkline.generate(values)` | Generate sparkline string |
| `Heatmap.color(value, min, max, mode?)` | Colorize a value on red→green gradient |
| `Heatmap.autoColor(values, min, max)` | Colorize an array of values |
