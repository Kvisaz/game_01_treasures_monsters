import { GameObject, getHexGridPath } from "../../../common";
import { IPathBuilder, ISimpleGridPathMaker, ISpriteGridCell } from "../interfaces";
import { SimplePathBuilder } from "./SimplePathBuilder";

interface IProps {
  scene: Phaser.Scene;
  cells2D: ISpriteGridCell[][];
  pathColor?: string;
  cellMoveDurationMs?: number;
  columnMin?: number;
  columnMax: number;
  rowMin?: number;
  rowMax: number;
  maxChecks?: number;
}

const defaultConfig = {
  cellMoveDurationMs: 250
};

export class SimpleGridPathMaker implements ISimpleGridPathMaker {
  public startCell: ISpriteGridCell | undefined;
  public finishCell: ISpriteGridCell | undefined;
  public pathCells: ISpriteGridCell[];
  public isMovingAnimation = false;
  private readonly markersParent: Phaser.GameObjects.Container;
  private readonly markersMap: Map<ISpriteGridCell, GameObject> = new Map<ISpriteGridCell, GameObject>();
  private pathBuilder: IPathBuilder;
  private workingTweenChain: Phaser.Tweens.TweenChain | undefined;

  get hasPath(): boolean {
    return false;
  }

  constructor(private props: IProps) {
    const { scene, pathColor } = props;
    this.markersParent = new Phaser.GameObjects.Container(scene);
    this.pathBuilder = new SimplePathBuilder({ scene, cellSize: 64, pathColor });
    this.pathCells = [];
    scene.add.existing(this.markersParent);
  }

  destroy(): void {
    this.clearPath();
    this.markersParent.destroy();
    this.workingTweenChain?.destroy();
  }

  clearPath(): void {
    this.markersParent.each((obj: GameObject) => {
      this.markersMap.clear();
      this.markersParent.remove(obj);
      obj.destroy();
    });
  }

  drawPath(isCellPathElement?: (column: number, row: number) => boolean, stopBeforeFinish?: boolean): void {
    const { startCell, finishCell, props } = this;
    const { cells2D } = props;
    if (startCell == null) {
      console.warn("startCell==null");
      return;
    }
    if (finishCell == null) {
      console.warn("finishCell==null");
      return;
    }

    const isDefaultWalkable = (column: number, row: number) => cells2D[column]?.[row]?.isPathBlock === false;
    const isWalkable = isCellPathElement ?? isDefaultWalkable;
    this.pathCells = this.getPathCells(startCell, finishCell, cells2D, isWalkable);

    if (stopBeforeFinish) {
      this.pathCells.pop();
    }
    this.drawPathElements();
  }

  setStart(cell: ISpriteGridCell) {
    if (cell.figures.length == 0) {
      console.warn("cell.figures.length==0");
      return;
    }
    this.clearPath();
    this.startCell = cell;
  }

  setFinish(cell: ISpriteGridCell) {
    this.finishCell = cell;
  }

  moveFigures(onComplete?: () => void): void {
    const { startCell, finishCell } = this;
    if (startCell == null || finishCell == null) {
      console.warn("moveFigures:: startCell==null || finishCell==null");
      return;
    }

    const cellMoveDurationMs = this.props.cellMoveDurationMs ?? defaultConfig.cellMoveDurationMs;

    this.isMovingAnimation = true;

    const onAnimationComplete = () => {
      this.isMovingAnimation = false;
      this.startCell = undefined;
      this.finishCell = undefined;
      onComplete?.();
    };

    const pathCells = this.pathCells;
    const movableFigures = startCell.figures.filter((figure) => figure.isMovableWhenSelected);
    const targets = movableFigures.map((figure) => figure.gameObject);

    let currentCell = pathCells[0];

    if (startCell === finishCell || pathCells.length === 0 || currentCell == null) {
      onAnimationComplete();
      return;
    }

    this.workingTweenChain = this.props.scene.tweens.chain({
      targets,
      onComplete: onAnimationComplete,
      tweens: pathCells.map((cell) => {
        return {
          props: {
            x: cell.gameObject.x,
            y: cell.gameObject.y
          },
          duration: cellMoveDurationMs,
          onComplete: () => {
            this.eatMarker(cell);
            movableFigures.forEach((fig) => {
              currentCell.removeFigure(fig);
              cell.placeFigure(fig);
            });
            currentCell = cell;
          }
        };
      })
    });
  }

  /********
   * PRIVATE
   *********/

  private getPathCells(
    from: ISpriteGridCell,
    to: ISpriteGridCell,
    cells2D: ISpriteGridCell[][],
    isWalkable: (col: number, row: number) => boolean
  ): ISpriteGridCell[] {
    const pathColumnRows = getHexGridPath({
      ...this.props,
      isWalkable,
      from,
      to
    });

    return pathColumnRows
      .map(({ column, row }) => cells2D[column]?.[row])
      .filter((cell) => cell != null) as ISpriteGridCell[];
  }

  private drawPathElements() {
    const centers = this.pathCells.map((cell) => {
      const { centerX, centerY } = cell.gameObject.getBounds();
      return { x: centerX, y: centerY };
    });
    const pathGameObjects = this.pathBuilder.draw(centers);
    pathGameObjects.forEach((markerGameObject, cellIndex) => {
      const cell = this.pathCells[cellIndex];
      if (cell == null) {
        console.warn("null cell");
        return;
      }
      this.markersMap.set(cell, markerGameObject);
      this.markersParent.add(markerGameObject);
    });
  }

  private eatMarker(cell: ISpriteGridCell) {
    const markerObject = this.markersMap.get(cell);
    if (markerObject == null) {
      console.warn("markerObject==null for cell", cell);
      return;
    }

    this.markersParent.remove(markerObject);
    markerObject.destroy();
  }
}
