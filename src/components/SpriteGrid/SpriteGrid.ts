import {
  ColumnRow,
  ISpriteGridCell, IFigurePlace,
  ISpriteGridCellStrategy,
  IFigure,
  ISpriteGridSelector,
  Point
} from "./interfaces";
import {
  addCameraDraggingToObject, forEach2D,
  GameObject,
  getHexGridPath,
  getHexNears,
  makeArray2D,
  setLeftTop
} from "../../common";
import { IPathBuilder } from "./interfaces";
import Pointer = Phaser.Input.Pointer;

export interface ISpriteGridProps<T> {
  scene: Phaser.Scene;
  columns: number;
  rows: number;
  cellSize: number;
  onClick?: (column: number, row: number) => void;
  cellSelector: ISpriteGridSelector;
  cellBuilder: (column: number, row: number, cellSize: number) => ISpriteGridCell;
  startFigurePlaces: IFigurePlace[];
  gridStrategy: ISpriteGridCellStrategy;
  /** нарисовать элемент пути героя/выбранного объекта на текущей ячейке,
   * с учетом возможных поворотов**/
  pathBuilder: IPathBuilder;
}

const CLICK_EVENT = Phaser.Input.Events.GAMEOBJECT_POINTER_UP;
const DRAG_TIME_BEFORE_CLICK = 500;

/**
 * Сетка
 * - квадратных/hex клеток фона которые могут менять цвет и отрисовку
 * - объектов по клеткам, которые могут двигаться поверх плавно
 * - условий видимости, тупо спрайты тумана для игрока
 */
export class SpriteGrid<T, O> {
  /** обработчик кликов и драггинга камеры **/
  private readonly inputRect: Phaser.GameObjects.Rectangle;
  /** клетки сетки  **/
  private readonly cells: ISpriteGridCell[][];

  /** todo объекты на клетках **/
  private readonly objects: IFigure[];
  /** todo видимость - туман войны **/

  private isInputDragging = false;

  /** селектор **/
  private readonly selector: ISpriteGridSelector;

  /** то что выделяется в данный момент - актуальный клик **/
  private selectedCell: ISpriteGridCell | undefined;

  /** выделенная ячейка с фигурами - сохраняется для построения маршрута **/
  private selectedFiguresCell: ISpriteGridCell | undefined;

  /** последняя клетка пути - если на ней кликают повторно запускает движение **/
  private selectedFiguresTargetCell: ISpriteGridCell | undefined;
  private isMoveAnimation: boolean = false;
  private resetCamera: (() => void) | undefined;

  getCell(column: number, row: number): ISpriteGridCell | undefined {
    return this.cells[column]?.[row];
  }

  constructor(private props: ISpriteGridProps<T>) {
    this.inputRect = this.createInputRect();
    this.cells = this.createCells();
    this.objects = this.createObjects();
    this.createFog();
    this.selector = this.createSelector();
    this.bindEvents();
  }

  destroy() {
    forEach2D(this.cells, (cell) => {
      cell.gameObject.destroy();
      cell.figures.forEach(fig => fig.gameObject.destroy());
    });

    this.objects.forEach(obj => obj.gameObject.destroy());
    this.selector.gameObject.destroy();
    this.inputRect.destroy();
    this.resetCamera?.();
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
    const { scene, gridStrategy } = this.props;
    const { columns, rows, cellSize, cellBuilder } = this.props;
    const cells = makeArray2D(columns, rows, (col, row) => {
      const cell = cellBuilder(col, row, cellSize);
      const centerPoint = gridStrategy.getCenterXY(col, row);
      setLeftTop(cell.gameObject, centerPoint.x - cellSize / 2, centerPoint.y - cellSize / 2);
      scene.add.existing(cell.gameObject);
      return cell;
    });
    return cells;
  }

  /**
   * объекты, могут двигаться поверх ячеек
   * двигаются от центра к центру ячейки
   * движение плавное,
   * во время движения ни с кем не контактируют
   **/
  private createObjects(): IFigure[] {
    const { scene } = this.props;
    const places = this.props.startFigurePlaces;
    places.forEach(({ column, row, figure }) => {
      const cell = this.cells[column][row] as ISpriteGridCell | undefined;
      if (cell == null) {
        console.warn(`no cell for column, row ${column} ${row} `);
        return;
      }
      scene.add.existing(figure.gameObject);
      cell.placeFigure(figure);
    });
    return places.map(place => place.figure);
  }

  /**
   * туман войны, радиус видимости и тд
   * третий слой поверх всего
   **/
  private createFog() {
  }

  /**
   * selector
   * четвертый слой поверх всего
   **/
  private createSelector(): ISpriteGridSelector {
    const { scene, cellSelector } = this.props;
    scene.add.existing(cellSelector.gameObject);
    return cellSelector;
  }

