# Integrations

## React / JSX Support

Define tables using JSX syntax (works with any JSX runtime or our lightweight factory).

```tsx
import { h, render } from 'cmd-table';

const element = (
    <cmd-table theme="doubleHeader">
        <cmd-column name="Task" key="task" />
        <cmd-row task="Do Chores" />
    </cmd-table>
);

const table = render(element);
console.log(table.render());
```

## HTML Scraper

Parse HTML tables directly into `cmd-table`. (Zero-dependency, regex-based).

```typescript
import { HtmlTable } from 'cmd-table';

const html = `<table><tr><td>Data</td></tr></table>`;
const table = HtmlTable.from(html);
console.log(table.render());
```
