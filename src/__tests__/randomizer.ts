import * as random from '../randomizer';

test('generate a random number within a range', () => {
    const min = 1, max = 5;
    expect(random.number(min, max)).toBeGreaterThanOrEqual(min);
    expect(random.number(min, max)).toBeLessThanOrEqual(max);
});