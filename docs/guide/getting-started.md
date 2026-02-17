# Getting Started

## Installation

```bash
npm install cmd-table
```

## Basic Usage

The library creates a beautiful "Rounded" table by default.

```ts
import { Table } from 'cmd-table';

const table = new Table();

// First column defaults to 'cyan' color for keys
// Second and third columns are standard
table.addColumn('Name'); 
table.addColumn('Role');
table.addColumn('Status');

table.addRow({ Name: 'Alice', Role: 'Dev', Status: 'Active' });
table.addRow({ Name: 'Bob', Role: 'PM', Status: 'Offline' });

console.log(table.render());
```
