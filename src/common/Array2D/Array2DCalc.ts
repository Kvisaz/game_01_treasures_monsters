/**
 *  @class Array2DCalc
 *  calc-хелперы для двухмерного массива на базе плоского
 */
import { IArray2DCell } from "./interfaces";

export class Array2DCalc {
  static calcColumn(index: number, columns: number): number {
    return index % columns;
  }

  static calcRow(index: number, columns: number): number {
    return Math.floor(index / columns);
  }

  // заполнение сверху вниз слева направо
  static getCellIndex(col: number, row: number, cols: number): number {
    return cols * row + col;
  }

  // сделать пустой массив с нулями
  static makeFlatNullArray<T>(cols: number, rows: number): IArray2DCell<T>[] {
    return [...new Array(cols * rows)].map((_, i) => ({
      column: this.calcColumn(i, cols),
      row: this.calcRow(i, rows),
      data: undefined,
    }));
  }

  // сделать пустой двухмерный массив с нулями
  static makeArray2D<T>(
    cols: number,
    rows: number,
    cellGenerator: (col: number, row: number) => T
  ): T[][] {
    const columns: T[][] = new Array(cols);
    columns.forEach((_, columnIndex) => {
      const column = new Array(rows);
      column.forEach((row, rowIndex) => (column[rowIndex] = cellGenerator(columnIndex, rowIndex)));
      columns[columnIndex] = column;
    });
    return columns;
  }
}
