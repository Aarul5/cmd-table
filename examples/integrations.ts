import { Table, HtmlTable, h, render } from '../src';

console.log('\n--- Integrations Demo ---\n');

// 1. HTML Parsing
console.log('1. Parsing HTML Table');
const html = `
<table>
  <thead>
    <tr><th>ID</th><th>User</th><th>Active</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Alice</td><td>Yes</td></tr>
    <tr><td>2</td><td>Bob</td><td>No</td></tr>
  </tbody>
</table>
`;

try {
    const table = HtmlTable.from(html, { compact: false });
    console.log(table.render());
} catch (e) {
    console.error('HTML Scan Failed:', e);
}

// 2. React/JSX-like Configurations
console.log('\n2. JSX-like Config (Factory Usage)');
/**
 * In a .tsx file with proper tsconfig, you could write:
 * const element = (
 *   <cmd-table theme="doubleHeader">
 *     <cmd-column name="Task" />
 *     <cmd-row task="Do Chores" />
 *   </cmd-table>
 * );
 * 
 * Here we allow simulating the factory manually:
 */

const element = h('cmd-table', { theme: 'doubleHeader' }, [
    h('cmd-column', { name: 'Feature', key: 'feature' }),
    h('cmd-column', { name: 'Status', key: 'status' }),
    h('cmd-row', { feature: 'React Support', status: 'WIP' }),
    h('cmd-row', { feature: 'HTML Scraper', status: 'Done' })
]);

const jsxTable = render(element);
console.log(jsxTable.render());
