import { GameObject } from "../../common";

export type ColumnRow = { column: number; row: number };
export type CenterPoint = { centerX: number; centerY: number };
export type Point = { x: number; y: number };
export type IPoint = Point;

/**
 * Неподвижная ячейка на доске
 * может иметь переменчивое состояние
 * и разный вид
 *
 * знает какие фигуры расположены в ней
 **/
export interface ISpriteGridCell<T = IFigure> extends IDestroyable {
  gameObject: GameObject;
  isPathBlock: boolean;
  column: number;
  row: number;
  placeFigure: (obj: T) => void;
  removeFigure: (obj: T) => void;
  figures: T[];
}

type WalkableCallback = (column: number, row: number) => boolean;

export interface PathProps {
  from: ColumnRow;
  to: ColumnRow;
  isWalkable?: WalkableCallback;
  columnMin?: number;
  columnMax?: number;
  rowMin?: number;
  rowMax?: number;
  maxChecks?: number;
}

export interface ISpriteGridCellStrategy {
  getColumnRow: (x: number, y: number) => ColumnRow;
  getCenterXY: (column: number, row: number) => Point;
  /** соседи в радиусе **/
  /** соседи в радиусе **/
  getNears: (column: number, row: number, radius: number) => ColumnRow[];
  getPath: (props: PathProps) => ColumnRow[];
}

/**
 * фигура на доске
 **/
export interface IFigure {
  gameObject: GameObject;
  isMovableWhenSelected: boolean;
}

export interface IFigurePlace {
  figure: IFigure;
  column: number;
  row: number;
}

/**
 * Предельно простой селектор - маркер для выделенной ячейки
 * обычно просто центрируется на выделенной ячейке
 **/
export interface ISpriteGridSelector {
  gameObject: GameObject;
  show(cellGameObject: GameObject): void;
  hide(): void;
}

export interface IDestroyable {
  destroy(): void;
}

export interface ISafeComponent extends IDestroyable {}

export type ICellBuilder = (column: number, row: number, cellSize: number) => ISpriteGridCell;

export interface ISimpleSpriteGrid extends IDestroyable {
  readonly columnsAmount: number;
  readonly rowsAmount: number;
  readonly cellSize: number;
  readonly cells2D: ISpriteGridCell[][];

  getCell(column: number, row: number): ISpriteGridCell | undefined;
  getCellByXY(x: number, y: number): ISpriteGridCell | undefined;

  getCellCenterXY(cell: ISpriteGridCell): Point;
}

export interface ISimpleGridSelector extends IDestroyable {
  switch(cell: ISpriteGridCell): void;
  show(cell: ISpriteGridCell): void;
  hide(): void;
  getSelectedCell(): ISpriteGridCell | undefined;
}

export type CellChecker = (column: number, row: number) => boolean;

export interface ISimpleGridPathMaker extends IDestroyable {
  setStart(cell: ISpriteGridCell): void;
  setFinish(cell: ISpriteGridCell): void;
  clearPath(): void;
  /**
   * проложить и нарисовать путь,
   * @param isCellPathElement - проверка проходимости ячеек для поиска пути
   * @param stopBeforeFinish - надо ли останавливаться перед финишем? Для монстров - надо.
   **/
  drawPath(isCellPathElement?: CellChecker, stopBeforeFinish?: boolean): void;
  moveFigures(onComplete?: () => void): void;
  isMovingAnimation: boolean;
  hasPath: boolean;
  startCell: ISpriteGridCell | undefined;
  finishCell: ISpriteGridCell | undefined;
}


/** билдер для элемента пути для текущей точки - с возможностью поворотов **/
export type PathElementBuilder = (current: Point, prev?: Point, next?: Point) => GameObject;
export interface IPathBuilder {
  drawElement: PathElementBuilder;
  draw: (points: Point[]) => GameObject[];
  pathPoints: Point[];
  targetPoint: Point | undefined;
  startPoint: Point | undefined;
  hasPath: boolean;
  clear: () => void;
}
