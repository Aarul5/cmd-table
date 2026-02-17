import { stripAnsi, isFullWidth, stringWidth } from '../src/utils/textUtils';
import { colorize } from '../src/utils/colors';
import { mergeAdjacent } from '../src/utils/mergeUtils';
import { Table } from '../src/Table';
import { LayoutManager } from '../src/LayoutManager';
import { Row } from '../src/Row';

describe('textUtils', () => {
    describe('stripAnsi', () => {
        it('should strip ANSI codes', () => {
            expect(stripAnsi('\u001B[31mhello\u001B[39m')).toBe('hello');
        });

        it('should return plain text unchanged', () => {
            expect(stripAnsi('hello')).toBe('hello');
        });
    });

    describe('isFullWidth', () => {
        it('should return true for CJK characters', () => {
            expect(isFullWidth(0x4e00)).toBe(true); // CJK Unified Ideograph
            expect(isFullWidth(0xac00)).toBe(true); // Hangul Syllable
        });

        it('should return true for Hangul Jamo', () => {
            expect(isFullWidth(0x1100)).toBe(true);
            expect(isFullWidth(0x115f)).toBe(true);
        });

        it('should return true for angle brackets', () => {
            expect(isFullWidth(0x2329)).toBe(true);
            expect(isFullWidth(0x232a)).toBe(true);
        });

        it('should return true for various CJK ranges', () => {
            expect(isFullWidth(0x2e80)).toBe(true);  // CJK Radicals
            expect(isFullWidth(0x3250)).toBe(true);  // Enclosed CJK
            expect(isFullWidth(0xa960)).toBe(true);  // Hangul Jamo Extended-A
            expect(isFullWidth(0xf900)).toBe(true);  // CJK Compatibility
            expect(isFullWidth(0xfe10)).toBe(true);  // Vertical Forms
            expect(isFullWidth(0xfe30)).toBe(true);  // CJK Compatibility Forms
            expect(isFullWidth(0xff01)).toBe(true);  // Fullwidth Forms
            expect(isFullWidth(0xffe0)).toBe(true);  // Fullwidth Signs
            expect(isFullWidth(0x1f200)).toBe(true); // Enclosed Ideographic
            expect(isFullWidth(0x20000)).toBe(true); // CJK Extension B
        });

        it('should return false for ASCII characters', () => {
            expect(isFullWidth(65)).toBe(false);   // 'A'
            expect(isFullWidth(0x303f)).toBe(false); // Excluded from CJK range
        });
    });

    describe('stringWidth', () => {
        it('should return correct width for ASCII', () => {
            expect(stringWidth('hello')).toBe(5);
        });

        it('should return correct width for CJK characters', () => {
            expect(stringWidth('你好')).toBe(4); // Each CJK char is width 2
        });

        it('should handle ANSI codes', () => {
            expect(stringWidth('\u001B[31mhello\u001B[39m')).toBe(5);
        });

        it('should handle surrogate pairs (emoji)', () => {
            // Emoji are above 0xFFFF, should be handled as surrogate pairs
            expect(stringWidth('A')).toBe(1);
            expect(stringWidth('')).toBe(0);
        });

        it('should handle empty string', () => {
            expect(stringWidth('')).toBe(0);
        });
    });
});

describe('colorize', () => {
    it('should wrap text in ANSI codes', () => {
        const result = colorize('hello', 'red');
        expect(result).toContain('\u001B[31m');
        expect(result).toContain('hello');
    });

    it('should return text unchanged if no color', () => {
        expect(colorize('hello')).toBe('hello');
        expect(colorize('hello', undefined)).toBe('hello');
    });

    it('should return text unchanged for invalid color', () => {
        expect(colorize('hello', 'invalid' as any)).toBe('hello');
    });

    it('should support all color names', () => {
        expect(colorize('x', 'bold')).toContain('\u001B[1m');
        expect(colorize('x', 'dim')).toContain('\u001B[2m');
        expect(colorize('x', 'bgRed')).toContain('\u001B[41m');
    });
});

describe('mergeUtils', () => {
    it('should merge adjacent cells in specified columns', () => {
        const table = new Table();
        table.addColumn('Group');
        table.addColumn('Val');
        table.addRow({ Group: 'A', Val: 1 });
        table.addRow({ Group: 'A', Val: 2 });
        table.addRow({ Group: 'B', Val: 3 });
        mergeAdjacent(table, ['Group']);
        expect(table.rows[0].cells[0].rowSpan).toBe(2);
        expect(table.rows[1].cells[0].merged).toBe(true);
    });

    it('should merge all columns when none specified', () => {
        const table = new Table();
        table.addColumn('X');
        table.addRow({ X: 'A' });
        table.addRow({ X: 'A' });
        mergeAdjacent(table);
        expect(table.rows[0].cells[0].rowSpan).toBe(2);
    });

    it('should handle empty table', () => {
        const table = new Table();
        table.addColumn('X');
        mergeAdjacent(table);
        // No crash
    });

    it('should handle non-matching column names', () => {
        const table = new Table();
        table.addColumn('X');
        table.addRow({ X: 'A' });
        mergeAdjacent(table, ['NonExistent']);
        // colIndices will be empty after filter, early return
    });
});

describe('LayoutManager', () => {
    it('should layout a simple table', () => {
        const table = new Table();
        table.addColumn('A');
        table.addColumn('B');
        table.addRow({ A: '1', B: '2' });
        const grid = LayoutManager.layout(table);
        expect(grid).toHaveLength(1);
        expect(grid[0]).toHaveLength(2);
        expect(grid[0][0].cell.content).toBe('1');
    });

    it('should handle colSpan', () => {
        const table = new Table();
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Span', colSpan: 2 }]);
        const grid = LayoutManager.layout(table);
        expect(grid[0][0].realColSpan).toBe(2);
        expect(grid[0][1].hidden).toBe(true);
    });

    it('should handle rowSpan', () => {
        const table = new Table();
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Tall', rowSpan: 2 }, { content: 'B1' }]);
        table.addRow([{ content: 'B2' }]);
        const grid = LayoutManager.layout(table);
        expect(grid[0][0].realRowSpan).toBe(2);
        expect(grid[1][0].hidden).toBe(true);
    });

    it('should fill empty cells', () => {
        const table = new Table();
        table.addColumn('A');
        table.addColumn('B');
        table.addRow([{ content: 'Only A' }]);
        const grid = LayoutManager.layout(table);
        // Column B should be filled with empty cell
        expect(grid[0][1]).toBeDefined();
        expect(grid[0][1].cell.content).toBe('');
    });

    it('should throw on column overflow', () => {
        const table = new Table();
        table.addColumn('A');
        table.addRow([{ content: 'X', colSpan: 2 }]);
        expect(() => LayoutManager.layout(table)).toThrow('exceeds defined column count');
    });
});

describe('Row', () => {
    it('should parse record data', () => {
        const table = new Table();
        table.addColumn('Name');
        const row = new Row({ Name: 'Alice' }, table);
        expect(row.cells[0].content).toBe('Alice');
    });

    it('should getData returns original data', () => {
        const table = new Table();
        table.addColumn('Name');
        const data = { Name: 'Bob' };
        const row = new Row(data, table);
        expect(row.getData()).toBe(data);
    });

    it('should auto-create columns from first record row', () => {
        const table = new Table();
        const row = new Row({ X: 1, Y: 2 }, table);
        expect(table.columns).toHaveLength(2);
        expect(table.columns[0].name).toBe('X');
    });
});
