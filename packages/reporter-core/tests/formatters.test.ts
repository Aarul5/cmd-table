import { formatDuration, statusIcon, statusColor } from '../src/formatters';

describe('formatDuration', () => {
  it('shows ms for durations under 1 second', () => {
    expect(formatDuration(450)).toBe('450ms');
  });
  it('shows seconds for durations >= 1000ms', () => {
    expect(formatDuration(2500)).toBe('2.50s');
  });
  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0ms');
  });
});

describe('statusIcon', () => {
  it('returns check for passed', () => expect(statusIcon('passed')).toBe('✅'));
  it('returns cross for failed', () => expect(statusIcon('failed')).toBe('❌'));
  it('returns warning for skipped', () => expect(statusIcon('skipped')).toBe('⚠️'));
});

describe('statusColor', () => {
  it('returns green for passed', () => expect(statusColor('passed')).toBe('green'));
  it('returns red for failed', () => expect(statusColor('failed')).toBe('red'));
  it('returns yellow for skipped', () => expect(statusColor('skipped')).toBe('yellow'));
});
