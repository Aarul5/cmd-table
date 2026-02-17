#!/usr/bin/env node
import { Table } from './Table';
import { getTheme, ThemeName } from './themes/Theme';
import * as fs from 'fs';

// Simple arg parser
// Usage: cli-table --theme=rounded --columns=name,age < data.json
const args = process.argv.slice(2);
const options: Record<string, string> = {};

args.forEach(arg => {
    if (arg === '--help' || arg === '-h') {
        console.log(`
Usage:
  cat data.json | cmd-table [options]

Options:
  --help, -h      Show this help message
  --theme=NAME    Set table theme (rounded, honeywell, double, etc.)
  --columns=...   Comma-separated list of columns to show
  --headerColor   Color for header text
`);
        process.exit(0);
    }
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        options[key] = value || 'true';
    }
});

function readStdin(): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        const stdin = process.stdin;

        if (stdin.isTTY) {
            // If no input piped, show help or just resolve empty?
            // Resolve empty to allow args-only usage if we ever support it
            resolve('');
            return;
        }

        stdin.setEncoding('utf8');
        stdin.on('data', chunk => data += chunk);
        stdin.on('end', () => resolve(data));
        stdin.on('error', reject);
    });
}

async function main() {
    try {
        const input = await readStdin();
        if (!input) {
            console.error('No input provided. Pipe JSON/CSV data to this tool.');
            process.exit(1);
        }

        let data: any[] = [];
        let isCsv = options.format === 'csv';

        // Auto-detect CSV if not specified
        if (!options.format && input.trim().startsWith('{') === false && input.trim().startsWith('[') === false) {
            // Heuristic: if it doesn't look like JSON, assume CSV
            isCsv = true;
        }

        if (isCsv) {
            // Import lazily or use existing import
            const { CsvTable } = require('./integrations/csv');
            const table = CsvTable.from(input, { hasHeader: true, delimiter: ',' });

            // Extract raw data from table for interactive mode? 
            // Actually CsvTable.from returns a Table with Rows.
            // For interactive mode we might need raw data array if we want to use AsyncInteractiveTable 
            // OR we use the InteractiveTable (sync) for piped data since it's already in memory.

            if (options.interactive) {
                const { InteractiveTable } = require('./InteractiveTable');
                const interactive = new InteractiveTable(table, {
                    pageSize: 10,
                    onExit: () => process.exit(0)
                });
                interactive.start();
                return;
            }

            console.log(table.render());
            return;
        }

        // JSON handling
        try {
            data = JSON.parse(input);
        } catch (e) {
            console.error('Failed to parse input as JSON. Use --format=csv for CSV data.');
            process.exit(1);
        }

        if (!Array.isArray(data)) {
            if (typeof data === 'object') {
                data = [data];
            } else {
                console.error('Input must be a JSON array or object.');
                process.exit(1);
            }
        }

        const table = new Table();

        // Apply options
        if (options.theme) {
            table.theme = getTheme(options.theme as ThemeName) || getTheme('rounded');
        }

        if (options.columns) {
            const cols = options.columns.split(',');
            cols.forEach(c => table.addColumn(c.trim()));
        } else if (data.length > 0) {
            // Auto-detect columns from first row
            Object.keys(data[0]).forEach(k => table.addColumn(k));
        }

        if (options.headerColor) {
            table.headerColor = options.headerColor;
        }

        data.forEach(row => table.addRow(row));

        if (options.interactive) {
            const { InteractiveTable } = require('./InteractiveTable');
            const interactive = new InteractiveTable(table, {
                pageSize: 10,
                onExit: () => process.exit(0)
            });
            interactive.start();
        } else {
            console.log(table.render());
        }

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

main();
