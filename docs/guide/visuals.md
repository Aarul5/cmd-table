# Visualizations

## Sparklines

Render mini bar charts inside cells.

```typescript
import { Sparkline } from 'cmd-table';

table.addRow({
    history: Sparkline.generate([10, 50, 90, 40, 20]) // Output:  ▄█▄▂
});
```

## Heatmaps

Colorize values based on a range (Low=Red, Mid=Yellow, High=Green).

```typescript
import { Heatmap } from 'cmd-table';

table.addRow({
    efficiency: Heatmap.color(85, 0, 100) + '%' // Green text
});
```

## Tree View (Hierarchical Data)

Visualize nested data structures like file systems or org charts.

```ts
const files = [
  { Name: 'src', Size: '-', children: [{ Name: 'index.ts', Size: '2KB' }] },
  { Name: 'package.json', Size: '1KB' }
];

table.addTree('Name', files);
console.log(table.render());
```
