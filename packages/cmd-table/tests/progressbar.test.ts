import { ProgressBar } from '../src/visuals/ProgressBar';
import { Table } from '../src/Table';

describe('ProgressBar.generate', () => {
    // --- Core correctness ---
    test('50% of 100 with default options', () => {
        expect(ProgressBar.generate(50, 100)).toBe('█████░░░░░ 50%');
    });

    test('0% bar is fully empty', () => {
        expect(ProgressBar.generate(0, 100, { width: 4 })).toBe('░░░░ 0%');
    });

    test('100% bar is fully filled', () => {
        expect(ProgressBar.generate(100, 100, { width: 4 })).toBe('████ 100%');
    });

    test('default max is 100', () => {
        // Calling without explicit max
        expect(ProgressBar.generate(50)).toBe('█████░░░░░ 50%');
    });

    // --- Clamping ---
    test('clamps values above max to 100%', () => {
        expect(ProgressBar.generate(150, 100, { width: 4 })).toBe('████ 100%');
    });

    test('clamps negative values to 0%', () => {
        expect(ProgressBar.generate(-10, 100, { width: 4 })).toBe('░░░░ 0%');
    });

    // --- Custom options ---
    test('custom width affects bar length', () => {
        const bar = ProgressBar.generate(50, 100, { width: 20 });
        // Remove the trailing " 50%" label and check bar length
        const barOnly = bar.replace(/ \d+%$/, '');
        expect(barOnly.length).toBe(20);
    });

    test('custom filled and empty characters', () => {
        const bar = ProgressBar.generate(3, 5, { width: 5, filled: '■', empty: '□' });
        expect(bar).toBe('■■■□□ 60%');
    });

    test('showPercent: false omits the label', () => {
        const bar = ProgressBar.generate(50, 100, { width: 4, showPercent: false });
        expect(bar).toBe('██░░');
        expect(bar).not.toContain('%');
    });

    test('custom label overrides auto-computed percent', () => {
        const bar = ProgressBar.generate(3, 5, { width: 5, label: '3/5' });
        expect(bar).toContain('3/5');
        expect(bar).not.toContain('%');
    });

    // --- Edge cases ---
    test('max = 0 does not throw (division-by-zero guard)', () => {
        expect(() => ProgressBar.generate(0, 0)).not.toThrow();
    });

    test('non-integer values generate correct output', () => {
        const bar = ProgressBar.generate(33.3, 100, { width: 10 });
        expect(typeof bar).toBe('string');
        expect(bar.length).toBeGreaterThan(0);
    });
});

describe('ProgressBar integration with Table formatter', () => {
    test('renders progress bar inside a table cell', () => {
        const t = new Table();
        t.addColumn({ name: 'Module', key: 'module' });
        t.addColumn({
            name: 'Coverage',
            key: 'coverage',
            align: 'right',
            formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 8 }),
        });
        t.addRow({ module: 'core', coverage: 80 });
        t.addRow({ module: 'cli', coverage: 45 });

        const output = t.render();
        // Filled characters must appear in the rendered output
        expect(output).toContain('█');
        // Empty characters must appear (neither is 100%)
        expect(output).toContain('░');
        // Percent labels
        expect(output).toContain('80%');
        expect(output).toContain('45%');
        // Header must remain unformatted
        expect(output).toContain('Coverage');
        expect(output).not.toContain('%Coverage');
    });

    test('full 100% bar and 0% bar render inside a table', () => {
        const t = new Table();
        t.addColumn({ name: 'Task', key: 'task' });
        t.addColumn({
            name: 'Done',
            key: 'done',
            minWidth: 10,
            formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 4 }),
        });
        t.addRow({ task: 'Complete', done: 100 });
        t.addRow({ task: 'Pending', done: 0 });

        const output = t.render();
        expect(output).toContain('████ 100%');
        expect(output).toContain('░░░░ 0%');
    });
});
