export type OutputFormat = 'table' | 'csv' | 'json' | 'md';

export interface TableRenderOptions {
  columns?: string[];
  output?: OutputFormat;
  noHeader?: boolean;
  filter?: string;
  sort?: string;
}
