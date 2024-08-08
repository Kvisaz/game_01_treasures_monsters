import {
  IFigure,
  IFigurePlace,
  ISafeComponent,
  ISimpleGridPathMaker,
  ISimpleGridSelector,
  ISimpleSpriteGrid,
  ISpriteGridCell
} from "../../SpriteGrid/interfaces";
import { SimpleHexSpriteGrid } from "../../SpriteGrid/SimpleHexSpriteGrid";
import { SimpleHexSelector } from "../../SpriteGrid/selectors";
import { SimpleCirclePlayerObject } from "../../SpriteGrid/objects";
import { SimpleGridPathMaker } from "../../SpriteGrid/path";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
}

interface IOptions extends Partial<IProps> {
  scene: Phaser.Scene;
  cellSize?: number;
}

export class TestHexGridGame implements ISafeComponent {
  private readonly props: IProps;
  private readonly grid: ISimpleSpriteGrid;
  private readonly figures: IFigure[];
  private readonly selector: ISimpleGridSelector;
  private readonly pathMaker: ISimpleGridPathMaker;

  constructor(options: IOptions) {
    this.props = {
      scene: options.scene,
      cellSize: options.cellSize ?? 64
    };
    const { scene, cellSize } = this.props;

    this.grid = new SimpleHexSpriteGrid({
      scene,
      columns: 24,
      rows: 12,
      cellSize,
      onClick: (cell) => this.onCellClick(cell)
    });

    this.pathMaker = new SimpleGridPathMaker({
      scene,
      cellMoveDurationMs: 75,
      cells2D: this.grid.cells2D,
      columnMax: this.grid.columnsAmount - 1,
      rowMax: this.grid.rowsAmount - 1
    });

    this.figures = [];
    this.addPlayer();

    this.selector = new SimpleHexSelector({
      scene,
      cellSize
    });
  }

  destroy() {
    this.grid.destroy();
    this.figures.forEach((d) => d.gameObject.destroy());
    this.selector.destroy();
    this.pathMaker.destroy();
  }

  private addFigures(places: IFigurePlace[]) {
    const { scene } = this.props;
    places.forEach(({ column, row, figure }) => {
      const cell = this.grid.getCell(column, row);
      if (cell) {
        cell.placeFigure(figure);
      }
      scene.add.existing(figure.gameObject);
      this.figures.push(figure);
    });
  }

  private addPlayer() {
    const { scene, cellSize } = this.props;
    this.addFigures([{
      figure: new SimpleCirclePlayerObject({ scene, size: cellSize * 0.65 }),
      column: 1, row: 1
    }]);
  }

  onCellClick(cell: ISpriteGridCell) {
    if (this.pathMaker.isMovingAnimation) {
      console.warn("input blocked by pathMaker isMoveAnimation");
      return;
    }

    console.log("click on cell", cell.column, cell.row, cell);
    this.selector.switch(cell);

    /** в новой клетке есть фигуры - запоминаем их, обнуляем путь **/
    if (cell.figures.length > 0) {
      this.pathMaker.setStart(cell);
      return;
    }

    const { startCell, finishCell } = this.pathMaker;

    /** есть клетка с выделенными фигурами
     * клик на пустой клетке строит путь от фигур до этой клетки
     * если она проходима
     **/
    if (startCell && !cell.isPathBlock) {
      console.log("run draw path");
      this.pathMaker.setFinish(cell);
      this.pathMaker.clearPath();
      this.pathMaker.drawPath();
    }

    /** клик на клетке, которая уже была выделена
     * как последняя точка пути
     * запускает движение
     * блокирует ввод
     **/
    if (startCell && finishCell && cell === finishCell) {
      console.log("run move animation!");

      const onComplete = () => {
        console.log("move complete in game");
      };

      this.pathMaker.moveFigures(onComplete);
      return;
    }
  }
}
