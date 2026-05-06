---
layout: home

hero:
  name: 'cmd-table'
  text: 'Modern CLI tables for Node.js'
  tagline: Interactive TUI · Sparklines · Pivot tables · Async pagination · CSV/JSON/HTML — zero runtime dependencies, TypeScript-first.
  image:
    src: /hero-table.svg
    alt: cmd-table
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: From cli-table3?
      link: /guide/migration
    - theme: alt
      text: GitHub
      link: https://github.com/Aarul5/cmd-table

features:
  - icon: 🚀
    title: Standalone
    details: Zero runtime dependencies. Drop it into any Node.js project without dragging a tree of transitive packages.
  - icon: 🎯
    title: Interactive TUI
    details: Built-in keyboard navigation — search, filter, paginate, select rows. No extra setup.
  - icon: 📊
    title: Visualizations
    details: Inline sparklines, heatmaps, progress bars, and tree views. Render data trends right inside cells.
  - icon: 🗄️
    title: Async & SQL
    details: Browse SQLite tables or paginate REST APIs without loading everything into memory.
  - icon: 🎨
    title: Themes
    details: Seven built-in themes, ANSI colors, zebra striping, compact mode, and per-column formatters.
  - icon: 🧩
    title: Ecosystem
    details: First-class reporters for Jest and Vitest, plus oclif integration — all on npm.
---

<div class="vp-doc home-extras">

## 30-Second Quick Start

```bash
npm install cmd-table
```

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addRow({ Name: 'Alice', Role: 'Engineer', Status: 'Active' });
table.addRow({ Name: 'Bob', Role: 'Designer', Status: 'Away' });
table.addRow({ Name: 'Charlie', Role: 'PM', Status: 'Active' });

console.log(table.render());
```

```
╭─────────┬──────────┬────────╮
│ Name    │ Role     │ Status │
├─────────┼──────────┼────────┤
│ Alice   │ Engineer │ Active │
│ Bob     │ Designer │ Away   │
│ Charlie │ PM       │ Active │
╰─────────┴──────────┴────────╯
```

That's it — columns are inferred from object keys, alignment, theme, and colors all have sensible defaults. When you're ready, [browse the recipes](/guide/recipes) for common patterns or jump into the [full guide](/guide/getting-started).

## Pipe data straight from your shell

```bash
echo '[{"name":"Alice","age":30},{"name":"Bob","age":25}]' | npx cmd-table
cat data.csv | npx cmd-table --interactive
sqlite3 app.db ".dump users" | npx cmd-table
```

## The ecosystem

| Package                                                | What it does                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| [`cmd-table`](https://www.npmjs.com/package/cmd-table) | Core library — tables, themes, TUI, visuals.                       |
| [`cmd-table-jest-reporter`](/guide/jest-reporter)      | Drop-in Jest reporter with table summaries and slowest-tests view. |
| [`cmd-table-vitest-reporter`](/guide/vitest-reporter)  | Same idea for Vitest, with watch-mode support.                     |
| [`cmd-table-oclif`](/guide/oclif)                      | `cli-ux` table replacement for oclif CLIs (Heroku, Salesforce, …). |

</div>
