# Changelog

## [1.3.2] - 2026-03-09

### New Features

-   **`drawHorizontalLine` hook**: New callback option on `ITableOptions` that gives developers ultimate, fine-grained control over which horizontal dividers are drawn. The callback receives `(index, size)` where 0 is the top border and `size` is the bottom border. This behavior overrides `compact: true` and the table's default body joins.

    ```ts
    const t = new Table({
        drawHorizontalLine: (index, size) => index === 0 || index === size // only draw top and bottom borders
    });
    ```

## [1.3.1] - 2026-03-06

### New Features

-   **`table.transpose()`**: New method on `Table` that returns a brand-new Table with rows and columns swapped. The original table is never mutated. Preserves `theme` and `compact` settings from the source.

    ```ts
    const t = new Table();
    t.addColumn('Name'); t.addColumn('Score');
    t.addRow({ Name: 'Alice', Score: 95 });
    t.addRow({ Name: 'Bob',   Score: 72 });

    console.log(t.transpose().render());
    // ╭───────┬───────┬─────╮
    // │ Field │ Row 1 │ Row 2 │
    // ├───────┼───────┼─────┤
    // │ Name  │ Alice │ Bob │
    // │ Score │ 95    │ 72  │
    // ╰───────┴───────┴─────╯
    ```

-   **`rowColor` callback**: New option on `ITableOptions` that applies an ANSI color to an entire data row based on its content. The header row is never affected.

    ```ts
    const t = new Table({
      rowColor: (row) => {
        if (Number(row.score) >= 90) return 'green';
        if (Number(row.score) >= 70) return 'yellow';
        return 'red';
      }
    });
    ```

    - Receives `rowData: Record<string, any>` and `rowIndex: number`
    - Works alongside `zebra`, per-column `formatter`, and `headerColor`
    - Return `undefined` to leave a row with default styling

### Bug Fixes

