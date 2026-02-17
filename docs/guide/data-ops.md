# Data Operations

## Sorting

Sort the table by a specific column.

```ts
// Sort by 'Name' in ascending order
table.sort('Name');

// Sort by 'Age' in descending order
table.sort('Age', 'desc');
```

## Pagination

Programmatically paginate your table data.

```ts
// Get all pages at once
const pages = table.getPages(10);
pages.forEach(page => console.log(page.render()));
```

## Aggregations (Pivot Tables)

Group and aggregate data naturally.

```ts
import { PivotTable } from 'cmd-table';

const pivot = PivotTable.create(salesData, {
    groupBy: 'Region',
    targetColumn: 'Amount',
    algorithm: 'sum' // or 'avg', 'min', 'max', 'count', or custom function
});
console.log(pivot.render());
```

## CrossTab (Matrix View)

Generate a matrix view (e.g., Sales by Product vs Month).

```ts
import { CrossTab } from 'cmd-table';

const matrix = CrossTab.create(salesData, {
    rowKey: 'Product',
    colKey: 'Month',
    valueKey: 'Amount',
    aggregator: 'sum',
    missingValue: 0
});
console.log(matrix.render());
```
