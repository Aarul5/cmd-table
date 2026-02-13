import { Table } from '../Table';

export interface TreeNode {
    [key: string]: any;
    children?: TreeNode[];
}

export function addTree(table: Table, labelColumn: string, nodes: TreeNode[], indentSize: number = 2): void {
    const processNode = (node: TreeNode, depth: number) => {
        const rowData = { ...node };
        delete rowData.children;

        // Indent label
        if (rowData[labelColumn]) {
            const prefix = depth > 0
                ? ' '.repeat((depth - 1) * indentSize) + '├─ '
                : '';
            rowData[labelColumn] = prefix + rowData[labelColumn];
        }

        table.addRow(rowData);

        if (node.children) {
            node.children.forEach((child, index) => {
                // Use └─ for vast child? 
                // Simple indentation for now.
                processNode(child, depth + 1);
            });
        }
    };

    nodes.forEach(node => processNode(node, 0));
}
