import { getRandomIntBetween } from './getRandomIntBetween';

describe('getRandomIntBetween', () => {
  test('returns a value within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = getRandomIntBetween(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  test('returns a value that is a multiple of the step', () => {
    const min = 1;
    const max = 10;
    const step = 2;
    const result = getRandomIntBetween(min, max, step);
    expect((result - min) % step).toBe(0);
  });

  test('returns the min value when min and max are equal', () => {
    const min = 5;
    const max = 5;
    const result = getRandomIntBetween(min, max);
    expect(result).toBe(min);
  });

  test('handles negative step by converting it to positive', () => {
    const min = 1;
    const max = 10;
    const step = -2;
    const result = getRandomIntBetween(min, max, step);
    expect((result - min) % Math.abs(step)).toBe(0);
  });

  test('returns different values over multiple invocations', () => {
    const min = 1;
    const max = 10;
    const step = 1;
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(getRandomIntBetween(min, max, step));
    }
    expect(results.size).toBeGreaterThan(1); // Should get multiple unique values over 100 invocations
  });

  test('handles non-positive step by setting step to 1', () => {
    const min = 1;
    const max = 10;
    const step = 0;
    const result = getRandomIntBetween(min, max, step);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
    expect((result - min) % 1).toBe(0);
  });
});
