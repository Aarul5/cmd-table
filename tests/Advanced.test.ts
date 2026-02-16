import { Table } from '../src/Table';
import { THEME_Rounded } from '../src/themes/Theme';

describe('Advanced Features', () => {
    describe('Sorting', () => {
        it('should sort strings ascending', () => {
            const table = new Table();
            table.addColumn('Name');
            table.addRow({ Name: 'Charlie' });
            table.addRow({ Name: 'Alice' });
            table.addRow({ Name: 'Bob' });

            table.sort('Name');

            expect(table.rows[0].cells[0].content).toBe('Alice');
            expect(table.rows[1].cells[0].content).toBe('Bob');
            expect(table.rows[2].cells[0].content).toBe('Charlie');
        });

        it('should sort strings descending', () => {
            const table = new Table();
            table.addColumn('Name');
            table.addRow({ Name: 'Alice' });
            table.addRow({ Name: 'Bob' });

            table.sort('Name', 'desc');

            expect(table.rows[0].cells[0].content).toBe('Bob');
            expect(table.rows[1].cells[0].content).toBe('Alice');
        });

        it('should sort numbers correctly', () => {
            const table = new Table();
            table.addColumn('Age');
            table.addRow({ Age: 10 });
            table.addRow({ Age: 2 });
            table.addRow({ Age: 100 });

            table.sort('Age');

            expect(table.rows[0].cells[0].content).toBe(2);
            expect(table.rows[1].cells[0].content).toBe(10);
            expect(table.rows[2].cells[0].content).toBe(100);
        });
    });

    describe('Header Groups', () => {
        it('should render header groups', () => {
            const table = new Table({
                headerGroups: [{ title: 'Group 1', colSpan: 2 }]
            });
            table.addColumn({ name: 'A', width: 10 });
            table.addColumn({ name: 'B', width: 10 });
            table.addRow(['1', '2']);

            const output = table.render();
            // Remove ANSI codes for easier string matching if needed, 
            // but here we just ensure it didn't wrap weirdly.
            // Actually, if we use wide columns, it should fit "Group 1".
            expect(output).toContain('Group 1');
        });
    });

    describe('Footers & Summaries', () => {
        it('should render manual footer', () => {
            const table = new Table();
            table.addColumn({ name: 'A', width: 10 });
            table.setFooter({ A: 'Total' });
            const output = table.render();
            expect(output).toContain('Total');
        });

        it('should calculate summary', () => {
            const table = new Table();
            table.addColumn('Val');
            table.addRow({ Val: 10 });
            table.addRow({ Val: 20 });

            table.summarize(['Val'], 'sum');

            // Check that footer is set
            expect(table.footer).toEqual({ Val: 30 });

            const output = table.render();
            expect(output).toContain('30');
        });
    });

    describe('Responsive Mode', () => {
        it('should hide low priority columns', () => {
            // Very narrow width
            const table = new Table({
                terminalWidth: 10,
                responsiveMode: 'hide'
            });
            table.addColumn({ name: 'A', priority: 0, width: 5 }); // Very important (keep)
            table.addColumn({ name: 'B', priority: 10, width: 20 }); // Less important (hide)

            table.addRow(['Hi', 'This is a long text that should be hidden']);

            // Layout is calculated during render or specific method?
            // StringRenderer handles this internally.
            const output = table.render();

            expect(output).toContain('Hi');
            expect(output).not.toContain('long text');
        });
    });
});
