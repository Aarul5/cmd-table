# Recipes

Copy-pasteable patterns for common needs. Each one is self-contained — drop it in, change the data, ship it.

[[toc]]

## Currency formatter

```ts
import { Table } from 'cmd-table';

const t = new Table();
t.addColumn({ name: 'Item', key: 'item' });
t.addColumn({
  name: 'Price',
  key: 'price',
  align: 'right',
  formatter: (v) => '$' + Number(v).toFixed(2),
});

t.addRow({ item: 'Coffee', price: 3.5 });
t.addRow({ item: 'Bagel', price: 2.95 });
console.log(t.render());
```

## Date formatter

```ts
t.addColumn({
  name: 'Created',
  key: 'createdAt',
  formatter: (v) => new Date(v).toISOString().slice(0, 10),
});
```

## Conditional row colors

Highlight rows by status — the callback receives the row data and returns an ANSI color name (or `undefined` for default).

```ts
const t = new Table({
  rowColor: (row) => {
    if (row.status === 'failed') return 'red';
    if (row.status === 'pending') return 'yellow';
    if (row.status === 'passed') return 'green';
  },
});

t.addRow({ test: 'login', status: 'passed' });
t.addRow({ test: 'logout', status: 'failed' });
t.addRow({ test: 'signup', status: 'pending' });
```

## Boolean as icon

```ts
t.addColumn({
  name: 'Active',
  key: 'active',
  align: 'center',
  formatter: (v) => (v ? '✓' : '✗'),
});
```

## Inline progress bars

```ts
import { Table, ProgressBar } from 'cmd-table';

const t = new Table();
t.addColumn({ name: 'Module', key: 'module' });
t.addColumn({
  name: 'Coverage',
  key: 'coverage',
  formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 10 }),
});

t.addRow({ module: 'core', coverage: 82 });
t.addRow({ module: 'cli', coverage: 47 });
console.log(t.render());
```

## Sparkline trends

```ts
import { Table, Sparkline } from 'cmd-table';

const t = new Table();
t.addColumn({ name: 'Metric', key: 'name' });
t.addColumn({
  name: 'Last 7 days',
  key: 'series',
  formatter: (v: number[]) => Sparkline.generate(v),
});

t.addRow({ name: 'CPU', series: [10, 12, 8, 14, 22, 19, 24] });
t.addRow({ name: 'Memory', series: [50, 52, 54, 56, 60, 58, 62] });
```

## Heatmap cells

```ts
import { Table, Heatmap } from 'cmd-table';

const t = new Table();
t.addColumn({ name: 'Region', key: 'region' });
t.addColumn({
  name: 'Latency (ms)',
  key: 'latency',
  formatter: (v) => Heatmap.generate(v, { min: 50, max: 500 }),
});

t.addRow({ region: 'us-east', latency: 80 });
t.addRow({ region: 'eu-west', latency: 120 });
t.addRow({ region: 'ap-south', latency: 480 });
```

## Diff two datasets

```ts
import { Table } from 'cmd-table';

const before = [
  { id: 1, name: 'Alice', score: 80 },
  { id: 2, name: 'Bob', score: 70 },
];
const after = [
  { id: 1, name: 'Alice', score: 95 },
  { id: 3, name: 'Charlie', score: 60 },
];

const diff = Table.compare(before, after, { primaryKey: 'id' });
console.log(diff.render());
// Highlights added (green), removed (red), modified (yellow)
```

## Pipe stdin to a table

```bash
echo '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' | npx cmd-table
cat data.csv | npx cmd-table
cat huge.csv | npx cmd-table --interactive
```

## CSV in, JSON out

```ts
import { CsvTable, Table } from 'cmd-table';
import { readFileSync } from 'node:fs';

const csv = readFileSync('users.csv', 'utf8');
const table = CsvTable.from(csv);

console.log(table.export('json'));
```

## Stream a huge dataset

`StreamRenderer` writes rows incrementally — useful when piping millions of rows through your CLI.

```ts
import { Table } from 'cmd-table';

const t = new Table();
t.addColumn('id');
t.addColumn('name');

const stream = t.streamRender(process.stdout);
for (let i = 0; i < 1_000_000; i++) {
  stream.writeRow({ id: i, name: `user-${i}` });
}
stream.end();
```

## Browse a SQLite table interactively

```ts
import { AsyncInteractiveTable, SqlDataSource } from 'cmd-table';
import Database from 'better-sqlite3';

const db = new Database('app.db');
const source = new SqlDataSource(db, 'users');

const t = new AsyncInteractiveTable(source);
await t.start();
```

Use arrow keys to navigate, `/` to search, `f` to filter, `q` to quit.

## Cross-tab a list of records

```ts
import { Table, CrossTab } from 'cmd-table';

const events = [
  { region: 'us', plan: 'free', count: 12 },
  { region: 'us', plan: 'pro', count: 7 },
  { region: 'eu', plan: 'free', count: 9 },
  { region: 'eu', plan: 'pro', count: 4 },
];

const ct = CrossTab.from(events, { rows: 'region', cols: 'plan', value: 'count' });
console.log(ct.render());
```

## Export to Markdown for a PR comment

```ts
const md = table.export('md');
console.log(md);
// | Name | Role | Status |
// | ---- | ---- | ------ |
// | …    | …    | …      |
```

## Keep Jest's output but add a summary table

```js
// jest.config.js
module.exports = {
  reporters: ['default', ['cmd-table-jest-reporter', { showSlowest: 5 }]],
};
```

See [`cmd-table-jest-reporter`](/guide/jest-reporter) for full options.

## Want more?

- **[API reference](/guide/api)** — every option, every method.
- **[Visualizations](/guide/visuals)** — sparklines, heatmaps, progress bars in depth.
- **[Interactive TUI](/guide/interactive)** — keyboard shortcuts and customization.
- **[GitHub Issues](https://github.com/Aarul5/cmd-table/issues)** — request a recipe or report a snag.