  private bindEvents() {
    this.inputRect.setInteractive({
      useHandCursor: true,
      draggable: true
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
      }

      this.onCellClick(cell);
    });
  }

  private getCellByXY(x: number, y: number): ISpriteGridCell | undefined {
    /** тут могут быть ошибки на гранях, поэтому берем ячейки и ищем по близости к их центру **/
    const badColumnRow = this.props.gridStrategy.getColumnRow(x, y);

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
   *  Реши сколько у тебя на доске фигур
   *  Распиши кейсы кликов с выделенными и не выделенными фигурами
   **/
  private onCellClick(newSelectedCell: ISpriteGridCell) {
    console.log(`onCellClick`, newSelectedCell.column, newSelectedCell.row);
    if (this.isMoveAnimation) {
      console.warn("input blocked by isMoveAnimation");
      return;
    }

    /** highlight cell **/
    this.selector.hide();
    if (newSelectedCell === this.selectedCell) {
      this.selectedCell = undefined;
    } else {
      this.selectedCell = newSelectedCell;
      this.selector.show(this.selectedCell.gameObject);
    }

    /** в новой клетке есть фигуры - запоминаем их, обнуляем путь **/
    if (newSelectedCell.figures.length > 0) {
      this.clearPath();
      this.selectedFiguresCell = newSelectedCell;
      return;
    }

    /** есть клетка с выделенными фигурами
     * клик на пустой клетке строит путь от фигур до этой клетки
     * если она проходима
     **/
    if (this.selectedFiguresCell != null && newSelectedCell.figures.length == 0) {
      if (newSelectedCell.isPathBlock) {
        console.log("path blocked!");
      } else {
        this.clearPath();
        this.showPath(this.selectedFiguresCell, newSelectedCell);
        this.selectedFiguresTargetCell = newSelectedCell;
      }
    }

    /** есть клетка с выделенными фигурами
     *  клик на клетке с фигурами
     *  обнуляет путь
     *  клетка запоминается как клетка с выделенными фигурами
     **/
    if (newSelectedCell.figures.length > 0) {
      this.selectedFiguresCell = newSelectedCell;
      this.clearPath();
      return;
    }

    /** клик на клетке, которая уже была выделена
     * как последняя точка пути
     * запускает движение
     * блокирует ввод
     **/
    if (
      this.selectedFiguresCell != null &&
      this.selectedFiguresTargetCell != null &&
      newSelectedCell === this.selectedFiguresTargetCell
    ) {
      console.log("run move animation!");
      const figures = this.getFigures(this.selectedFiguresCell);
      if (figures == null) {
        console.warn("figures==null");
        return;
      }
      const path = getHexGridPath({
        from: this.selectedFiguresCell,
        to: this.selectedFiguresTargetCell
      });
      this.startFigureMoveAnimation(figures, path);
      return;
    }
  }

  private startFigureMoveAnimation(figures: IFigure[], path: ColumnRow[]) {
    const cells = path.map((columnRow) => this.getCell(columnRow.column, columnRow.row));
    const filtered = cells.filter((cell) => cell != null) as ISpriteGridCell[];
    if (cells.length > filtered.length) {
      console.warn("path cells longer then filtered!");
    }

    /** todo цепочка tweens **/

    this.isMoveAnimation = true;

    const tweenChain = this.props.scene.tweens.chain({
      targets: figures.map(figure => figure.gameObject),
      onComplete: () => {
        console.log("move end, unnblock input");
        this.isMoveAnimation = false;
      },
      tweens: filtered.map(cell => {
        return {
          props: {
            x: cell.gameObject.x,
            y: cell.gameObject.y
          },
          duration: 750
        };
      })

    });

  }

  private makeMove(from: ISpriteGridCell, to: ISpriteGridCell) {
    const selectedObjects = from.figures;
    selectedObjects.forEach((obj) => {
      from.removeFigure(obj);
      to.placeFigure(obj);
    });
    this.clearPath();
    this.showPath(from, to);
  }

  /**
   *  Path
   */
  /** hide path on grid if has visible path **/
  private clearPath() {
    this.selectedFiguresTargetCell = undefined;
    this.props.pathBuilder.clear();
  }

  /** create path and set as visible path **/
  private showPath(from: ColumnRow, to: ColumnRow) {
    const isWalkable = (column: number, row: number) => {
      const cell = this.getCell(column, row);
      return cell?.isPathBlock !== true;
    };

    const path = this.props.gridStrategy.getPath({
      from,
      to,
      isWalkable,
      rowMax: this.props.rows - 1,
      columnMax: this.props.columns - 1
    });

    const cells = path
      .map(({ column, row }) => this.getCell(column, row))
      .filter((cell) => cell != null) as ISpriteGridCell[];
    const cellCenters: Point[] = cells.map((cell) => this.getCellCenterXY(cell));

    this.props.pathBuilder.draw(cellCenters);
  }

  private getCellCenterXY(cell: ISpriteGridCell): Point {
    return { x: cell.gameObject.x, y: cell.gameObject.y };
  }

  /** @deprecated удалить или использовать в других целях **/
  private selectNears(cell?: ISpriteGridCell, selected = true) {
    if (cell == null) return;
    const radius = 2;
    const nears = this.props.gridStrategy.getNears(cell.column, cell.row, radius);

    console.log(`nears ${nears.length} for radius ${radius}`);

    nears.forEach(({ column, row }) => {
      const colCells = this.cells[column];
      if (colCells == null) return;
      const rowCell = colCells[row];
      rowCell?.gameObject.setAlpha(selected ? 0.5 : 1);
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
        }
      });
    });
  }

  private getFigures(cell?: ISpriteGridCell): IFigure[] | undefined {
    return cell && cell.figures.length > 0 ? cell.figures : undefined;
  }
}
