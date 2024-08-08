import { getRandomArrayElementWithFilter } from "./getRandomArrayElementWithFilter";

describe('getRandomElement function', () => {
  test('throws an error if the array is empty', () => {
    expect(() => getRandomArrayElementWithFilter([])).toThrow("Array is empty");
  });

  test('returns an element when no filter is provided', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = getRandomArrayElementWithFilter(arr);
    expect(arr).toContain(result);
  });

  test('returns an element that matches the filter', () => {
    const arr = [1, 2, 3, 4, 5];
    const filter = (el: number) => el > 3;
    const result = getRandomArrayElementWithFilter(arr, filter);
    expect(result).toBeGreaterThanOrEqual(4);
  });

  test('throws an error if no element matches the filter', () => {
    const arr = [1, 2, 3, 4, 5];
    const filter = (el: number) => el > 10;
    expect(() => getRandomArrayElementWithFilter(arr, filter)).toThrow("No element matches the filter criteria");
  });
});
