# Interactive TUI

The `InteractiveTable` turns any table into a full-featured terminal UI with pagination, search, sorting, and row selection — all driven by keyboard shortcuts.

## Basic Usage

```ts
import { Table, InteractiveTable } from 'cmd-table';

const table = new Table();
table.addColumn('ID');
table.addColumn('Name');
table.addColumn('Department');
table.addColumn('Status');

// Add sample data
for (let i = 1; i <= 100; i++) {
    table.addRow({
        ID: i,
        Name: `Employee ${i}`,
        Department: ['Engineering', 'Design', 'Marketing', 'HR'][i % 4],
        Status: i % 3 === 0 ? 'Away' : 'Active'
    });
}

const tui = new InteractiveTable(table, {
    onExit: () => process.exit(0)
});

tui.start();
```

This displays the first page of data with a status bar showing controls.

## Keyboard Controls

| Key | Action |
|---|---|
| `→` or `n` | Next page |
| `←` or `p` | Previous page |
| `s` | Cycle sort column (toggles asc/desc) |
| `/` | Enter search mode — type to filter rows |
| `Space` | Select / deselect all visible rows |
| `Enter` | Confirm selection and exit |
| `Esc` | Clear search filter or clear selection |
| `c` | Toggle column visibility |
| `q` or `Ctrl+C` | Quit |

## Handling Row Selection

Use the `onSelect` callback to capture selected rows:

```ts
const tui = new InteractiveTable(table, {
    onSelect: (selectedRows) => {
        console.log(`Selected ${selectedRows.length} rows:`);
        selectedRows.forEach(row => {
            console.log(`  - ${row.cells[1].content}`);
        });
        process.exit(0);
    },
    onExit: () => {
        console.log('Exited without selection.');
        process.exit(0);
    }
});

tui.start();
```

**Workflow:**
1. Browse pages with `←` / `→`
2. Press `Space` to select/deselect visible rows
3. Press `Enter` to confirm — `onSelect` is called with selected rows
4. Press `q` to quit — `onExit` is called

## Search & Filtering

1. Press `/` to enter search mode
2. Type your query — rows are filtered in real-time
3. Press `Esc` to clear the filter and return to the full dataset

The search matches against **all columns** and is case-insensitive.

## Try It

Run the included demo scripts:

```bash
# Basic interactive table
npx ts-node examples/interactive_table.ts

# Large dataset (1000+ rows)
npx ts-node examples/large_table.ts
```

## Configuration Options

| Option | Type | Description |
|---|---|---|
| `onSelect` | `(rows: Row[]) => void` | Called when user confirms selection with `Enter` |
| `onExit` | `() => void` | Called when user quits with `q` or `Ctrl+C` |
| `pageSize` | `number` | Rows per page (default: fits terminal height) |
