# Styling & Themes

## Themes

`cmd-table` comes with several built-in themes.

```ts
import { Table, BUILTIN_THEMES } from 'cmd-table';

const table = new Table({
  theme: BUILTIN_THEMES.doubleHeader, // Apply theme globally
});
```

**Available built-ins:**
- `rounded` (Default)
- `honeywell`
- `double` / `doubleHeader`
- `bold`
- `dots`
- `void` (No borders)
- `thinRounded`

## Custom Colors

Customize colors for headers and specific columns.

```ts
const table = new Table({
  headerColor: 'blue', // Override default magenta
});

table.addColumn({ name: 'Error', color: 'red' });
table.addColumn({ name: 'Warning', color: 'yellow' });
```
