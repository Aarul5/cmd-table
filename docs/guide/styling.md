# Styling & Themes

## Built-in Themes

cmd-table ships with 7 themes. Set a theme via the constructor:

```ts
import { Table, BUILTIN_THEMES } from 'cmd-table';

const table = new Table({ theme: BUILTIN_THEMES.double });
```

### Theme Gallery

| Theme | Corners | Borders | Best For |
|---|---|---|---|
| `rounded` | `╭╮╰╯` | `─│` | Default — clean and modern |
| `honeywell` | `┌┐└┘` | `─│` | Traditional box drawing |
| `double` | `╔╗╚╝` | `═║` | Bold, prominent tables |
| `doubleHeader` | `╔╗├┤└┘` | `═─│` | Double header, single body |
| `bold` | `┏┓┗┛` | `━┃` | Thick borders |
| `dots` | `·` | `·:` | Minimal, lightweight |
| `void` | *(none)* | *(none)* | Borderless — data only |
| `thinRounded` | `╭╮╰╯` | `─│` | Compact rounded |

### Theme Examples

**Rounded (Default):**
```
╭───────┬──────╮
│ Name  │ Role │
├───────┼──────┤
│ Alice │ Dev  │
╰───────┴──────╯
```

**Double:**
```
╔═══════╦══════╗
║ Name  ║ Role ║
╠═══════╬══════╣
║ Alice ║ Dev  ║
╚═══════╩══════╝
```

**Void (Borderless):**
```
 Name   Role
 Alice  Dev
 Bob    PM
```

You can also use the pre-imported theme constants:

```ts
import { THEME_Rounded, THEME_DoubleLine, THEME_BoldBox, THEME_Dots, THEME_Void } from 'cmd-table';

const table = new Table({ theme: THEME_DoubleLine });
```

## Colors

### Header Color

Override the default magenta header with any ANSI color:

```ts
const table = new Table({ headerColor: 'blue' });
```

### Column Colors

Set a color per column — applied to all cells in that column:

```ts
table.addColumn({ name: 'Error Count', color: 'red' });
table.addColumn({ name: 'Success Rate', color: 'green' });
table.addColumn({ name: 'Warning', color: 'yellow' });
```

### Available Colors

| Text Colors | Background Colors | Modifiers |
|---|---|---|
| `black` | `bgBlack` | `bold` |
| `red` | `bgRed` | `dim` |
| `green` | `bgGreen` | `italic` |
| `yellow` | `bgYellow` | `underline` |
| `blue` | `bgBlue` | `inverse` |
| `magenta` | `bgMagenta` | `hidden` |
| `cyan` | `bgCyan` | `strikethrough` |
| `white` | `bgWhite` | `reset` |
| `gray` | | |

### Direct Color Usage

You can also use the `colorize` utility directly:

```ts
import { colorize } from 'cmd-table';

table.addRow({
    Status: colorize('CRITICAL', 'red'),
    Count: colorize('42', 'bold')
});
```

## Conditional Row Coloring

You can apply an ANSI color to an entire row dynamically based on the row's data using the `rowColor` callback option.

```ts
const table = new Table({
    rowColor: (row, index) => {
        if (Number(row.Amount) >= 500) return 'green';
        if (Number(row.Amount) >= 100) return 'yellow';
        return 'red';
    }
});
table.addColumn('Name');
table.addColumn('Amount');

table.addRows([
    { Name: 'Alice', Amount: 600 },  // Entire row is green
    { Name: 'Bob', Amount: 150 },    // Entire row is yellow
    { Name: 'Charlie', Amount: 50 }  // Entire row is red
]);
```

- The `rowColor` callback receives the row data (`Record<string, any>`) and the zero-based `index`.
- The header row is **never** colored by `rowColor`.
- Returning `undefined` leaves the row unstyled (or uses `zebra` styling if enabled).

## Zebra Striping

Dim alternating rows for better readability in large tables:

```ts
const table = new Table({ zebra: true });
table.addColumn('Name');
table.addColumn('Department');

table.addRows([
    { Name: 'Alice', Department: 'Eng' },
    { Name: 'Bob', Department: 'Eng' },     // ← dimmed
    { Name: 'Charlie', Department: 'HR' },
    { Name: 'Diana', Department: 'HR' }      // ← dimmed
]);
```

## Compact Mode

Remove row separators for a denser layout:

```ts
const table = new Table({ compact: true });
```

**Normal:**
```
├───────┼──────┤
│ Alice │ Dev  │
├───────┼──────┤
│ Bob   │ PM   │
```

**Compact:**
```
│ Alice │ Dev  │
│ Bob   │ PM   │
```

## Manual Border Control (`drawHorizontalLine`)

For ultimate control over which horizontal lines are drawn, use the `drawHorizontalLine` callback. This completely overrides `compact: true` and the `theme`'s default body joins.

The callback receives:
- `index`: the horizontal line number (0 = top-most border)
- `size`: the total number of data rows + headers/footers

```ts
const table = new Table({
    drawHorizontalLine: (index, size) => {
        // 0 = top border
        // 1 = line after header
        // size = bottom border
        return index === 0 || index === 1 || index === size;
    }
});
```

This will produce a table with no horizontal dividers between the data rows themselves.

## Combining Options

Mix and match for the exact look you want:

```ts
const table = new Table({
    theme: BUILTIN_THEMES.doubleHeader,
    headerColor: 'cyan',
    zebra: true,
    compact: true,
    columns: [
        { name: 'ID', align: 'right', width: 5 },
        { name: 'Name', color: 'white' },
        { name: 'Status', color: 'green' }
    ]
});
```
