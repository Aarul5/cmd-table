import * as readline from 'readline';
import { Table } from './Table';

export interface IInteractiveOptions {
    pageSize?: number;
}

export class InteractiveTable {
    private table: Table;
    private pageSize: number;
    private currentPage: number = 1;
    private sortColumnIndex: number = 0;
    private sortDirection: 'asc' | 'desc' = 'asc';
    private rl: readline.Interface;

    constructor(table: Table, options: IInteractiveOptions = {}) {
        this.table = table;
        this.pageSize = options.pageSize || 10;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public start(): void {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        readline.emitKeypressEvents(process.stdin);

        process.stdin.on('keypress', this.handleKey.bind(this));

        this.render();
        process.stdout.on('resize', () => this.render());
    }

    private clearScreen(): void {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }

    private handleKey(str: string, key: readline.Key): void {
        if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
            this.stop();
        } else if (key.name === 'n' || key.name === 'right') {
            this.nextPage();
        } else if (key.name === 'p' || key.name === 'left') {
            this.prevPage();
        } else if (key.name === 's') {
            this.toggleSort();
        } else if (key.name === 'up' || key.name === 'down') {
            // Future: Navigate rows?
        }
    }

    private nextPage(): void {
        const totalPages = Math.ceil(this.table.rows.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.render();
        }
    }

    private prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    }

    private toggleSort(): void {
        // Simple rotation through columns for demo? 
        // Or just sort current column?
        // Let's stick to the example behavior: Sort by FIRST column for now, 
        // but maybe allow cycling columns in future.
        // For now, let's just reverse the sort on the first column for simplicity 
        // as per the requirement "toggle sort". 
        // Actually, let's make it robust: Cycle through columns with 'c' or 'tab'?
        // The user request was "why manual work", so we should replicate the manual example's feature set first.
        // Example sorted by "Name" (index 1 in example).

        const col = this.table.columns[this.sortColumnIndex];
        if (this.sortDirection === 'asc') {
            this.sortDirection = 'desc';
        } else {
            this.sortDirection = 'asc';
        }
        this.table.sort(col.name, this.sortDirection);
        this.render();
    }

    private render(): void {
        this.clearScreen();
        console.log('--- Interactive Table ---');
        console.log('Keys: [n/Right] Next, [p/Left] Prev, [s] Sort, [q] Quit\n');

        const page = this.table.paginate(this.currentPage, this.pageSize);
        console.log(page.render());

        console.log(`\nPage ${this.currentPage} of ${Math.ceil(this.table.rows.length / this.pageSize)} | Items: ${this.table.rows.length}`);
    }

    public stop(): void {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        this.rl.close();
        process.exit(0);
    }
}
