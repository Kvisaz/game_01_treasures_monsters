import { getHexNears } from "./getHexNears";
import { forEach2D, makeArray2D } from "../SimpleArray2D";
import { getHexNearsInRadius } from "./getHexNearsInRadius";
import { IArray2DNearsMarker } from "../interfaces";

interface IProps {
  columns: number;
  rows: number;
}

/** маркер гексагональной сетки, создает массив размером columns * rows **/
export class HexGridMarker implements IArray2DNearsMarker {
  private readonly grid: boolean[][];

  constructor(private props: IProps) {
    const { columns, rows } = this.props;
    this.grid = makeArray2D(columns, rows, (col, row) => false);
  }

  /** Очистить все метки */
  clear(): void {
    forEach2D(this.grid, (value, col, row) => (this.grid[col][row] = false));
  }
  /**
   * Пометить ячейку, возвращает true если ячейка не была помечена ранее, иначе false.
   * @param column - Номер столбца.
   * @param row - Номер строки.
   **/
  add(column: number, row: number): boolean {
    if (!this.isValidPosition(column, row)) return false;
    const isNew = !this.has(column, row);
    this.grid[column][row] = true;
    return isNew;
  }

  /**
   * Проверить, помечена ли ячейка.
   * возвращает true если помечена ИЛИ если индекс выходит за пределы сетки
   * @param column - Номер столбца.
   * @param row - Номер строки.
   **/
  has(column: number, row: number): boolean {
    if (!this.isValidPosition(column, row)) return true;
    return this.grid[column][row] === true;
  }

  /**
   * Удалить метку с ячейки.
   * @param column - Номер столбца.
   * @param row - Номер строки.
   * @return true если была метка иначе false
   **/
  delete(column: number, row: number): boolean {
    const isMarked = this.has(column, row);
    this.grid[column][row] = false;
    return isMarked;
  }

  private isValidPosition(col: number, row: number): boolean {
    const { columns, rows } = this.props;
    if (col < 0 || col >= columns || row < 0 || row >= rows) {
      return false;
    }
    return true;
  }

  /** проверка свободна ли ячейка
   * может проверять в радиусе
   **/
  isFree(col: number, row: number, radius = 0): boolean {
    if (this.has(col, row)) return false;
    if (radius === 0) return true;

    const neighbors = radius === 1 ? getHexNears(col, row) : getHexNearsInRadius(col, row, radius);
    for (let i = 0; i < neighbors.length; i++) {
      const { column, row } = neighbors[i];
      if (this.has(column, row)) return false;
    }

    return true;
  }
}
