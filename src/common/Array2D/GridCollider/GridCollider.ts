import { Array2D } from "../Array2D";
import {
  GridColliderArray2D,
  GridColliderCell,
  GridColliderObject,
  GridColliderObjectMap,
  Id,
  InnerGridColliderObject,
  IPlace
} from "./interfaces";
import { IArray2DCell, Nullable } from "../interfaces";
import { isCollide } from "../../collision";

interface IProps {
  worldWidth: number;
  worldHeight: number;
  cellSize: number;
}

/**
 * Класс GridCollider используется для оптимизации столкновений объектов в двумерном пространстве.
 * Он делит пространство на сетку ячеек и отслеживает, какие объекты находятся в каждой ячейке,
 * что позволяет эффективно обрабатывать столкновения и взаимодействия между объектами.
 *
 * @example
 * // Создание экземпляра с размером мира 500x500 и размером ячейки 50
 * const collider = new GridCollider({ worldWidth: 500, worldHeight: 500, cellSize: 50 });
 *
 * // Добавление объекта в коллайдер
 * collider.add({ id: 'object1', left: 100, top: 100, width: 150, height: 150 });
 *
 * объект оканчивающийся на cellSize координате (10/10) - займет 2 ячейки
 *
 */
export class GridCollider {
  /**
   * @private
   * @property {GridColliderArray2D} grid - двумерный массив, представляющий сетку,
   * где каждая ячейка содержит объекты в этой области.
   */
  private readonly grid: GridColliderArray2D;
  private readonly objects: Record<Id, InnerGridColliderObject>;

  constructor(private readonly props: IProps) {
    const columns = Math.ceil(props.worldWidth / props.cellSize);
    const rows = Math.ceil(props.worldHeight / props.cellSize);
    this.grid = new Array2D<GridColliderObjectMap>(columns, rows);
    this.objects = {};
  }

  public log() {
    console.log("objects", this.objects);
  }

  /**
   * Добавляет объект в сетку. Объект будет помещен во все ячейки, которые он занимает.
   * @param {GridColliderObject} object - Объект, который необходимо добавить в коллайдер.
   */
  public add(object: GridColliderObject) {
    if (this.objects[object.id]) return;
    this.objects[object.id] = { ...object, cells: [] };

    this.forObjectCoveredCells(object, (cell) => {
      if (cell.data == null) cell.data = {};
      cell.data[object.id] = object;
      this.objects[object.id].cells.push(cell);

      return false;
    });
  }

  public remove(object: GridColliderObject) {
    if (!this.objects[object.id]) return;

    this.objects[object.id].cells.forEach((cell) => {
      if (cell.data == null) return;
      delete cell.data[object.id];
    });

    delete this.objects[object.id];
  }

  public update(object: GridColliderObject) {
    const { cells: currentCells } = this.objects[object.id];
    currentCells.length = 0;

    this.forObjectCoveredCells(object, (cell) => {
      if (cell.data == null) cell.data = {};
      cell.data[object.id] = object;
      currentCells.push(cell);

      return false;
    });
  }

  public getCurrentObjectCells(
    object: GridColliderObject
  ): Array<GridColliderCell> {
    return this.objects[object.id].cells;
  }

  public forCurrentObjectCells(
    object: GridColliderObject,
    callback: (cell: GridColliderCell) => boolean | void
  ) {
    const cells = this.getCurrentObjectCells(object);
    for (let cell of cells) {
      if (callback(cell)) return;
    }
  }

  getAllObjects(place: IPlace): GridColliderObject[] {
    const objects: GridColliderObject[] = [];
    this.forCellsInPlace(place, (cell) => {
      const objectMap = cell.data;
      if (objectMap == null) return false;
      for (const key in objectMap) {
        const next = objectMap[key];
        objects.push(next);
      }
      return false;
    });

    return objects;
  }

  public getFirstCollisionObject(
    object: GridColliderObject
  ): Nullable<GridColliderObject> {
    let collisionObject: Nullable<GridColliderObject> = null;
    this.forCurrentObjectCells(object, (cell) => {
      const { data: objectMap } = cell;
      if (objectMap == null) return false;

      for (const key in objectMap) {
        const next = objectMap[key];
        if (isCollide(object, next)) {
          collisionObject = next;
          return true;
        }
      }
      return false;
    });
    return collisionObject;
  }

  /**
   * Выполняет колбэк для каждой ячейки, в которой находится объект сейчас
   * Если колбэк возвращает true, перебор ячеек прекращается.
   * @param {GridColliderObject} obj - Объект, для ячеек которого нужно выполнить колбэк.
   * @param {(cell: IArray2DCell<GridColliderObjectMap>) => boolean} callback - Функция, выполняемая для каждой ячейки.
   */
  public forObjectCoveredCells(
    obj: GridColliderObject,
    callback: (cell: IArray2DCell<GridColliderObjectMap>) => boolean
  ): void {
    this.forCellsInPlace(obj, callback);
  }

  /**
   * Итератор для всех ячеек для места, которое их касается или накрывает полностью
   * Может прерывать перебор, если колбэк возвращает true
   */
  public forCellsInPlace(
    place: IPlace,
    callback: (cell: IArray2DCell<GridColliderObjectMap>) => boolean
  ): void {
    const startColumn = Math.max(this.getCellOrdinate(place.left), 0);
    const endColumn = Math.min(
      this.getCellOrdinate(place.left + place.width),
      this.grid.lastColumn
    );

    const startRow = Math.max(this.getCellOrdinate(place.top), 0);
    const endRow = Math.min(
      this.getCellOrdinate(place.top + place.height),
      this.grid.lastColumn
    );

    for (let row = startRow; row <= endRow; row++) {
      for (let column = startColumn; column <= endColumn; column++) {
        const cell = this.grid.getCell(column, row);
        if (callback(cell)) return;
      }
    }
  }

  /**
   * Возвращает координату ячейки по заданному значению X или Y.
   * @param {number} xOrY - Значение X или Y координаты.
   * @returns {number} Координата ячейки.
   */
  public getCellOrdinate(xOrY: number) {
    return Math.floor(xOrY / this.props.cellSize);
  }

  public destroy() {
    for (const id in this.objects) {
      this.remove(this.objects[id]);
    }
  }

  isPlaceFree(
    left: number,
    top: number,
    width: number,
    height: number
  ): boolean {
    let isFree = true;
    const place = { left, top, width, height };
    this.forCellsInPlace(place, (cell) => {
      const objectsMap = cell.data;
      if (objectsMap == null) return false;

      const objects = Object.values(objectsMap);
      for (let i = 0; i < objects.length; i++) {
        if (isCollide(objects[i], place)) {
          isFree = false;
          return true;
        }
      }
      return false;
    });
    return isFree;
  }

  /***
   * private
   */
}
