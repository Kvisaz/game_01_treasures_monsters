/**
 *  Двухмерный массив
 *  - на базе одномерного, упрощает ряд вычислений
 *  - все ячейки содержат инфу, нет проверки на null
 */
import { Array2DCalc } from "./Array2DCalc";
import { IArray2DCell, IGridForEachCallback, Nullable } from "./interfaces";

export class Array2D<T> {
  protected array: IArray2DCell<T>[];

  constructor(public readonly cols: number, public readonly rows: number) {
    this.array = Array2DCalc.makeFlatNullArray<T>(cols, rows);
  }

  /**********************
   * size
   **********************/

  get rowLength(): number {
    return this.cols;
  }

  get colHeight(): number {
    return this.rows;
  }

  get lastRow(): number {
    return this.rows - 1;
  }

  get firstRow(): number {
    return 0;
  }

  get lastColumn(): number {
    return this.cols - 1;
  }

  get firstColumn(): number {
    return 0;
  }

  get length(): number {
    return this.array.length;
  }

  /**********************
   * get cells
   **********************/
  getCell(col: number, row: number): IArray2DCell<T> {
    return this.array[Array2DCalc.getCellIndex(col, row, this.cols)];
  }

  getCellSafe(col: number, row: number): IArray2DCell<T> | undefined {
    if (this.isOutside(col, row)) return;
    return this.array[Array2DCalc.getCellIndex(col, row, this.cols)];
  }

  getInSquare(col: number, row: number, distance: number): IArray2DCell<T>[] {
    distance = Math.abs(distance);
    const col1 = Math.max(0, col - distance);
    const row1 = Math.max(0, row - distance);
    const col2 = Math.min(this.lastColumn, col + distance);
    const row2 = Math.min(this.lastRow, row + distance);

    const cells: IArray2DCell<T>[] = [];
    for (let row = row1; row <= row2; row++) {
      for (let col = col1; col <= col2; col++) {
        cells.push(this.getCell(col, row));
      }
    }

    return cells;
  }

  setCell(
    col: number,
    row: number,
    data: Nullable<T>
  ): IArray2DCell<T> | undefined {
    if (!this.isInside(col, row)) return;
    const cellIndex = Array2DCalc.getCellIndex(col, row, this.rowLength);
    this.array[cellIndex].data = data;
    return this.array[cellIndex];
  }

  copyCell(
    col: number,
    row: number,
    fromCell: IArray2DCell<T>
  ): IArray2DCell<T> | undefined {
    return this.setCell(col, row, fromCell.data);
  }

  /** возвращает мутабельную копию **/
  getAllCells(): IArray2DCell<T>[] {
    return this.array;
  }

  isInside(col: number, row: number): boolean {
    if (col < 0 || row < 0) return false;
    return !(col >= this.cols || row >= this.rows);
  }

  isOutside(col: number, row: number): boolean {
    return !this.isInside(col, row);
  }

  /**********************
   * удаляет дату из ячейки и возвращает ее
   **********************/
  pop(col: number, row: number): Nullable<T> {
    const cell = this.getCell(col, row);
    const data = cell.data;
    cell.data = null;
    return data;
  }

  /**
   * Перемещает данные из ячейки from в ячейку to
   */
  moveCell(
    fromCol: number,
    fromRow: number,
    toCol: number,
    toRow: number
  ): IArray2DCell<T> {
    const cell = this.getCell(fromCol, fromRow);
    this.setCell(toCol, toRow, cell.data);
    cell.data = null;
    return cell;
  }

  swap(fromCol: number, fromRow: number, toCol: number, toRow: number): this {
    const fromCellData = this.getCell(fromCol, fromRow).data;
    const toCellData = this.getCell(toCol, toRow).data;
    this.setCell(toCol, toRow, fromCellData);
    this.setCell(fromCol, fromRow, toCellData);
    return this;
  }

  /**********************
   * array functions
   * некоторое дублирование кода ради небольшой оптимизации
   **********************/

  forEach(fn: IGridForEachCallback<IArray2DCell<T>>): this {
    const { cols } = this;
    this.array.forEach((cell, index) => {
      const column = Array2DCalc.calcColumn(index, cols);
      const row = Array2DCalc.calcRow(index, cols);
      fn(cell, index, column, row);
    });
    return this;
  }
}
