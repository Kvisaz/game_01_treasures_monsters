import { IArray2DCell } from "./interfaces";

/**
 * Map для хранения ячеек двухмерного массива Array2D
 * гарантирует что ни одна ячейка не будет добавлена дважды
 * последняя ячейка замещает предыдущую
 */
export class Map2D<T> {
  private map: Map<string, IArray2DCell<T>>;
  constructor() {
    this.map = new Map();
  }

  add(cell: IArray2DCell<T>) {
    const key = getKey(cell.column, cell.row);
    this.map.set(key, cell);
  }

  get(col: number, row: number) {
    const key = getKey(col, row);
    return this.map.get(key);
  }

  clear() {
    this.map.clear();
  }

  delete(col: number, row: number) {
    this.map.delete(getKey(col, row));
  }

  get size() {
    return this.map.size;
  }

  forEach(callback: (value: IArray2DCell<T>) => void): void {
    this.map.forEach(callback);
  }

  has(col: number, row: number) {
    return this.map.has(getKey(col, row));
  }
}

function getKey(column: number, row: number) {
  return `${column}x${row}`;
}
