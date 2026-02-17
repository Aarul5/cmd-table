# Changelog

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
