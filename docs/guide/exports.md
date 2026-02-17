# Exports

Export your table data to various formats using the simplified `export()` method.

```ts
const md = table.export('md');
const csv = table.export('csv');
const json = table.export('json');
```

## Advanced Exporting

You can also use the dedicated static classes for more control.

```typescript
import { HtmlTable, CsvTable, JsonTable } from 'cmd-table';

// Export to HTML string
const html = HtmlTable.toHtml(table);

// Export to CSV string
const csv = CsvTable.toCsv(table);

// Export to JSON string
const json = JsonTable.toJson(table);
```
