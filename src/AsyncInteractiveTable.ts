import { Table } from './Table';
import { Row } from './Row';
import { IDataSource } from './IDataSource';
import * as readline from 'readline';

export interface IAsyncInteractiveOptions {
    pageSize?: number;
    onSelect?: (selected: any[]) => void;
    onExit?: () => void;
}

export class AsyncInteractiveTable {
    private dataSource: IDataSource;
    private table: Table; // Template table for columns/theme
    private pageSize: number;
    private currentPage: number = 1;
    private totalRows: number = 0;

    private sortColumn: string | null = null;
    private sortDirection: 'asc' | 'desc' = 'asc';

    private rl: readline.Interface;
    private mode: 'nav' | 'filter' = 'nav';
    private filterQuery: string = '';

    private onSelect?: (selected: any[]) => void;
    private onExit?: () => void;

    // Cache current page data
    private currentRows: any[] = [];
    private isLoading: boolean = false;

    constructor(dataSource: IDataSource, tableTemplate: Table, options: IAsyncInteractiveOptions = {}) {
        this.dataSource = dataSource;
        this.table = tableTemplate;
        this.pageSize = options.pageSize || 10;
        // @ts-ignore
        this.onSelect = options.onSelect;
        // @ts-ignore
        this.onExit = options.onExit;

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public async start(): Promise<void> {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        readline.emitKeypressEvents(process.stdin);
        process.stdin.on('keypress', this.handleKey.bind(this));

        await this.refreshData();
        this.render();
        process.stdout.on('resize', () => this.render());
    }

    private async refreshData() {
        this.isLoading = true;
        this.render(); // Show loading

        try {
            await this.dataSource.count().then(c => this.totalRows = c);
            const offset = (this.currentPage - 1) * this.pageSize;
            this.currentRows = await this.dataSource.getRows(offset, this.pageSize);
        } catch (e) {
            console.error('Error fetching data:', e);
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    private clearScreen(): void {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }

    private handleKey(str: string, key: readline.Key): void {
        if (this.isLoading) return; // Block input while loading

        // Global Exit
        if (key.name === 'c' && key.ctrl) {
            this.stop();
            return;
        }

        if (this.mode === 'nav' && key.name === 'q') {
            this.stop();
            return;
        }

        if (this.mode === 'filter') {
            this.handleFilterInput(str, key);
            return;
        }

        if ((key.name === 'slash' || str === '/') && this.mode === 'nav') {
            this.mode = 'filter';
            this.filterQuery = '';
            this.render();
            return;
        }

        switch (key.name) {
            case 'n':
            case 'right':
                this.nextPage();
                break;
            case 'p':
            case 'left':
                this.prevPage();
                break;
            case 'enter':
            case 'return':
                // For now, exit on enter
                this.stop();
                break;
        }
    }

    private handleFilterInput(str: string, key: readline.Key): void {
        if (key.name === 'return' || key.name === 'enter') {
            this.mode = 'nav';
            if (this.dataSource.filter) {
                this.dataSource.filter(this.filterQuery);
                this.currentPage = 1;
                this.refreshData();
            } else {
                this.render();
            }
            return;
        }

        if (key.name === 'escape') {
            this.mode = 'nav';
            this.filterQuery = '';
            if (this.dataSource.filter) {
                this.dataSource.filter('');
                this.currentPage = 1;
                this.refreshData();
            }
            return;
        }

        if (key.name === 'backspace') {
            this.filterQuery = this.filterQuery.slice(0, -1);
        } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
            this.filterQuery += str;
        }

        this.render();
    }

    private nextPage(): void {
        const maxPage = Math.ceil(this.totalRows / this.pageSize);
        if (this.currentPage < maxPage) {
            this.currentPage++;
            this.refreshData();
        }
    }

    private prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.refreshData();
        }
    }

    private render(): void {
        this.clearScreen();
        console.log('--- Async Interactive Table ---');
        console.log(`keys: [Right] Next | [Left] Prev | [/] Filter | [q] Quit\n`);

        if (this.isLoading) {
            console.log('\n   Loading data...\n');
            return;
        }

        // Create view table
        const viewTable = new Table({
            columns: this.table.columns.map(c => ({ ...c })),
            theme: this.table.theme,
            compact: this.table.compact,
            terminalWidth: this.table.terminalWidth || process.stdout.columns || 80
        });

        this.currentRows.forEach(row => viewTable.addRow(row));
        console.log(viewTable.render());

        const maxPage = Math.ceil(this.totalRows / this.pageSize) || 1;
        let status = `\nPage ${this.currentPage}/${maxPage} | Total: ${this.totalRows}`;
        if (this.filterQuery) status += ` | Filter: "${this.filterQuery}"`;

        console.log(status);

        if (this.mode === 'filter') {
            process.stdout.write(`\nFilter > ${this.filterQuery}`);
        }
    }

    public stop(): void {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        this.rl.close();
        if (this.onExit) this.onExit();
        else process.exit(0);
    }
}
