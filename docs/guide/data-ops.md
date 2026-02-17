# Data Operations

## Sorting

Sort any table by column name. Supports ascending and descending order.

```ts
const table = new Table();
table.addColumn('Name');
table.addColumn('Age');
table.addRows([
    { Name: 'Charlie', Age: 35 },
    { Name: 'Alice', Age: 28 },
    { Name: 'Bob', Age: 42 }
]);

// Sort alphabetically by Name (ascending is default)
table.sort('Name');

// Sort numerically by Age, descending
table.sort('Age', 'desc');
```

::: tip
Sorting is **in-place** — it modifies the existing `table.rows` array. Call `sort()` before `render()`.
:::

## Pagination

Split a large table into pages for display:

```ts
// Paginate: 10 rows per page
table.paginate(10);
const page1 = table.render(); // Renders first 10 rows

// Or get all pages at once as separate Table instances
const pages = table.getPages(10);
pages.forEach((page, i) => {
    console.log(`--- Page ${i + 1} ---`);
    console.log(page.render());
});
```

## Footers & Summaries

### Manual Footer

Set a custom footer with `setFooter()`:

```ts
table.setFooter({ Name: 'Total', Age: '—', Score: 285 });
```

### Automatic Summarize

Compute and append a summary row automatically:

```ts
const table = new Table();
table.addColumn('Product');
table.addColumn('Sales');
table.addColumn('Profit');

table.addRows([
    { Product: 'Widget A', Sales: 100, Profit: 30 },
    { Product: 'Widget B', Sales: 250, Profit: 80 },
    { Product: 'Widget C', Sales: 75,  Profit: 20 }
]);

// Sum specific columns
table.summarize(['Sales', 'Profit'], 'sum');
console.log(table.render());
```

**Expected output:**
```
╭──────────┬───────┬────────╮
│ Product  │ Sales │ Profit │
├──────────┼───────┼────────┤
│ Widget A │ 100   │ 30     │
│ Widget B │ 250   │ 80     │
│ Widget C │ 75    │ 20     │
├──────────┼───────┼────────┤
│          │ 425   │ 130    │
╰──────────┴───────┴────────╯
```

Available algorithms: `'sum'`, `'avg'`, `'count'`

## Aggregations Class

Use the `Aggregations` class for standalone statistical calculations:

```ts
import { Aggregations } from 'cmd-table';

const values = [10, 20, 30, 40, 50];

Aggregations.sum(values);         // 150
Aggregations.avg(values);         // 30
Aggregations.min(values);         // 10
Aggregations.max(values);         // 50
Aggregations.count(values);       // 5
Aggregations.stdDev(values);      // 14.14
Aggregations.variance(values);    // 200
Aggregations.percentile(values, 0.9); // 90th percentile → 46
```

## Pivot Tables

Group rows by a column and aggregate values. Great for summarizing datasets.

```ts
import { PivotTable } from 'cmd-table';

const salesData = [
    { Region: 'North', Product: 'A', Amount: 100 },
    { Region: 'North', Product: 'B', Amount: 200 },
    { Region: 'South', Product: 'A', Amount: 150 },
    { Region: 'South', Product: 'B', Amount: 300 },
    { Region: 'North', Product: 'A', Amount: 50 }
];

const pivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: 'sum'  // 'sum' | 'avg' | 'min' | 'max' | 'count' | custom function
});
console.log(pivot.render());
```

**Expected output:**
```
╭────────┬────────╮
│ Region │ Amount │
├────────┼────────┤
│ North  │ 350    │
│ South  │ 450    │
╰────────┴────────╯
```

### Pivot with Custom Aggregator

```ts
const pivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: (values) => Math.max(...values) - Math.min(...values) // Range
});
```

### Pivot Columns

You can also add additional pivot columns:

```ts
const pivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: 'sum',
    pivotColumn: 'Product'  // Creates one column per unique Product value
});
```

## CrossTab (Matrix View)

Generate a two-dimensional matrix from your data — rows vs columns:

```ts
import { CrossTab } from 'cmd-table';

const salesData = [
    { Product: 'Widget', Month: 'Jan', Amount: 100 },
    { Product: 'Widget', Month: 'Feb', Amount: 150 },
    { Product: 'Gadget', Month: 'Jan', Amount: 200 },
    { Product: 'Gadget', Month: 'Feb', Amount: 250 }
];

const matrix = CrossTab.create(salesData, {
    rowKey: 'Product',
    colKey: 'Month',
    valueKey: 'Amount',
    aggregator: 'sum',    // 'sum' | 'count' | 'first' | 'last' | custom function
    missingValue: 0       // Fill missing intersections with 0
});
console.log(matrix.render());
```

**Expected output:**
```
╭────────┬─────┬─────╮
│        │ Jan │ Feb │
├────────┼─────┼─────┤
│ Widget │ 100 │ 150 │
│ Gadget │ 200 │ 250 │
╰────────┴─────┴─────╯
```
