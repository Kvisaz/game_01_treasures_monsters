import { CellCallback, CellMapObject, CellObjectsHashMapCallback, ColumnRowKey, Id, IPlace } from "./interfaces";

import { isCollide } from "./isCollide";

interface IProps {
  cellSize: number;
}

/**
 * Класс CellMapCollider используется для оптимизации
 * столкновений объектов в двумерном пространстве.
 *
 * Он подобен GridCollider и также условно делит пространство на сетку ячеек
 * но использует Map ячеек, а не двухмерный массив
 *
 * Поэтому CellMapCollider
 * - не ограничен заранее заданными размерами мира
 * - оптимально использует память - так как хранит ячейки только с объектами,
 * а не огромное число пустых ячеек, характерных для GridCollider
 * - также он хранит инфу о предыдущем месте объекта, а не кучу ссылок на ячейки где он был
 *
 * CellMapCollider отслеживает, какие объекты находятся в каждой ячейке,
 * что позволяет эффективно обрабатывать столкновения и взаимодействия между объектами.
 *
 *
 * @example
 * // Создание экземпляра c размером ячейки 50
 * const collider = new GridCollider({ cellSize: 50 });
 *
 * // Добавление объекта в коллайдер
 * collider.add({ id: 'object1', left: 100, top: 100, width: 150, height: 150 });
 *
 * объект оканчивающийся на cellSize координате (10/10) - займет 2 ячейки
 *
 */
export class CellMapCollider {
  /**
   * 'x100y200' -> [object1, object2]
   */
  private cellMap: Record<ColumnRowKey, Record<Id, CellMapObject>>;

  constructor(private readonly props: IProps) {
    this.cellMap = {};
  }

  public log() {
    const cells = Object.values(this.cellMap);
    const objectsMap = cells.reduce(
      (acc, objects) => ({
        ...acc,
        ...objects,
      }), {}
    )
    const objects = Object.values(objectsMap).flat();
    console.log("CellMapCollider -----------");
    console.log("cellSize", this.props.cellSize);
    console.log("cells amount", cells.length);
    console.log("cellMap", this.cellMap);
    console.log("objects amount", objects.length);
  }

  /**
   * критичный базовый итератор для условных ячеек для места,
   * которое их касается или накрывает полностью
   * Может прерывать перебор, если колбэк возвращает true
   * коллбэк вызывается для всех условных ячеек вне зависимости от наличия там объекта
   */
  public forCellsInPlace(place: IPlace, callback: CellCallback): void {
    const startColumn = this.getCellOrdinate(place.left);
    const endColumn = this.getCellOrdinate(place.left + place.width);

    const startRow = this.getCellOrdinate(place.top);
    const endRow = this.getCellOrdinate(place.top + place.height);

    for (let row = startRow; row <= endRow; row++) {
      for (let column = startColumn; column <= endColumn; column++) {
        if (callback(column, row)) return;
      }
    }
  }
  /**
   * критичный базовый итератор для объектов, которые уже существуют в этом месте
   * если коллбэк вернет true, то перебор будет прерван
   */
  public forObjectsInPlace(
    place: IPlace,
    callback: CellObjectsHashMapCallback
  ): void {
    this.forCellsInPlace(place, (column, row) => {
      const cell = this.cellMap[this.getCellKey(column, row)];
      if (!cell) return;
      return callback(cell);
    });
  }

  getCurrentObjectCells(
    object: CellMapObject
  ): Record<ColumnRowKey, Record<Id, CellMapObject>> {
    const cells: Record<ColumnRowKey, Record<Id, any>> = {};
    this.forObjectCoveredCells(object, (column, row) => {
      const key = this.getCellKey(column, row);
      const objects = this.cellMap[key];
      if (objects) {
        cells[key] = this.cellMap[key];
      }
    });
    return cells;
  }

  getCurrentObjectCellsAsArray(
    object: CellMapObject
  ): Record<Id, CellMapObject>[] {
    return Object.values(this.getCurrentObjectCells(object));
  }

  /**
   * Добавляет объект в сетку. Объект будет помещен во все ячейки, которые он занимает.
   */
  public add(object: CellMapObject) {
    this.addToCells(object);
  }

  public remove(object: CellMapObject) {
    this.forCellsInPlace(object, (column, row) => {
      const cellObjects = this.getCellObjects(column, row);
      if (cellObjects == null) return;
      delete cellObjects[object.id];
      if (Object.values(cellObjects).length === 0)
        delete this.cellMap[this.getCellKey(column, row)];
    });
  }

  /**
   * Новые координаты нужны затем, чтобы по старым определять где лежит объект
   * и чистить их оттуда
   * иначе, если не сохранять старые координаты, придется для очистки
   * заводить дополнительную структуру объектов
   */
  public update(object: CellMapObject, newLeft: number, newTop: number) {
    this.remove(object);
    object.left = newLeft;
    object.top = newTop;
    this.add(object);
  }

  getAllObjects(place: IPlace): Record<Id, CellMapObject> {
    const objects: Record<Id, CellMapObject> = {};
    this.forObjectsInPlace(place, (cellObjects) => {
      for (const id in cellObjects) {
        objects[id] = cellObjects[id];
      }
    });
    return objects;
  }

  public getFirstCollisionObject(
    object: CellMapObject
  ): CellMapObject | undefined {
    let collisionObject: CellMapObject | undefined;

    this.forObjectsInPlace(object, (cellObjects) => {
      for (const key in cellObjects) {
        const next = cellObjects[key];
        if (next.id === object.id) continue;
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
   * @param {CellMapObject} obj - Объект, для ячеек которого нужно выполнить колбэк.
   * @param {(cell: IArray2DCell<CellMapObjectMap>) => boolean} callback - Функция, выполняемая для каждой ячейки.
   */
  public forObjectCoveredCells(
    obj: CellMapObject,
    callback: CellCallback
  ): void {
    this.forCellsInPlace(obj, callback);
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
    this.cellMap = {};
  }

  isPlaceFree(place: IPlace): boolean {
    let isFree = true;
    this.forObjectsInPlace(place, (cellObjects) => {
      for (const id in cellObjects) {
        const next = cellObjects[id];
        if (isCollide(place, next)) {
          isFree = false;
          return true;
        }
      }
    });

    return isFree;
  }

  /***
   * private
   */
  private getCellKey(column: number, row: number) {
    return `${column}_${row}`;
  }

  /** создаст массив если его нет **/
  private getCellObjectsAlways(
    column: number,
    row: number
  ): Record<Id, CellMapObject> {
    if (this.cellMap[this.getCellKey(column, row)] == null) {
      this.cellMap[this.getCellKey(column, row)] = {};
    }
    return this.cellMap[this.getCellKey(column, row)];
  }

  private getCellObjects(
    column: number,
    row: number
  ): Record<Id, CellMapObject> | undefined {
    return this.cellMap[this.getCellKey(column, row)];
  }

  private addToCells(object: CellMapObject) {
    this.forCellsInPlace(object, (column, row) => {
      const mapOrNewMap = this.getCellObjectsAlways(column, row);
      mapOrNewMap[object.id] = object;
    });
  }
}
