import { Table, addTree, mergeAdjacent } from '../src';

console.log('--- 1. Tree Visualization (File System) ---');
console.log('Demonstrates `addTree` utility for hierarchical data.\n');

const treeTable = new Table();
treeTable.addColumn('Name'); // First column defaults to Cyan
treeTable.addColumn('Size');
treeTable.addColumn('Type');

const fileSystem = [
    {
        Name: 'src', Size: '-', Type: 'Folder',
        children: [
            { Name: 'index.ts', Size: '2KB', Type: 'File' },
            {
                Name: 'utils', Size: '-', Type: 'Folder',
                children: [
                    { Name: 'colors.ts', Size: '1KB', Type: 'File' },
                    { Name: 'treeUtils.ts', Size: '1.5KB', Type: 'File' }
                ]
            },
            { Name: 'cli.ts', Size: '3KB', Type: 'File' }
        ]
    },
    { Name: 'package.json', Size: '1KB', Type: 'File' },
    { Name: 'README.md', Size: '5KB', Type: 'File' }
];

addTree(treeTable, 'Name', fileSystem);
console.log(treeTable.render());


console.log('\n--- 2. Auto-Merge (Weekly Schedule) ---');
console.log('Demonstrates `mergeAdjacent` utility to combine identical vertical cells.\n');

const mergeTable = new Table();
mergeTable.addColumn('Day');
mergeTable.addColumn('Time');
mergeTable.addColumn('Activity');

// Add rows normally
mergeTable.addRows([
    { Day: 'Monday', Time: '09:00', Activity: 'Standup' },
    { Day: 'Monday', Time: '10:00', Activity: 'Coding' },
    { Day: 'Monday', Time: '11:00', Activity: 'Coding' }, // Will merge 'Day'

    { Day: 'Tuesday', Time: '09:00', Activity: 'Standup' },
    { Day: 'Tuesday', Time: '10:00', Activity: 'Design' },

    { Day: 'Wednesday', Time: '09:00', Activity: 'Standup' },
    { Day: 'Wednesday', Time: '10:00', Activity: 'Meeting' }
]);

// Apply merge to 'Day' and 'Activity' columns
// Note: 'Coding' on Monday 10:00 and 11:00 are adjacent in 'Activity' column? 
// Yes, they are rows 1 and 2. 
mergeAdjacent(mergeTable, ['Day']);

console.log(mergeTable.render());
