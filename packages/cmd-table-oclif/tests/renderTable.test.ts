import { renderTable } from '../src/renderTable';

const data = [
  { name: 'Alice', role: 'Dev', score: '95' },
  { name: 'Bob', role: 'PM', score: '80' },
  { name: 'Carol', role: 'Dev', score: '88' },
];

describe('renderTable', () => {
  it('renders a table string by default', () => {
    const out = renderTable(data);
    expect(out).toContain('Alice');
    expect(out).toContain('Bob');
  });
  it('returns empty string for empty data', () => {
    expect(renderTable([])).toBe('');
  });
  it('respects columns option', () => {
    const out = renderTable(data, { columns: ['name'] });
    expect(out).toContain('Alice');
    expect(out).not.toContain('Dev');
  });
  it('exports csv', () => {
    const out = renderTable(data, { output: 'csv' });
    expect(out).toContain('name,role,score');
  });
  it('exports json', () => {
    const out = renderTable(data, { output: 'json' });
    const parsed = JSON.parse(out);
    expect(parsed).toHaveLength(3);
  });
  it('exports markdown', () => {
    const out = renderTable(data, { output: 'md' });
    expect(out).toContain('|');
  });
  it('filters rows by search term', () => {
    const out = renderTable(data, { filter: 'dev' });
    expect(out).toContain('Alice');
    expect(out).not.toContain('Bob');
  });
  it('sorts rows by column', () => {
    const out = renderTable(data, { sort: 'name' });
    expect(out.indexOf('Alice')).toBeLessThan(out.indexOf('Bob'));
  });
});
