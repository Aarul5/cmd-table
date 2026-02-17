# Visualizations

Go beyond plain text — embed charts, color coding, and hierarchical views directly in table cells.

## Sparklines

Render mini bar charts inside any cell using Unicode block characters.

```ts
import { Table, Sparkline } from 'cmd-table';

const table = new Table();
table.addColumn('Server');
table.addColumn({ name: 'CPU (24h)', width: 25 });
table.addColumn({ name: 'Memory (24h)', width: 25 });

table.addRows([
    {
        Server: 'web-01',
        'CPU (24h)': Sparkline.generate([20, 45, 80, 60, 30, 50, 70, 90]),
        'Memory (24h)': Sparkline.generate([40, 42, 45, 50, 48, 46, 44, 43])
    },
    {
        Server: 'web-02',
        'CPU (24h)': Sparkline.generate([10, 15, 12, 18, 25, 20, 15, 10]),
        'Memory (24h)': Sparkline.generate([60, 65, 70, 72, 68, 64, 62, 60])
    }
]);

console.log(table.render());
```

**The output uses block characters to show trends:**
```
▂▄█▅▃▄▆█
```

### Sparkline API

```ts
Sparkline.generate(values: number[]): string
```

- Input: array of numbers (any range)
- Output: string of block characters (`▁▂▃▄▅▆▇█`)
- Values are scaled relative to the min/max of the array

## Heatmaps

Colorize numeric values on a gradient from red (low) → yellow (mid) → green (high).

```ts
import { Table, Heatmap } from 'cmd-table';

const table = new Table();
table.addColumn('Metric');
table.addColumn('Score');

table.addRows([
    { Metric: 'Uptime',      Score: Heatmap.color(99.9, 0, 100) + '%' },  // Green
    { Metric: 'Latency',     Score: Heatmap.color(45, 0, 100) + 'ms' },   // Yellow
    { Metric: 'Error Rate',  Score: Heatmap.color(12, 0, 100) + '%' },    // Red
    { Metric: 'CPU Usage',   Score: Heatmap.color(78, 0, 100) + '%' }     // Yellow-Green
]);

console.log(table.render());
```

### Heatmap API

```ts
Heatmap.color(value: number, min: number, max: number, mode?: 'fg' | 'bg'): string
```

| Parameter | Description |
|---|---|
| `value` | The numeric value to colorize |
| `min` | Minimum of the range (maps to red) |
| `max` | Maximum of the range (maps to green) |
| `mode` | `'fg'` for text color (default), `'bg'` for background color |

### Auto-Color Mode

Apply heatmap coloring automatically to an entire column:

```ts
const scores = [23, 67, 89, 45, 12, 95];
const colored = Heatmap.autoColor(scores, 0, 100);
// Returns: ['23' (red), '67' (yellow), '89' (green), ...]
```

## Tree View

Visualize hierarchical data with automatic indentation and tree connectors.

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addColumn('Name');
table.addColumn('Size');
table.addColumn('Type');

const fileSystem = [
    {
        Name: 'src', Size: '—', Type: 'dir',
        children: [
            { Name: 'index.ts', Size: '2.1 KB', Type: 'file' },
            { Name: 'Table.ts', Size: '8.5 KB', Type: 'file' },
            {
                Name: 'utils', Size: '—', Type: 'dir',
                children: [
                    { Name: 'colors.ts', Size: '1.2 KB', Type: 'file' },
                    { Name: 'textUtils.ts', Size: '3.0 KB', Type: 'file' }
                ]
            }
        ]
    },
    { Name: 'package.json', Size: '1.8 KB', Type: 'file' },
    { Name: 'README.md', Size: '12 KB', Type: 'file' }
];

table.addTree('Name', fileSystem);
console.log(table.render());
```

**Expected output:**
```
╭──────────────────┬────────┬──────╮
│ Name             │ Size   │ Type │
├──────────────────┼────────┼──────┤
│ src              │ —      │ dir  │
│ ├── index.ts     │ 2.1 KB │ file │
│ ├── Table.ts     │ 8.5 KB │ file │
│ └── utils        │ —      │ dir  │
│     ├── colors.ts│ 1.2 KB │ file │
│     └── textUtils│ 3.0 KB │ file │
│ package.json     │ 1.8 KB │ file │
│ README.md        │ 12 KB  │ file │
╰──────────────────┴────────┴──────╯
```

### Tree API

```ts
table.addTree(indentColumn: string, data: TreeNode[])
```

- `indentColumn`: which column receives the tree prefixes
- Each node can have a `children` array for nesting (unlimited depth)

## Auto-Merge (Vertical Grouping)

Automatically merge identical adjacent cells vertically — great for grouped data:

```ts
import { Table } from 'cmd-table';

const table = new Table();
table.addColumn('Region');
table.addColumn('City');
table.addColumn('Sales');

table.addRows([
    { Region: 'North', City: 'NYC',     Sales: 500 },
    { Region: 'North', City: 'Boston',  Sales: 300 },
    { Region: 'North', City: 'Chicago', Sales: 400 },
    { Region: 'South', City: 'Miami',   Sales: 200 },
    { Region: 'South', City: 'Atlanta', Sales: 350 }
]);

// Merge the 'Region' column — identical adjacent values become one tall cell
table.mergeAdjacent(['Region']);
console.log(table.render());
```

### mergeAdjacent API

```ts
table.mergeAdjacent(columns?: string[])
```

- Pass column names to merge specific columns only
- Omit the argument to merge **all** columns
- Only merges **adjacent** identical values (not scattered ones)
