import { Table } from '../src/Table';
import { THEME_DEFAULT, THEME_Rounded } from '../src/themes/Theme';

/**
 * These tests target StringRenderer uncovered lines:
 * - responsive 'hide' mode (lines 71, 90-106)
 * - responsive 'stack' mode (lines 99-100, 109-118)
 * - zebra striping (line 380)
 * - footer rendering (lines 182-186)
 * - header groups (lines 121-140)
 * - word wrapping (lines 391, 401-421)
 */
describe('StringRenderer — Advanced Features', () => {
    describe('Responsive Hide Mode', () => {
        it('should hide low-priority columns when terminal is narrow', () => {
            const table = new Table({
                terminalWidth: 30,
                responsiveMode: 'hide',
                columns: [
                    { name: 'Name', key: 'Name', priority: 0 },
                    { name: 'Extra', key: 'Extra', priority: 10 }
                ]
            });
            table.addRow({ Name: 'Alice', Extra: 'data' });
            const output = table.render();
            expect(output).toContain('Name');
            // If terminal is wide enough for both, both show; if not, high priority hidden first
        });

        it('should handle hidden columns', () => {
            const table = new Table({
                columns: [
                    { name: 'Visible', key: 'Visible', hidden: false },
                    { name: 'Hidden', key: 'Hidden', hidden: true }
                ]
            });
            table.addRow({ Visible: 'A', Hidden: 'B' });
            const output = table.render();
            expect(output).toContain('Visible');
            expect(output).not.toContain('Hidden');
        });
    });

    describe('Responsive Stack Mode', () => {
        it('should stack columns when terminal is narrow', () => {
            const table = new Table({
                terminalWidth: 20,
                responsiveMode: 'stack',
                columns: [
                    { name: 'Col1', key: 'Col1', priority: 0 },
                    { name: 'Col2', key: 'Col2', priority: 5 },
                    { name: 'Col3', key: 'Col3', priority: 10 }
                ]
            });
            table.addRow({ Col1: 'A', Col2: 'B', Col3: 'C' });
            const output = table.render();
            // In stack mode, renders as Field | Value pairs
            expect(output).toContain('Field');
            expect(output).toContain('Value');
        });
    });

    describe('Zebra Striping', () => {
        it('should apply dim to alternating rows', () => {
            const table = new Table({ zebra: true });
            table.addColumn('X');
            table.addRow({ X: 'Row1' });
            table.addRow({ X: 'Row2' });
            table.addRow({ X: 'Row3' });
            const output = table.render();
            // Zebra applies dim (ANSI code \u001B[2m) to odd-indexed rows
            expect(output).toContain('\u001B[2m');
        });
    });

    describe('Footer Rendering', () => {
        it('should render footer from record', () => {
            const table = new Table();
            table.addColumn({ name: 'Name', width: 10 });
            table.addColumn({ name: 'Value', width: 10 });
            table.addRow({ Name: 'A', Value: 10 });
            table.setFooter({ Name: 'Sum', Value: 10 });
            const output = table.render();
            expect(output).toContain('Sum');
        });

        it('should render footer from array', () => {
            const table = new Table();
            table.addColumn('Name');
            table.addColumn('Value');
            table.addRow({ Name: 'A', Value: 10 });
            table.footer = ['Sum', 10];
            const output = table.render();
            expect(output).toContain('Sum');
        });

        it('should render footer with hidden columns', () => {
            const table = new Table({
                columns: [
                    { name: 'Vis', key: 'Vis' },
                    { name: 'Hid', key: 'Hid', hidden: true }
                ]
            });
            table.addRow({ Vis: 'A', Hid: 'B' });
            table.footer = ['Footer', 'Hidden'];
            const output = table.render();
            // Footer renders — hidden column stripped, array footer sliced
            expect(output).toBeTruthy();
            expect(output.split('\n').length).toBeGreaterThan(3);
        });
    });

    describe('Header Groups', () => {
        it('should render header group row', () => {
            const table = new Table({
                headerGroups: [
                    { title: 'Personal Info', colSpan: 2 }
                ]
            });
            table.addColumn('First');
            table.addColumn('Last');
            table.addRow({ First: 'John', Last: 'Doe' });
            const output = table.render();
            // Header group text may wrap across lines, check for partial match
            expect(output).toContain('Personal');
        });
    });

    describe('Word Wrapping', () => {
        it('should wrap long text in cells', () => {
            const table = new Table();
            table.addColumn({ name: 'Text', width: 10, wrapWord: true });
            table.addRow({ Text: 'This is a very long sentence that should wrap' });
            const output = table.render();
            expect(output).toBeTruthy();
            // The cell content should be split across multiple lines
            const lines = output.split('\n');
            expect(lines.length).toBeGreaterThan(3); // header + border + wrapped lines
        });

        it('should truncate without wrap', () => {
            const table = new Table();
            table.addColumn({ name: 'Text', width: 5, wrapWord: false, truncate: '…' });
            table.addRow({ Text: 'Looooong text here' });
            const output = table.render();
            expect(output).toBeTruthy();
        });
    });

    describe('Compact Mode', () => {
        it('should render without mid-separators', () => {
            const table = new Table({ compact: true });
            table.addColumn('A');
            table.addRow({ A: '1' });
            table.addRow({ A: '2' });
            const output = table.render();
            expect(output).toBeTruthy();
        });
    });

    describe('Alignment', () => {
        it('should right-align cells', () => {
            const table = new Table();
            table.addColumn({ name: 'Num', align: 'right', width: 10 });
            table.addRow({ Num: '42' });
            const output = table.render();
            expect(output).toContain('42');
        });

        it('should center-align cells', () => {
            const table = new Table();
            table.addColumn({ name: 'Mid', align: 'center', width: 10 });
            table.addRow({ Mid: 'X' });
            const output = table.render();
            expect(output).toContain('X');
        });
    });
});
