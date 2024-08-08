import { Array2D } from "../Array2D";
import { IArray2DCell, Nullable } from "../interfaces";

interface IProps {
  worldWidth: number;
  worldHeight: number;
  worldCellSize: number;
}

type Id = string | number;
export type Idable = { id: Id };

/**
 * Collider using array2d
 * - need cellsize, width and height of world
 * - mark cells by objects id and size
 * - 1 object -> 1...N cells
 * - fast collision detection by cells
 * - 1 object in 1 cell
 */
export class CellCollider {
  private readonly _grid: Array2D<Idable>;
  constructor(private props: IProps) {
    const columns = Math.ceil(props.worldWidth / props.worldCellSize);
    const rows = Math.ceil(props.worldHeight / props.worldCellSize);
    this._grid = new Array2D<Idable>(columns, rows);
  }

  public get grid() {
    return this._grid;
  }

  /**
   *  Есть ли в данной точке какой-то объект
   *  возвращает его id, если да
   *  координата не включает конец
   */
  public getObjectId(x: number, y: number): Nullable<Id> {
    const col = this.getCellOrdinate(x);
    const row = this.getCellOrdinate(y);
    return this.grid.getCell(col, row).data?.id;
  }

  /***
   * проверить наличие объектов в заданном радиусе
   * радиус квадратный, то есть проверка в квадрате с центром в x,y
   * использует создание массивов 2 раза
   */
  public getObjectIdsInRadius(x: number, y: number, radius: number): Record<Id, Id> {
    return this.getObjectIdsInSquare(
      x - radius,
      y - radius,
      x + radius,
      y + radius
    );
  }

  /**
   * Возвращает объекты в радиусе
   * размеры - в единицах мира, не в ячейках!
   * использует создание массивов/объектов 2 раза
   */
  public getObjectIdsInSquare(
    left: number,
    top: number,
    width: number,
    height = width
  ): Record<Id, Id> {
    const cells = this.getCellsInSquare(left, top, width, height);
    const ids: Record<Id, Id> = {};
    for (let i = 0; i < cells.length; i++) {
      const id: Id | undefined = cells[i].data?.id;
      if (id != null) {
        ids[id] = id;
      }
    }
    return ids;
  }

  /**
   * Возвращает ячейки в квадрате
   * размеры - в единицах мира, не в ячейках!
   * если widht, height нулевые - возвращает указанную ячейку для left, top
   * использует создание массивов 1 раз
   */
  public getCellsInSquare(
    left: number,
    top: number,
    width: number,
    height = width
  ): IArray2DCell<Idable>[] {
    const cells: IArray2DCell<Idable>[] = [];
    const startCol = Math.max(this.getCellOrdinate(left), 0);
    const endCol = Math.min(
      this.getCellOrdinate(left + width),
      this.grid.lastColumn
    );

    const startRow = Math.max(this.getCellOrdinate(top), 0);
    const endRow = Math.min(
      this.getCellOrdinate(top + height),
      this.grid.lastRow
    );

    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        cells.push(this.grid.getCell(col, row));
      }
    }
    return cells;
  }

  /**
   * квадратное тело!
   * перетирает предыдущий объект!
   * **/
  placeCircleObject(
    id: string | number,
    centerX: number,
    centerY: number,
    radius: number
  ) {
    this.placeRectangleObject(
      id,
      centerX - radius,
      centerY - radius,
      centerX + radius,
      centerY + radius
    );
  }

  /***
   * перетирает предыдущий объект!
   * оптимизирован, не использует создание массивов
   */
  placeRectangleObject(
    id: string | number,
    x: number,
    y: number,
    size: number,
    height = size
  ) {
    const startCol = Math.max(this.getCellOrdinate(x), 0);
    const endCol = Math.min(
      this.getCellOrdinate(x + size),
      this.grid.lastColumn
    );

    const startRow = Math.max(this.getCellOrdinate(y), 0);
    const endRow = Math.min(
      this.getCellOrdinate(y + height),
      this.grid.lastRow
    );

    for (let col = startCol; col <= endCol; col++) {
      for (let row = startRow; row <= endRow; row++) {
        this.grid.setCell(col, row, { id });
      }
    }
  }

  getCellOrdinate(ordinate: number): number {
    return Math.floor(ordinate / this.props.worldCellSize);
  }
  /******************
   *  private
   ******************/
}
