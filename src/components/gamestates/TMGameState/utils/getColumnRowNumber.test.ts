// Тесты с использованием TSJest
import { getColumnRowNumber, getColumnRowFromNumber } from './getColumnRowNumber'; // Замените на правильный путь к вашему модулю

describe('getColumnRowNumber', () => {
  test('должен правильно преобразовать column и row в columnRowNumber', () => {
    expect(getColumnRowNumber({ column: 2, row: 3 }, 5)).toBe(17); // 2 + 3 * 5 = 17
    expect(getColumnRowNumber({ column: 0, row: 0 }, 4)).toBe(0);  // 0 + 0 * 4 = 0
    expect(getColumnRowNumber({ column: 1, row: 1 }, 3)).toBe(4);  // 1 + 1 * 3 = 4
  });
});

describe('getColumnRowFromNumber', () => {
  test('должен правильно преобразовать columnRowNumber в column и row', () => {
    expect(getColumnRowFromNumber(17, 5)).toEqual({ column: 2, row: 3 }); // column = 17 % 5 = 2, row = Math.floor(17 / 5) = 3
    expect(getColumnRowFromNumber(0, 4)).toEqual({ column: 0, row: 0 });  // column = 0 % 4 = 0, row = Math.floor(0 / 4) = 0
    expect(getColumnRowFromNumber(4, 3)).toEqual({ column: 1, row: 1 });  // column = 4 % 3 = 1, row = Math.floor(4 / 3) = 1
  });
});
