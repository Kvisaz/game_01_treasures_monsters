export type Nullable<T> = T | null | undefined;

export interface IArray2DCell<T> {
  column: number;
  row: number;
  data: Nullable<T>;
}

export interface IGridForEachCallback<T> {
  (data: T, i: number, column: number, row: number): void;
}

export interface IGridMapCallback<From, To> {
  (data: From, column: number, row: number): To;
}

export interface ICellCallback {
  (column: number, row: number): void;
}

export type ColumnRow = { column: number; row: number };

/** пометки по массиву **/
export interface IArray2DMarker {
  /** Очистить все метки */
  clear(): void;
  /**
   * Пометить ячейку, возвращает true если ячейка не была помечена ранее, иначе false.
   * @param column - Номер столбца.
   * @param row - Номер строки.
   **/
  add(column: number, row: number): boolean;
  /**
   * Проверить, помечена ли ячейка.
   * @param column - Номер столбца.
   * @param row - Номер строки.
   **/
  has(column: number, row: number): boolean;

  /**
   * Удалить метку с ячейки.
   * @param column - Номер столбца.
   * @param row - Номер строки.
   * @return true если была метка иначе false
   **/
  delete(column: number, row: number): boolean
}

/** пометки по массиву с функционалом соседей **/
export interface IArray2DNearsMarker extends IArray2DMarker{
  /** проверка свободна ли ячейка
   * может проверять в радиусе
   **/
  isFree(col: number, row: number, radius: number): boolean
}
