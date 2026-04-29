import { tableFlags } from '../src/tableFlags';

describe('tableFlags', () => {
  it('has columns flag', () => expect(tableFlags).toHaveProperty('columns'));
  it('has output flag', () => expect(tableFlags).toHaveProperty('output'));
  it('has no-header flag', () => expect(tableFlags).toHaveProperty('no-header'));
  it('has filter flag', () => expect(tableFlags).toHaveProperty('filter'));
  it('has sort flag', () => expect(tableFlags).toHaveProperty('sort'));
});
