# Interactive TUI

Build interactive terminal interfaces using `cmd-table`.

Use the built-in `InteractiveTable` class for instant pagination and sorting features without boilerplate. **This is the recommended way to display large datasets.**

## Usage

```ts
import { Table, InteractiveTable } from 'cmd-table';

const table = new Table();
// ... add hundreds of rows ...

// Advanced Usage: Handle Selection
const interactive = new InteractiveTable(table, {
    onSelect: (rows) => {
        console.log('Selected:', rows);
        process.exit(0);
    },
    onExit: () => process.exit(0)
});

interactive.start();
```

## Controls

| Key | Action |
| :--- | :--- |
| `Right` / `n` | Next Page |
| `Left` / `p` | Previous Page |
| `s` | Sort by Column (Cycle) |
| `/` | **Search / Filter Rows** |
| `Space` | **Select / Deselect Visible Rows** |
| `Enter` | **Confirm Selection & Exit** |
| `Esc` | Clear Search / Clear Selection |
| `q` / `Ctrl+C` | Quit |
