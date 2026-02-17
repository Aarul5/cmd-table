# Changelog

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
