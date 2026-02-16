import * as readline from 'readline';
import { Table } from './Table';
import { Row } from './Row';

export interface IInteractiveOptions {
    pageSize?: number;
    onSelect?: (selected: any[]) => void;
    onExit?: () => void;
}

export class InteractiveTable {
    private table: Table;
    private pageSize: number;
    private currentPage: number = 1;
    private sortColumnIndex: number = 0;
    private sortDirection: 'asc' | 'desc' = 'asc';
    private rl: readline.Interface;

    // TUI State
    private mode: 'nav' | 'search' = 'nav';
    private searchQuery: string = '';
    private selectedRows: Set<Row> = new Set();
    private displayedRows: Row[] = [];
    private onSelect?: (selected: any[]) => void;
    private onExit?: () => void;

    constructor(table: Table, options: IInteractiveOptions = {}) {
        this.table = table;
        this.pageSize = options.pageSize || 10;
        // @ts-ignore
        this.onSelect = options.onSelect;
        // @ts-ignore
        this.onExit = options.onExit;

        this.displayedRows = [...this.table.rows];

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

        // Initial filter/sort apply
        this.applyFilterAndSort();
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
        // Global Exit (only in nav mode or Ctrl+C)
        if (key.name === 'c' && key.ctrl) {
            this.stop();
            return;
        }

        if (this.mode === 'nav' && key.name === 'q') {
            this.stop();
            return;
        }

        if (this.mode === 'search') {
            this.handleSearchInput(str, key);
            return;
        }

        // Check for slash explicitly if key.name is undefined
        if ((key.name === 'slash' || str === '/') && this.mode === 'nav') {
            this.mode = 'search';
            this.searchQuery = '';
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
            case 's':
                this.toggleSort();
                break;
            case 'space': // Select All Matching? Or just current page?
                // For this version: Toggle select all visible rows
                // Limitation: Without a cursor, we can't select single rows easily.
                // Let's implement: Space = Add ALL currently displayed rows to selection
                // If all already selected, deselect them.
                const allSelected = this.displayedRows.every(r => this.selectedRows.has(r));
                if (allSelected) {
                    this.displayedRows.forEach(r => this.selectedRows.delete(r));
                } else {
                    this.displayedRows.forEach(r => this.selectedRows.add(r));
                }
                this.render();
                break;
            case 'return': // Enter -> Action
            case 'enter':
                if (this.onSelect) {
                    // Return explicitly selected rows, OR current view if none selected
                    const selected = Array.from(this.selectedRows);
                    const result = selected.length > 0 ? selected : this.displayedRows;
                    this.stop();
                    this.onSelect(result.map(r => r.getData()));
                }
                break;
            case 'escape':
                if (this.searchQuery) {
                    this.searchQuery = '';
                    this.applyFilterAndSort();
                    this.render();
                } else if (this.selectedRows.size > 0) {
                    this.selectedRows.clear(); // Clear selection on Esc if no search
                    this.render();
                }
                break;
        }
    }

    private handleSearchInput(str: string, key: readline.Key): void {
        if (key.name === 'return' || key.name === 'enter') {
            this.mode = 'nav';
            this.render();
            return;
        }

        if (key.name === 'escape') {
            this.mode = 'nav';
            this.searchQuery = '';
            this.applyFilterAndSort();
            this.render();
            return;
        }

        if (key.name === 'backspace') {
            this.searchQuery = this.searchQuery.slice(0, -1);
        } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
            // Only accept printable characters
            this.searchQuery += str;
        }

        this.applyFilterAndSort();
        this.render();
    }

    private applyFilterAndSort(): void {
        let rows = [...this.table.rows];

        // 1. Filter
        if (this.searchQuery) {
            const lower = this.searchQuery.toLowerCase();
            rows = rows.filter(row => {
                return row.cells.some(cell => String(cell.content).toLowerCase().includes(lower));
            });
        }

        // 2. Sort
        // (Existing sort logic from table is mutation-based, which is tricky for views)
        // We should sort the *view* indices? 
        // For now, let's use the Table's sort but on our local copy? 
        // Table.rows is public. 
        // Actually, Table.sort sorts in place. 
        // Let's assume for this TUI we handle sorting on displayedRows.
        if (this.sortColumnIndex >= 0) {
            const col = this.table.columns[this.sortColumnIndex];
            if (col) {
                rows.sort((a, b) => {
                    const valA = a.cells[this.sortColumnIndex]?.content ?? '';
                    const valB = b.cells[this.sortColumnIndex]?.content ?? '';
                    const numA = Number(valA);
                    const numB = Number(valB);

                    if (!isNaN(numA) && !isNaN(numB)) {
                        return this.sortDirection === 'asc' ? numA - numB : numB - numA;
                    }
                    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }
        }

        this.displayedRows = rows;
        this.currentPage = 1; // Reset to page 1 on filter change
    }

    private nextPage(): void {
        const totalPages = Math.ceil(this.displayedRows.length / this.pageSize);
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
        // Toggle direction or switch column?
        // Let's switch direction for now
        if (this.sortDirection === 'asc') {
            this.sortDirection = 'desc';
        } else {
            this.sortDirection = 'asc';
        }
        this.applyFilterAndSort();
        this.render();
    }

    private render(): void {
        this.clearScreen();
        console.log('--- Interactive Table (Advanced) ---');
        console.log(`keys: [Right] Next | [Left] Prev | [s] Sort | [/] Search | [Space] Select All | [Enter] Confirm\n`);

        // Create a temporary table for rendering the current page
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageRows = this.displayedRows.slice(start, end);

        // Clone table for view
        const viewTable = new Table({
            columns: this.table.columns.map(c => ({ ...c })),
            theme: this.table.theme,
            compact: this.table.compact,
            terminalWidth: this.table.terminalWidth || process.stdout.columns || 80,
            responsiveMode: this.table.responsiveMode
        });

        // Add rows with highlighting
        // We need to clone the rows/cells to avoid mutating the original table
        viewTable.rows = pageRows.map(row => {
            const isSelected = this.selectedRows.has(row);
            if (!isSelected) return row;

            // Clone and highlight
            const nextRow = new Row(row.getData(), viewTable);
            nextRow.cells = row.cells.map(c => {
                // Simple Green Color for Selection
                return { ...c, content: `\x1b[32m${c.content}\x1b[0m` } as any;
            });
            return nextRow;
        });

        viewTable.footer = this.table.footer;

        console.log(viewTable.render());

        // Status Bar
        const total = this.displayedRows.length;
        const selectedCount = this.selectedRows.size;
        const maxPage = Math.ceil(total / this.pageSize) || 1;

        let status = `\nPage ${this.currentPage}/${maxPage} | Items: ${total}`;
        if (selectedCount > 0) status += ` | \x1b[32mSelected: ${selectedCount}\x1b[0m`;
        if (this.searchQuery) status += ` | Filter: "${this.searchQuery}"`;
        if (this.sortColumnIndex >= 0) status += ` | Sort: ${this.table.columns[this.sortColumnIndex]?.name} (${this.sortDirection})`;

        console.log(status);

        // Search Prompt
        if (this.mode === 'search') {
            process.stdout.write(`\nSearch > ${this.searchQuery}`);
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
