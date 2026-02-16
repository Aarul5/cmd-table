import { Table, Sparkline, Heatmap, BUILTIN_THEMES } from '../src';

console.log('\n--- Visual Enhancements Demo ---\n');

// 1. Sparklines
console.log('1. Sparklines (Activity Last 7 Days)');
const sparkTable = new Table({
    columns: [
        { name: 'Server', key: 'server', width: 10 },
        { name: 'Load (7d)', key: 'load', width: 20 },
        { name: 'Status', key: 'status', width: 10 }
    ]
});

sparkTable.addRow({ server: 'Alpha', load: Sparkline.generate([10, 20, 30, 40, 50, 80, 20]), status: 'OK' });
sparkTable.addRow({ server: 'Beta', load: Sparkline.generate([80, 90, 80, 95, 100, 90, 80]), status: 'High' });
sparkTable.addRow({ server: 'Gamma', load: Sparkline.generate([10, 10, 20, 10, 5, 10, 15]), status: 'Idle' });
console.log(sparkTable.render());

// 2. Heatmaps
console.log('\n2. Heatmaps (Performance Metrics)');
const heatTable = new Table({
    columns: [
        { name: 'Metric', key: 'metric', width: 15 },
        { name: 'Value', key: 'value', width: 15 }
    ]
});

const metrics = [
    { name: 'CPU', value: 12 },
    { name: 'Memory', value: 45 },
    { name: 'Disk', value: 88 },
    { name: 'Network', value: 95 }
];

metrics.forEach(m => {
    heatTable.addRow({
        metric: m.name,
        value: Heatmap.color(m.value, 0, 100) + '%'
    });
});
console.log(heatTable.render());

// 3. Borders
console.log('\n3. Advanced Borders');

const themes = [
    { name: 'Double Header', theme: BUILTIN_THEMES.doubleHeader },
    { name: 'Thin Rounded', theme: BUILTIN_THEMES.thinRounded },
    { name: 'Dots', theme: BUILTIN_THEMES.dots }
];

themes.forEach(t => {
    console.log(`\nTheme: ${t.name}`);
    const borderTable = new Table({
        theme: t.theme,
        columns: [{ name: 'Col A', key: 'a' }, { name: 'Col B', key: 'b' }]
    });
    borderTable.addRow({ a: 'Data 1', b: 'Data 2' });
    console.log(borderTable.render());
});
