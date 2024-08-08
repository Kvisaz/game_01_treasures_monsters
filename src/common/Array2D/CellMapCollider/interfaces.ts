export type Id = string | number;

export interface IPlace {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CellMapObject extends IPlace {
  id: Id;
  left: number;
  top: number;
  width: number;
  height: number;
}

/** коллбэк который возвращает true если надо остановить перебор массива **/
export type CellObjectsCallback = (
  cellObjects: CellMapObject[]
) => boolean | void;

export type CellObjectsHashMapCallback = (
    cellObjects: Record<Id, CellMapObject>
) => boolean | void;

/** коллбэк который возвращает true если надо остановить перебор массива **/
export type CellCallback = (column: number, row: number) => boolean | void;

export type ColumnRowKey = string;

/**
 * хранилище объектов по ключам условных ячеек
 * возвращает Record
 **/
export type CellObjectsMap = Record<ColumnRowKey, Record<Id,CellMapObject>>;

/** объект который хранит в себе информацию о предыдущем месте **/
export interface CellMapColliderObject extends CellMapObject {
  prevPlace?: IPlace;
}
