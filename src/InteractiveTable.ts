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
    private mode: 'nav' | 'search' | 'columns' = 'nav';
    private searchQuery: string = '';
    private selectedRows: Set<Row> = new Set();
    private displayedRows: Row[] = [];
    private hiddenColumns: Set<string> = new Set(); // Store column keys or names
    private columnSelectionIndex: number = 0;

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

        if (this.mode === 'columns') {
            this.handleColumnSelection(str, key);
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
            case 'c': // Switch to Columns Mode
                this.mode = 'columns';
                this.columnSelectionIndex = 0;
                this.render();
                break;
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
            case 'space':
                // Toggle select all visible rows
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
                    const selected = Array.from(this.selectedRows);
                    const result = selected.length > 0 ? selected : this.displayedRows;
                    this.stop();
                    // Return *all* data, regardless of hidden columns? Usually yes.
                    this.onSelect(result.map(r => r.getData()));
                }
                break;
            case 'escape':
                if (this.searchQuery) {
                    this.searchQuery = '';
                    this.applyFilterAndSort();
                    this.render();
                } else if (this.selectedRows.size > 0) {
                    this.selectedRows.clear();
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
            this.searchQuery += str;
        }

        this.applyFilterAndSort();
        this.render();
    }

    private handleColumnSelection(str: string, key: readline.Key): void {
        if (key.name === 'escape' || key.name === 'return' || key.name === 'enter') {
            this.mode = 'nav';
            this.render();
            return;
        }

        const maxIdx = this.table.columns.length - 1;

        if (key.name === 'up') {
            this.columnSelectionIndex = Math.max(0, this.columnSelectionIndex - 1);
            this.render();
        } else if (key.name === 'down') {
            this.columnSelectionIndex = Math.min(maxIdx, this.columnSelectionIndex + 1);
            this.render();
        } else if (key.name === 'space') {
            const col = this.table.columns[this.columnSelectionIndex];
            const colKey = col.key || col.name; // Use key or name as ID
            if (this.hiddenColumns.has(colKey)) {
                this.hiddenColumns.delete(colKey);
            } else {
                this.hiddenColumns.add(colKey);
            }
            this.render();
        }
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
        this.currentPage = 1;
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
        if (this.mode === 'columns') {
            this.renderColumnSelection();
            return;
        }

        console.log('--- Interactive Table (Advanced) ---');
        console.log(`keys: [Right] Next | [Left] Prev | [s] Sort | [/] Search | [c] Columns | [Space] Select | [Enter] Confirm\n`);

        // Filter visible columns
        const visibleColumns = this.table.columns.filter(c => !this.hiddenColumns.has(c.key || c.name));

        // If no columns visible, show message?
        if (visibleColumns.length === 0) {
            console.log('No columns visible. Press [c] to toggle columns.');
            return;
        }

        // Create a temporary table for rendering the current page
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageRows = this.displayedRows.slice(start, end);

        // Clone table for view
        const viewTable = new Table({
            columns: visibleColumns.map(c => ({ ...c })),
            theme: this.table.theme,
            compact: this.table.compact,
            terminalWidth: this.table.terminalWidth || process.stdout.columns || 80,
            responsiveMode: this.table.responsiveMode
        });

        // Add rows with highlighting
        // We need to map original row cells to valid visible columns
        // This is tricky because 'Row.cells' is an array corresponding to original columns logic.
        // We need to filter cells based on the SAME indices as visibleColumns.

        // Map original column indices to keep
        const validIndices = this.table.columns
            .map((c, i) => !this.hiddenColumns.has(c.key || c.name) ? i : -1)
            .filter(i => i !== -1);

        viewTable.rows = pageRows.map(row => {
            const isSelected = this.selectedRows.has(row);

            // Filter cells
            const newCells = validIndices.map(i => {
                const cell = row.cells[i];
                if (isSelected) {
                    return { ...cell, content: `\x1b[32m${cell.content}\x1b[0m` } as any;
                }
                return cell;
            });

            const nextRow = new Row(row.getData(), viewTable);
            nextRow.cells = newCells;
            return nextRow;
        });

        viewTable.footer = this.table.footer; // Footer might need adjustment for hidden cols? 
        // Table footer logic usually sums by column index. 
        // If we create a new table with fewer columns, we should probably recreate footer logic?
        // For V1, let's assume footer follows the columns provided? 
        // If table.footer is a function, it might break. 
        // If it's a simple object, we might need to filter it?
        // Let's skip footer deep logic fix for now or clear it if it helps.

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

    private renderColumnSelection(): void {
        console.log('--- Toggle Columns ---\n');
        console.log('keys: [Up/Down] Navigate | [Space] Toggle | [Enter] Done\n');

        this.table.columns.forEach((col, idx) => {
            const isHidden = this.hiddenColumns.has(col.key || col.name);
            const isSelected = this.columnSelectionIndex === idx;
            const checkbox = isHidden ? '[ ]' : '[x]';
            const cursor = isSelected ? '>' : ' ';

            const name = col.name; // styling?
            const line = `${cursor} ${checkbox} ${name}`;

            if (isSelected) {
                console.log(`\x1b[36m${line}\x1b[0m`); // Cyan highlight
            } else {
                console.log(line);
            }
        });
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
