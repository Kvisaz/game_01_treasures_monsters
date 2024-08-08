import Pointer = Phaser.Input.Pointer;
import { IDestroyable, ISimpleSpriteGrid, ISpriteGridCell, ISpriteGridCellStrategy, Point } from "./interfaces";
import {
  addCameraDraggingToObject,
  forEach2D,
  GameObject,
  getHexNears,
  getRandomArrayElementWithFilter,
  makeArray2D,
  setLeftTop
} from "../../common";
import { HexStrategy } from "./strategies";
import { SpriteGridColorHexCell } from "./cells";

export interface ISimpleSpriteGridProps {
  scene: Phaser.Scene;
  columns: number;
  rows: number;
  cellSize: number;
  onClick: (cell: ISpriteGridCell) => void;
}

const CLICK_EVENT = Phaser.Input.Events.GAMEOBJECT_POINTER_UP;
const DRAG_TIME_BEFORE_CLICK = 500;

/**
 * Сетка
 * - квадратных/hex клеток фона которые могут менять цвет и отрисовку
 * - объектов по клеткам, которые могут двигаться поверх плавно
 * - условий видимости, тупо спрайты тумана для игрока
 */
export class SimpleHexSpriteGrid implements ISimpleSpriteGrid {
  private destroyables: IDestroyable[] = [];
  /** обработчик кликов и драггинга камеры **/
  private readonly inputRect: Phaser.GameObjects.Rectangle;
  /** клетки сетки  **/
  private readonly cells: ISpriteGridCell[][];

  private gridStrategy: ISpriteGridCellStrategy;

  /** todo выносим во внешку = todo объекты на клетках **/
  // private readonly objects: ISpriteGridFigure[];
  /** todo видимость - туман войны **/

  private isInputDragging = false;

  private resetCamera: (() => void) | undefined;

  /** todo выносим во внешку - логику выделения
   * то что выделяется в данный момент - актуальный клик **/
  // private selectedCell: ISpriteGridCell | undefined;

  /** todo выносим во внешку - логику выделения
   * выделенная ячейка с фигурами - сохраняется для построения маршрута **/
  // private selectedFiguresCell: ISpriteGridCell | undefined;

  /** todo выносим во внешку - логику маршрутов
   * последняя клетка пути - если на ней кликают повторно запускает движение **/
  // private selectedFiguresTargetCell: ISpriteGridCell | undefined;
  // private isMoveAnimation: boolean = false;

  getCell(column: number, row: number): ISpriteGridCell | undefined {
    return this.cells[column]?.[row];
  }

  get columnsAmount() {
    return this.props.columns;
  }

  get rowsAmount() {
    return this.props.rows;
  }

  get cellSize() {
    return this.props.cellSize;
  }

  get cells2D(){
    return this.cells;
  }

  constructor(protected props: ISimpleSpriteGridProps) {
    this.gridStrategy = new HexStrategy({ cellSize: props.cellSize });
    this.inputRect = this.createInputRect();
    this.cells = this.createCells();
    this.bindEvents();

    this.destroyables = [this.inputRect];
    forEach2D(this.cells, (cell) => {
      if (cell) this.destroyables.push(cell);
    });
  }

  destroy(): void {
    this.destroyables.forEach((d) => d.destroy());
    this.destroyables = [];
    this.resetCamera?.();
  }


  getCellCenterXY(cell: ISpriteGridCell): Point {
    return { x: cell.gameObject.x, y: cell.gameObject.y };
  }

  getCellByXY(x: number, y: number): ISpriteGridCell | undefined {
    /** тут могут быть ошибки на гранях, поэтому берем ячейки и ищем по близости к их центру **/
    const badColumnRow = this.gridStrategy.getColumnRow(x, y);

    const cell = this.getCell(badColumnRow.column, badColumnRow.row);
    const cellNearsColumnRows = getHexNears(badColumnRow.column, badColumnRow.row);
    const nears = cellNearsColumnRows.map(({ column, row }) => this.getCell(column, row));
    const cells = [cell, ...nears];

    /** Ищем ячейку чей центр ближе к точке **/
    let bestCell = cell;
    let bestDistance = Infinity;
    cells.forEach((cell) => {
      if (cell == null) return;
      const { centerY, centerX } = cell.gameObject.getBounds();
      const distance = (centerX - x) ** 2 + (centerY - y) ** 2; // вычитать корень не имеет смысла, идет сравнение
      if (distance < bestDistance) {
        bestDistance = distance;
        bestCell = cell;
      }
    });

    return bestCell;
  }

  /**
   * создаем прямоугольник для перетаскивания
   **/
  private createInputRect(): Phaser.GameObjects.Rectangle {
    const { scene, columns, rows, cellSize } = this.props;
    const width = columns * cellSize;
    const height = rows * cellSize;
    const rect = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height).setOrigin(0);
    setLeftTop(rect, 0, 0);
    scene.add.existing(rect);

    return rect;
  }

  /**
   * ячейки фона, могут иметь разный цвет и размер
   * детектят клики на себе
   **/
  private createCells(): ISpriteGridCell[][] {
    const { props, gridStrategy } = this;
    const { scene, columns, rows, cellSize } = props;
    const cells = makeArray2D(columns, rows, (col, row) => {
      const cell = this.createCell(col, row, cellSize);
      const centerPoint = gridStrategy.getCenterXY(col, row);
      setLeftTop(cell.gameObject, centerPoint.x - cellSize / 2, centerPoint.y - cellSize / 2);
      scene.add.existing(cell.gameObject);
      return cell;
    });
    return cells;
  }

  protected createCell(column: number, row: number, cellSize: number): ISpriteGridCell {
    const { scene } = this.props;

    const color = getRandomArrayElementWithFilter(["#b47c00", "#4d725c", "#fff6d6", "#8c8cb6", "#dedede", "#af0000"]);
    const isPathBlock = color === "#af0000";

    return new SpriteGridColorHexCell({
      scene,
      column,
      row,
      cellSize,
      isPathBlock,
      color,
    });
  }

  private bindEvents() {
    this.inputRect.setInteractive({
      useHandCursor: true,
      draggable: true,
    });

    this.bindClick();
    this.bindDraggingCamera();
    this.bindDisableClicksWhenDragging();
  }

  private bindClick() {
    /** Я выбираю такой способ привязки эвентов
     * чтобы не перегружать код обычных тайлов
     * и иметь возможность разруливать настройку драггинга и кликов в одном месте
     **/
    this.inputRect.on(CLICK_EVENT, (pointer: Pointer, obj: GameObject) => {
      const { worldX: x, worldY: y } = pointer;
      if (this.isInputDragging) {
        return;
      }
      const cell = this.getCellByXY(x, y);

      if (cell == null) {
        console.warn("critical error: cell undefined!");
        console.warn(`x ${x} y ${y}`);
        return;
      } else {
        this.props.onClick(cell);
      }
    });
  }




  private bindDraggingCamera() {
    const rect = this.inputRect;
    const { width, height } = rect.getBounds();

    this.resetCamera = addCameraDraggingToObject(rect, width, height);
  }

  private bindDisableClicksWhenDragging() {
    this.inputRect.on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, () => {
      this.isInputDragging = true;
    });

    this.inputRect.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, () => {
      this.inputRect.scene.time.addEvent({
        delay: DRAG_TIME_BEFORE_CLICK,
        callback: () => {
          this.isInputDragging = false;
        },
      });
    });
  }
}
