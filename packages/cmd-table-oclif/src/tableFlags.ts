import { Flags } from '@oclif/core';

export const tableFlags = {
  columns: Flags.string({
    description: 'Comma-separated list of columns to display',
    helpValue: 'col1,col2',
  }),
  output: Flags.string({
    description: 'Output format',
    options: ['table', 'csv', 'json', 'md'],
    default: 'table',
  }),
  'no-header': Flags.boolean({
    description: 'Hide table header row',
    default: false,
  }),
  filter: Flags.string({
    description: 'Filter rows by a search term (matches any column)',
  }),
  sort: Flags.string({
    description: 'Sort rows by this column name',
  }),
};