-   **[#6]** Fixed: `rowColor` callback had no visible effect when running examples using `npx ts-node` due to ts-node's module-level caching serving a stale build of `src/Table.ts`. The underlying implementation (`Table.ts` + `StringRenderer.ts`) is fully correct; the issue was a developer-tooling artefact, not a code defect. The feature works correctly when the project is compiled via `tsc` or consumed as a dependency.

### Examples Added

-   `examples/row_color.ts` — demonstrates `rowColor` conditional row coloring
-   `examples/transpose.ts` — demonstrates `table.transpose()` matrix flip

### Test Coverage

-   `tests/rowColor.test.ts` — 8 tests: ANSI output, rowIndex, header protection, zebra interop, regression
-   `tests/transpose.test.ts` — 8 tests: structure, values, immutability, theme, edge cases

### Chores

-   **`.gitignore` updated**: Added `src/**/*.js` and `examples/**/*.js` to prevent accidentally-compiled JavaScript artefacts from being tracked when running `tsc` without an explicit `--outDir`. Also added `temp.txt` to ignore.

---


## [1.3.0] - 2026-03-05


### New Features

-   **Per-column formatter callbacks**: Added `formatter?: (value: any, rowIndex: number) => string` to `IColumnOptions` and `Column`. Transforms a cell's raw value before rendering — useful for currency formatting, date display, boolean icons, and any value-to-string conversion. The header row is never passed through the formatter.

    ```ts
    table.addColumn({
      name: 'Price', key: 'price',
      formatter: (v) => '$' + Number(v).toFixed(2),
    });
    ```

-   **`ProgressBar` visual utility**: New `ProgressBar.generate(value, max?, options?)` class in `src/visuals/ProgressBar.ts`, exported from the public API alongside `Sparkline` and `Heatmap`. Generates Unicode block-character progress bars for embedding inside table cells via a formatter.

    ```ts
    import { Table, ProgressBar } from 'cmd-table';

    table.addColumn({
      name: 'Coverage', key: 'coverage',
      minWidth: 15,
      formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 10 }),
    });
    // │ core │ ████████░░ 82% │
    // │ cli  │ ████░░░░░░ 47% │
    ```

    **`ProgressBar` options:**

    | Option | Type | Default | Description |
    |--------|------|---------|-------------|
    | `width` | `number` | `10` | Bar character width |
    | `filled` | `string` | `'█'` | Filled portion character |
    | `empty` | `string` | `'░'` | Empty portion character |
    | `showPercent` | `boolean` | `true` | Append `65%` label |
    | `label` | `string` | auto | Override with custom label e.g. `'3/5'` |

### Test Coverage

-   Added `tests/formatter.test.ts` — 7 tests covering value transformation, header protection, row-index delivery, conditional formatting, and color interop.
-   Added `tests/progressbar.test.ts` — 13 tests (11 unit + 2 table integration). `ProgressBar.ts` at **100% statements / 100% branches / 100% functions**.
-   Total test suite: **183 tests, 20 suites** (up from 170/18).


## [1.2.1] - 2026-02-17

### Enhancements
-   **Documentation**: Updated README with SQL Integration guide, CSV Parser examples, and revised feature list.


## [1.2.0] - 2026-02-17

### Major Features
-   **SQL Integration**: Added `SqlDataSource` adapter for `AsyncInteractiveTable` using `better-sqlite3`. Browse real database tables with pagination, sorting, and filtering.
-   **CSV Parser**: Added `CsvTable.from()` to parse CSV strings into `Table` objects, with support for quoted fields, custom delimiters, and header detection.

### Enhancements
-   **CLI**: Updated help text with `--format` and `--interactive` documentation.
-   **Test Coverage**: Doubled test suite from 80 → 162 tests across 18 suites. 16 modules at 100% line coverage.
    -   `Table.ts`: 70% → 99%
    -   `Aggregations.ts`: 58% → 100%
    -   `CrossTab.ts`: 88% → 100%
    -   `PivotTable.ts`: 76% → 97%
    -   `json.ts`: 50% → 100%
    -   `csv.ts`: 86% → 100%
    -   `colors.ts`: 83% → 100%
    -   `mergeUtils.ts`: 89% → 100%
    -   `Row.ts`: 93% → 100%
    -   `StringRenderer.ts`: 85% → 97%
    -   `StreamRenderer.ts`: 13% → 100%
    -   `Heatmap.ts`: 80% → 100%
    -   `Theme.ts`: 77% → 100%
    -   `textUtils.ts`: 81% → 95%
    -   `LayoutManager.ts`: 87% → 92%

### Fixes
-   **CsvTable.from()**: Fixed critical bug where CLI referenced a non-existent method for CSV parsing.

## [1.1.0] - 2026-02-17

### Major Features
-   **Async Interactive Table**: Handle large datasets via `AsyncInteractiveTable` and `IDataSource` (paginated loading).
-   **CLI Enhancements**: Added `--interactive` flag for piped data and auto-detection for CSV input.

## [1.0.0] - 2026-02-16

### Major Features
-   **Interactive TUI**: Advanced interactive mode with Search (`/`), Filter, Row Selection (`Space`), and Column Toggling (`c`).
-   **Visualizations**: Added `Sparkline` (bar charts) and `Heatmap` (conditional coloring) utilities.
-   **Data Analysis**: Added `PivotTable` and `CrossTab` generation tools.
-   **Integrations**: Added `HtmlTable` scraper and `JSX` factory for declarative table config.

### Enhancements
-   **Advanced Borders**: Added `doubleHeader` and `thinRounded` themes.
-   **Exports**: Improved HTML, CSV, and JSON export capabilities.
-   **Responsive Layout**: Better handling of terminal resizing and column hiding.
-   **Developer Experience**: Added `Table.getPages()`, `Table.export()`, and improved type definitions.

### Fixes
-   Fixed input handling in TUI mode (slash key, backspace).
-   Resolved row selection logic with indices.
-   Fixed terminal wrapping issues in responsive mode.
