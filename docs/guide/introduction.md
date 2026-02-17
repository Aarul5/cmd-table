# What is cmd-table?

**cmd-table** is a zero-dependency, enterprise-grade CLI table library for Node.js. It lets you render beautiful, interactive, and data-rich tables in the terminal — from simple logs to full-featured TUI applications.

## Why cmd-table?

Most CLI table libraries give you basic grids. **cmd-table** goes further:

| Feature | cmd-table | cli-table3 | table |
|---|:---:|:---:|:---:|
| Zero Dependencies | ✅ | ❌ | ❌ |
| Interactive TUI | ✅ | ❌ | ❌ |
| Async Data Sources | ✅ | ❌ | ❌ |
| Sparklines & Heatmaps | ✅ | ❌ | ❌ |
| Responsive Layout | ✅ | ❌ | ❌ |
| CSV / HTML / SQL Import | ✅ | ❌ | ❌ |
| JSX Support | ✅ | ❌ | ❌ |
| Tree View | ✅ | ❌ | ❌ |
| Multiple Themes | ✅ | ✅ | ✅ |
| Col/Row Span | ✅ | ✅ | ✅ |

## Architecture

cmd-table is built around a clean, composable architecture:

```
Table (core data model)
├── Column[] — structure & config
├── Row[] → Cell[] — your data
├── LayoutManager — grid layout with span resolution
├── StringRenderer — ANSI terminal output
├── StreamRenderer — row-by-row streaming
├── MarkdownRenderer, CsvRenderer, JsonRenderer, HtmlRenderer
├── InteractiveTable — keyboard-driven TUI
├── AsyncInteractiveTable + IDataSource — paginated remote data
└── Analysis: PivotTable, CrossTab, Aggregations
```

## What You Can Build

- **DevOps dashboards** — live-updating status tables
- **Data exploration tools** — interactive browsing of databases or API responses
- **CLI reports** — beautifully formatted output for CI/CD pipelines
- **Log viewers** — structured, searchable log output
- **Admin tools** — Jira tickets, user management, or inventory tables

## Next

Get started in 30 seconds → [Installation & Basic Usage](/guide/getting-started)
