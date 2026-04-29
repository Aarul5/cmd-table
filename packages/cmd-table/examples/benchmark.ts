import { Table } from '../src';
import { StreamRenderer } from '../src/renderers/StreamRenderer';

function generateData(rows: number) {
    const data = [];
    for (let i = 0; i < rows; i++) {
        data.push({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            role: i % 3 === 0 ? 'Admin' : 'User',
            active: i % 2 === 0 ? 'Yes' : 'No',
            lastLogin: new Date().toISOString(),
            notes: 'Some long text to test wrapping and memory usage ' + i
        });
    }
    return data;
}

function runBenchmark(rowCount: number, stream: boolean = false) {
    console.log(`\n--- Benchmarking ${rowCount} rows (Stream: ${stream}) ---`);

    const startMem = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    const data = generateData(rowCount);

    const table = new Table({
        columns: [
            { name: 'ID', key: 'id' },
            { name: 'Name', key: 'name' },
            { name: 'Email', key: 'email' },
            { name: 'Role', key: 'role' },
            { name: 'Active', key: 'active' },
            { name: 'Last Login', key: 'lastLogin' },
            { name: 'Notes', key: 'notes' }
        ]
    });

    if (stream) {
        // Stream doesn't load all rows into Table at once usually, 
        // but for this test we'll add them to table to test Renderer speed mainly
        // Or strictly we should feed them one by one.
        // Let's test Table overhead first.
        data.forEach(r => table.addRow(r));
    } else {
        data.forEach(r => table.addRow(r));
    }

    const dataLoadedTime = performance.now();
    console.log(`Data Load Time: ${(dataLoadedTime - startTime).toFixed(2)}ms`);

    // Render
    let output = '';
    if (stream) {
        // Mock stream output
        const renderer = new StreamRenderer(table);
        // This is not quite right for benchmark, StreamRenderer expects manual calls
        // Let's just output table.render() for now as baseline
        output = table.render();
    } else {
        output = table.render();
    }

    const endTime = performance.now();
    const endMem = process.memoryUsage().heapUsed;

    console.log(`Render Time: ${(endTime - dataLoadedTime).toFixed(2)}ms`);
    console.log(`Total Time: ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`Memory Delta: ${((endMem - startMem) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Output Length: ${output.length} chars`);
}

// Run
async function main() {
    // Warmup
    runBenchmark(100);

    await new Promise(r => setTimeout(r, 1000));
    runBenchmark(1000);

    await new Promise(r => setTimeout(r, 1000));
    runBenchmark(10000);

    // 50k might be slow / OOM depending on env
    await new Promise(r => setTimeout(r, 1000));
    runBenchmark(50000);
}

main();
