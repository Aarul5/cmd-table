import { Sparkline } from '../src/visuals/Sparkline';
import { Heatmap } from '../src/visuals/Heatmap';

describe('Sparkline', () => {
    it('should generate sparklines correctly', () => {
        // Simple case: min to max
        const values = [0, 10, 20, 30, 40, 50, 60, 70];
        const spark = Sparkline.generate(values);
        expect(spark).toHaveLength(8);
        expect(spark).not.toContain('undefined');
    });

    it('should handle single value', () => {
        const spark = Sparkline.generate([10]);
        // Should likely be a middle or full bar depending on implementation logic for range=0
        // Our impl sets max=min+1 if min==max, so (10-10)/(11-10) = 0 -> lowest bar
        expect(spark).toBe(' ');
    });

    it('should handle custom min/max', () => {
        const values = [5];
        const spark = Sparkline.generate(values, { min: 0, max: 10 });
        // 5 is 50% of 0-10 -> should be middle bar
        // 0.5 * 7 = 3.5 -> floor(3.5) = 3 -> 4th bar
        expect(spark).toBe('▄');
    });
});

describe('Heatmap', () => {
    it('should colorize values based on range', () => {
        const low = Heatmap.color(10, 0, 100);
        const mid = Heatmap.color(50, 0, 100);
        const high = Heatmap.color(90, 0, 100);

        expect(low).toContain('\x1b[31m'); // Red
        expect(mid).toContain('\x1b[33m'); // Yellow
        expect(high).toContain('\x1b[32m'); // Green
    });

    it('should handle background coloring', () => {
        const val = Heatmap.color(20, 0, 100, 'bg');
        expect(val).toContain('\x1b[41m'); // BG Red
    });
});
