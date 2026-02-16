/* eslint-disable @typescript-eslint/no-namespace */
import { Table } from '../Table';

// 1. Define JSX Intrinsic Elements
export namespace JSX {
    export interface IntrinsicElements {
        'cmd-table': { theme?: string; compact?: boolean, children?: any };
        'cmd-column': { name: string; key?: string; width?: number };
        'cmd-row': { [key: string]: any };
    }
}

// 2. Factory Function (h / createElement)
export function createElement(tag: string | Function, props: any, ...children: any[]): any {
    // If tag is a component (function), call it
    if (typeof tag === 'function') {
        return tag({ ...props, children });
    }

    // Otherwise, return a VNode-like object for our parser to handle
    return { tag, props, children: children.flat() };
}

// 3. Renderer (Converts VNode -> Table instance)
export function render(element: any): Table {
    if (element.tag !== 'cmd-table') {
        throw new Error('Root element must be <cmd-table>');
    }

    const table = new Table({
        theme: element.props.theme ? (require('../themes/Theme').BUILTIN_THEMES[element.props.theme] || element.props.theme) : undefined,
        compact: element.props.compact
    });

    // Process Children
    element.children.forEach((child: any) => {
        if (!child) return;

        if (child.tag === 'cmd-column') {
            table.addColumn({
                name: child.props.name,
                key: child.props.key,
                width: child.props.width
            });
        } else if (child.tag === 'cmd-row') {
            // Filter out 'children' from props
            const { children, ...rowData } = child.props;
            table.addRow(rowData);
        }
    });

    return table;
}

// 4. Component Helpers (Optional)
export const CmdTable = 'cmd-table';
export const CmdColumn = 'cmd-column';
export const CmdRow = 'cmd-row';
