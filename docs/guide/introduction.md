# What is cmd-table?

**cmd-table** is a modern, zero-runtime-dependency CLI table library for Node.js. You give it data, you get a beautifully rendered table — with optional interactivity, visualizations, and async pagination on top.

## See it first

```ts
import { Table, ProgressBar } from 'cmd-table';

const table = new Table({ headerColor: 'magenta' });
table.addColumn({ name: 'Module', key: 'module' });
table.addColumn({
  name: 'Coverage',
  key: 'coverage',
  formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 12 }),
});

table.addRow({ module: 'core', coverage: 82 });
table.addRow({ module: 'cli', coverage: 47 });
table.addRow({ module: 'plugins', coverage: 100 });

console.log(table.render());
```

```
╭─────────┬──────────────────╮
│ Module  │ Coverage         │
├─────────┼──────────────────┤
│ core    │ ██████████▒▒ 82% │
│ cli     │ █████▒▒▒▒▒▒▒ 47% │
│ plugins │ ████████████ 100%│
╰─────────┴──────────────────╯
```

That's the entire mental model. **Columns** describe shape and styling, **rows** carry data, **formatters** transform cell values at render time. Everything else (themes, async, TUI, exports) is layered on top of those primitives.

## Why pick cmd-table?

The popular alternatives — `cli-table3`, `table`, `tty-table` — are stable but quiet. cmd-table is **actively maintained in 2026** and ships features the others don't:

|                                          | cmd-table | cli-table3 | table | tty-table |
| ---------------------------------------- | :-------: | :--------: | :---: | :-------: |
| Zero runtime dependencies                |   **✓**   |     —      |   —   |     —     |
| Interactive TUI (search, filter, select) |   **✓**   |     —      |   —   |     —     |
| Async pagination (databases, APIs)       |   **✓**   |     —      |   —   |     —     |
| Sparklines / Heatmaps / Progress bars    |   **✓**   |     —      |   —   |     —     |
| Pivot tables & cross-tabs                |   **✓**   |     —      |   —   |     —     |
| Diff tables                              |   **✓**   |     —      |   —   |     —     |
| CSV / HTML import + export               |   **✓**   |     —      |   —   |     —     |
| Tree view                                |   **✓**   |     —      |   —   |     —     |
| JSX / React syntax                       |   **✓**   |     —      |   —   |     —     |
| Per-column formatters                    |   **✓**   |     —      |   —   |     ✓     |
| Streaming renderer                       |   **✓**   |     —      |   ✓   |     —     |
| Responsive layouts                       |   **✓**   |     —      |   —   |     ✓     |
| TypeScript-first                         |   **✓**   |  partial   |   ✓   |     —     |

## What you can build with it

- **DevOps dashboards** that live-update status tables in CI logs.
- **Data explorers** that page through SQL queries or REST endpoints interactively.
- **CLI reports** with currency formatting, conditional colors, and progress bars in cells.
- **Log viewers** with search and filter built in.
- **Admin tools** — ticket browsers, user lists, inventory views — without writing a TUI from scratch.
- **Custom test reporters** (we ship Jest and Vitest reporters as separate packages).

## How it's put together

```
Table  (core data model)
├── Column[]              — structure & per-column config
├── Row[] → Cell[]        — your data
├── LayoutManager         — grid layout, span resolution, responsive logic
├── Renderers
│   ├── StringRenderer    — ANSI terminal output (the default)
│   ├── StreamRenderer    — row-by-row for huge datasets
│   ├── CsvRenderer
│   ├── JsonRenderer
│   ├── HtmlRenderer
│   └── MarkdownRenderer
├── InteractiveTable      — keyboard-driven TUI on top of a Table
├── AsyncInteractiveTable + IDataSource — paginated remote data
└── Analysis              — PivotTable, CrossTab, Aggregations
```

You only reach for the parts you need. The basic flow (`new Table()` → `addRow()` → `render()`) doesn't load any of the async, TUI, or analysis code.

## Next

- Coming from `cli-table3`? Read the **[migration guide](/guide/migration)** — it's a 5-minute drop-in.
- New here? **[Get started in 30 seconds](/guide/getting-started)**.
- Looking for a specific pattern? Skim the **[recipes](/guide/recipes)**.
