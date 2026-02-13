import { Table } from '../src/Table';
import { addTree, TreeNode } from '../src/utils/treeUtils';

describe('Tree Utils', () => {
    let table: Table;

    beforeEach(() => {
        table = new Table();
        table.addColumn('Name');
        table.addColumn('Value');
    });

    it('should flatten tree with indentation', () => {
        const data: TreeNode[] = [
            {
                Name: 'Root',
                Value: 100,
                children: [
                    { Name: 'Child 1', Value: 50 },
                    { Name: 'Child 2', Value: 50, children: [{ Name: 'Grandchild', Value: 10 }] }
                ]
            }
        ];

        addTree(table, 'Name', data);

        expect(table.rows).toHaveLength(4);
        expect(table.rows[0].cells[0].content).toBe('Root');
        expect(table.rows[1].cells[0].content).toContain('├─ Child 1');
        expect(table.rows[2].cells[0].content).toContain('├─ Child 2');
        // Indentation calculation: 0 -> '', 1 -> '  ├─ ', 2 -> '    ├─ '
        // My impl: depth 0 -> '', depth 1 -> '├─ ', depth 2 -> '  ├─ '
        // Wait, line 15 in treeUtils:
        // const prefix = depth > 0 ? ' '.repeat((depth - 1) * indentSize) + '├─ ' : '';
        // Depth 0: ''
        // Depth 1: ' '.repeat(0) + '├─ ' = '├─ '
        // Depth 2: ' '.repeat(2) + '├─ ' = '  ├─ '
        expect(table.rows[3].cells[0].content).toContain('  ├─ Grandchild');
    });
});
