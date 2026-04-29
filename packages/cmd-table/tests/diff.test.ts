import { Table } from '../src/Table';

function stripAnsi(str: string): string {
    return str.replace(/\u001b\[\d+m/g, '');
}

describe('Table.compare()', () => {
    const oldData = [
        { id: 1, name: 'Alice', role: 'Engineer' },
        { id: 2, name: 'Bob', role: 'Designer' },
        { id: 3, name: 'Charlie', role: 'Manager' }
    ];

    test('returns exact same data when there are no changes', () => {
        const newData = [...oldData];
        const table = Table.compare(oldData, newData, { primaryKey: 'id', showUnchanged: true });
        const output = table.render();
        const stripped = stripAnsi(output);

        expect(stripped).toContain('Alice');
        expect(stripped).toContain('Bob');
        expect(stripped).toContain('Charlie');
        expect(output).not.toContain('\u001b[31m'); // red
        expect(output).not.toContain('\u001b[32m'); // green
        expect(output).not.toContain('\u001b[33m'); // yellow
    });

    test('highlights added and removed rows correctly by primaryKey', () => {
        const newData = [
            { id: 1, name: 'Alice', role: 'Engineer' }, // Unchanged
            { id: 3, name: 'Charlie', role: 'Manager' }, // Unchanged
            { id: 4, name: 'Diana', role: 'Product' } // Added
        ]; // Bob is removed

        const table = Table.compare(oldData, newData, { primaryKey: 'id', showUnchanged: true });
        const output = table.render();
        const stripped = stripAnsi(output);

        expect(stripped).toContain('Bob');
        expect(stripped).toContain('Diana');
        expect(stripped).toContain('Alice');

        // Look for the specific color codes in the raw output
        expect(output).toContain('\u001b[31m'); // Red for removed row
        expect(output).toContain('\u001b[32m'); // Green for added row
    });

    test('highlights modified cells in yellow based on primaryKey', () => {
        const newData = [
            { id: 1, name: 'Alice', role: 'Lead Engineer' }, // Modified role
            { id: 2, name: 'Bob', role: 'Designer' },
            { id: 3, name: 'Charlie', role: 'Manager' }
        ];

        const table = Table.compare(oldData, newData, { primaryKey: 'id', showUnchanged: false });
        const output = table.render();
        const stripped = stripAnsi(output);

        // only Alice should show up because showUnchanged is false
        expect(stripped).not.toContain('Bob');
        expect(stripped).not.toContain('Charlie');

        // Alice's role change should be present and output should contain yellow code
        expect(stripped).toContain('Engineer → Lead Engineer');
        expect(output).toContain('\u001b[33m');
    });

    test('relies on array index for matching if no primaryKey is provided', () => {
        const newData = [
            { id: 1, name: 'Alice', role: 'Engineer' },
            { id: 99, name: 'New Guy', role: 'Intern' }, // Replaced Bob at index 1
            { id: 3, name: 'Charlie', role: 'Manager' }
        ];

        const table = Table.compare(oldData, newData, { showUnchanged: true });
        const output = table.render();
        const stripped = stripAnsi(output);

        // It should view index 1 as modified, not as (remove Bob, add New Guy)
        expect(stripped).toContain('2 → 99'); // ID change
        expect(stripped).toContain('Bob → New Guy'); // Name change
        expect(stripped).toContain('Designer → Intern'); // Role change
        expect(output).toContain('\u001b[33m'); // Should contain yellows for modified
    });
});
