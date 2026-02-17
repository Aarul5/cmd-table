# Exporting

Export your table data to Markdown, CSV, JSON, or HTML.

## Quick Export

The simplest way — use `table.export(format)`:

```ts
const table = new Table();
table.addColumn('Name');
table.addColumn('Score');
table.addRows([
    { Name: 'Alice', Score: 95 },
    { Name: 'Bob', Score: 87 }
]);

const md   = table.export('md');       // or 'markdown'
const csv  = table.export('csv');
const json = table.export('json');
const html = table.export('html');
```

## Expected Output

### Markdown

```ts
console.log(table.export('md'));
```

```markdown
| Name | Score |
|---|---|
| Alice | 95 |
| Bob | 87 |
```

### CSV

```ts
console.log(table.export('csv'));
```

```
Name,Score
Alice,95
Bob,87
```

### JSON

```ts
console.log(table.export('json'));
```

```json
[
  {"Name":"Alice","Score":"95"},
  {"Name":"Bob","Score":"87"}
]
```

### HTML

```ts
console.log(table.export('html'));
```

```html
<table>
  <thead><tr><th>Name</th><th>Score</th></tr></thead>
  <tbody>
    <tr><td>Alice</td><td>95</td></tr>
    <tr><td>Bob</td><td>87</td></tr>
  </tbody>
</table>
```

## Advanced: Static Class Methods

For more control, use the static helper classes directly:

```ts
import { HtmlTable, CsvTable, JsonTable } from 'cmd-table';

// These return the same output as table.export()
const html = HtmlTable.toHtml(table);
const csv  = CsvTable.toCsv(table);
const json = JsonTable.toJson(table);
```

## Save to File

Combine with Node.js `fs` to save exports:

```ts
import { writeFileSync } from 'fs';

writeFileSync('report.md', table.export('md'));
writeFileSync('data.csv', table.export('csv'));
writeFileSync('data.json', table.export('json'));
writeFileSync('report.html', table.export('html'));
```

## Round-Trip: Import → Transform → Export

A common workflow — parse data, manipulate it, and export:

```ts
import { CsvTable, Table } from 'cmd-table';

// 1. Import CSV
const input = CsvTable.from(rawCsv);

// 2. Sort & summarize
input.sort('Sales', 'desc');
input.summarize(['Sales'], 'sum');

// 3. Export as Markdown report
const report = input.export('md');
console.log(report);
```
