/** ghj**/
import { ISpriteGridCell, IFigure } from "../interfaces";
import { cssColorToInt, GameObject } from "../../../common";

export interface ISpriteGridColorCellData {
  cssColor: string;
}

interface IProps {
  scene: Phaser.Scene;
  column: number;
  row: number;
  color: string;
  cellSize: number;
  isPathBlock: boolean;
}
export class SpriteGridColorCell extends Phaser.GameObjects.Rectangle implements ISpriteGridCell {
  public readonly column: number;
  public readonly row: number;
  public metaData: ISpriteGridColorCellData;
  private figureSet = new Set<IFigure>();
  public gameObject: GameObject;
  public readonly isPathBlock: boolean;

  constructor({ scene, column, color, row, cellSize, isPathBlock }: IProps) {
    super(scene, 0, 0, cellSize, cellSize, cssColorToInt(color));
    this.setStrokeStyle(2, cssColorToInt("#5f675f"));
    this.column = column;
    this.row = row;
    this.metaData = {
      cssColor: color,
    };
    this.gameObject = this;
    this.isPathBlock = isPathBlock;
  }

  placeFigure(obj: IFigure) {
    this.figureSet.add(obj);

    const { centerX, centerY } = this.gameObject.getBounds();
    obj.gameObject.setPosition(centerX, centerY);
  }

  removeFigure(obj: IFigure) {
    this.figureSet.delete(obj);
  }

  get figures(): IFigure[] {
    return Array.from(this.figureSet);
  }

  set figures(figures: IFigure[]) {
    this.figureSet = new Set<IFigure>(figures);
  }
}
