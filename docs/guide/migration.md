# Migration from cli-table3

cmd-table is a drop-in upgrade from `cli-table3` for most use cases. The API surface is broader, the defaults are more modern, and TypeScript support is first-class. This guide covers the common migration patterns.

## Install

Replace `cli-table3` with `cmd-table`:

```bash
npm uninstall cli-table3
npm install cmd-table
```

## Basic Table

**cli-table3:**

```js
const Table = require('cli-table3');

const table = new Table({
  head: ['Name', 'Role', 'Status'],
});

table.push(['Alice', 'Engineer', 'Active'], ['Bob', 'Designer', 'Away']);

console.log(table.toString());
```

**cmd-table:**

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addColumn('Name');
table.addColumn('Role');
table.addColumn('Status');

table.addRow(['Alice', 'Engineer', 'Active']);
table.addRow(['Bob', 'Designer', 'Away']);

console.log(table.render());
```

Or, if you'd rather skip explicit columns and let cmd-table infer them from object keys:

```ts
const table = new Table();
table.addRow({ Name: 'Alice', Role: 'Engineer', Status: 'Active' });
table.addRow({ Name: 'Bob', Role: 'Designer', Status: 'Away' });
console.log(table.render());
```

## API Mapping

| cli-table3                     | cmd-table                                  | Notes                                                  |
| ------------------------------ | ------------------------------------------ | ------------------------------------------------------ |
| `new Table({ head: [...] })`   | `new Table()` + `addColumn()` per column   | cmd-table separates schema and data more explicitly    |
| `table.push([...])`            | `table.addRow([...])` or `addRow({...})`   | Object form lets you skip column definitions           |
| `table.toString()`             | `table.render()`                           | Same intent, clearer name                              |
| `colWidths: [10, 20]`          | `addColumn({ name: 'X', width: 10 })`      | Width attached to the column, not the table            |
| `colAligns: ['left', 'right']` | `addColumn({ name: 'X', align: 'right' })` | Alignment attached to the column                       |
| `chars: { ... }`               | `theme: 'rounded' \| 'double' \| ...`      | cmd-table ships 7+ named themes; theme overrides chars |
| `style.head` (color)           | `headerColor: 'magenta'`                   | Constructor option                                     |
| `wordWrap: true`               | Built-in (auto when `width` is set)        | No explicit flag needed                                |

## Theme Mapping

cli-table3's `chars` option lets you override individual border characters. cmd-table ships **named themes** that bundle a complete consistent set:

```ts
new Table({ theme: 'rounded' }); // ╭─╮ │ ╰─╯  (default)
new Table({ theme: 'double' }); // ╔═╗ ║ ╚═╝
new Table({ theme: 'doubleHeader' }); // double border for header only
new Table({ theme: 'thinRounded' }); // ╭┄╮ ┊ ╰┄╯
new Table({ theme: 'honeywell' }); // ANSI-art retro
new Table({ theme: 'void' }); // borderless
new Table({ theme: 'dots' }); // dotted
```

If you genuinely need custom chars, you can still override the theme. See [Styling & Themes](/guide/styling).

## Cell Spans

`colSpan` and `rowSpan` work the same way:

**cli-table3:**

```js
table.push([{ colSpan: 2, content: 'Merged' }, 'C']);
```

**cmd-table:**

```ts
table.addRow([{ content: 'Merged', colSpan: 2 }, 'C']);
```

## Beyond cli-table3

Once you're migrated, you have access to capabilities that cli-table3 never offered:

- **Interactive TUI** — search, filter, paginate large datasets ([interactive](/guide/interactive))
- **Per-column formatters** — currency, dates, conditional colors ([data-ops](/guide/data-ops))
- **Visualizations** — sparklines, heatmaps, progress bars ([visuals](/guide/visuals))
- **CSV / JSON / HTML / Markdown export** ([exports](/guide/exports))
- **Pivot tables & cross-tabs** ([data-ops](/guide/data-ops))
- **Diff tables** — compare two datasets visually
- **Async pagination** — page through SQL queries or APIs without loading everything
- **JSX/React syntax** — declarative table config

## Gotchas

- **Default theme.** cli-table3 uses heavy ASCII borders by default; cmd-table uses `rounded`. Pass `theme: 'double'` if you need the heavier look.
- **Header colors.** cli-table3 defaults to no color; cmd-table defaults to **magenta** headers and **cyan** keys. Override with `headerColor` if needed.
- **`compact: true`** in cmd-table removes row separators (similar to passing minimal `chars` in cli-table3).
- **Strings vs cells.** cli-table3 lets you mix strings and `{ content, ... }` objects freely. cmd-table does too — same shape.

## Need help?

If you hit a cli-table3 pattern that doesn't translate cleanly, open an issue at [github.com/Aarul5/cmd-table/issues](https://github.com/Aarul5/cmd-table/issues) — most gaps are quick to add.
