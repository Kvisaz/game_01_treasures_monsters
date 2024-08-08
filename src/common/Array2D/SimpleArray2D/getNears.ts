import { ColumnRow } from "../interfaces";

/**
 * взять соседей у клетки в двухмерном массиве
 * доступ к ячейкам по правилам arr:T[колонка][ряд]
 **/
export function getNears<T>(arr: T[][], column: number, row: number, cellRadius: number = 1): T[] {
  const nears: T[] = [];

  // Проверка клеток вокруг заданной клетки в радиусе cellRadius
  for (let nextColumn = column - cellRadius; nextColumn <= column + cellRadius; nextColumn++) {
    for (let nextRow = row - cellRadius; nextRow <= row + cellRadius; nextRow++) {
      // Проверяем, что текущие индексы не выходят за границы массива и не равны индексу исходной клетки
      if (
        nextRow >= 0 &&
        nextRow < arr.length && // строка находится в пределах массива
        nextColumn >= 0 &&
        nextColumn < arr[nextRow].length && // колонка находится в пределах массива
        !(nextRow === row && nextColumn === column) // не добавляем саму исходную клетку
      ) {
        nears.push(arr[nextColumn][nextRow]);
      }
    }
  }

  return nears;
}

/** взять координаты окружающих соседей без проверки **/
export function getNearsColumnRows(column: number, row: number, cellRadius: number = 1): ColumnRow[] {
  const nears: ColumnRow[] = [];

  // Проверка клеток вокруг заданной клетки в радиусе cellRadius
  for (let nextColumn = column - cellRadius; nextColumn <= column + cellRadius; nextColumn++) {
    for (let nextRow = row - cellRadius; nextRow <= row + cellRadius; nextRow++) {
      if (
        !(nextRow === row && nextColumn === column) // не добавляем саму исходную клетку
      ) {
        nears.push({ column: nextColumn, row: nextRow });
      }
    }
  }

  return nears;
}

/** взять координаты 4х окружающих соседей
 * - без проверки
 * - только по горизонтали или вертикали
 * - радиус 1
 * **/
export function getFourNearsColumnRows(column: number, row: number): ColumnRow[] {
  return [
    { column: column - 1, row },
    { column: column + 1, row },
    { column: column, row: row - 1 },
    { column: column, row: row + 1 },
  ];
}

/** взять координаты 8х окружающих соседей
 * - без проверки
 * - по горизонтали, вертикали и диагонали
 * - радиус 1
 * **/
export function getEightNearsColumnRows(column: number, row: number): ColumnRow[] {
  return [
    // top line
    { column: column - 1, row: row - 1 },
    { column: column, row: row - 1 },
    { column: column + 1, row: row - 1 },
    // middle line
    { column: column - 1, row },
    { column: column + 1, row },
    // bottom line
    { column: column - 1, row: row + 1 },
    { column: column, row: row + 1 },
    { column: column + 1, row: row + 1 },
  ];
}
