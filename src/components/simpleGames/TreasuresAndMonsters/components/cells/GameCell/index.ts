import { IGameCell, IGameFigure, ITerrainRule } from "../../../interfaces";
import { cssColorToInt, GameObject } from "../../../../../../common";
import { isCellPathBlock } from "../../../logic";

export interface ISpriteGridColorHexCellData {
  cssColor: string;
}
type CellData = ISpriteGridColorHexCellData;

interface IProps {
  scene: Phaser.Scene;
  column: number;
  row: number;
  color: string;
  strokeCssColor?: string;
  strokeWidth?: number;
  cellSize: number;
  terrainRule: ITerrainRule;
}

export class GameCell extends Phaser.GameObjects.Ellipse implements IGameCell {
  public readonly column: number;
  public readonly row: number;
  public metaData: CellData;
  public gameObject: GameObject;
  private figureSet = new Set<IGameFigure>();

  get isPathBlock(): boolean {
    return isCellPathBlock(this);
  }

  get terrainRule() {
    return this.props.terrainRule;
  }

  constructor(private props: IProps) {
    super(props.scene, 0, 0, props.cellSize, props.cellSize, cssColorToInt(props.color));
    const { column, color, row } = props;
    const strokeCssColor = props.strokeCssColor ?? "#2a2f2a";
    const strokeWidth = props.strokeWidth ?? 2;
    this.setStrokeStyle(strokeWidth, cssColorToInt(strokeCssColor));
    this.setSmoothness(6);
    this.column = column;
    this.row = row;
    this.metaData = {
      cssColor: color,
    };

    this.gameObject = this;
  }

  placeFigure(obj: IGameFigure) {
    this.figureSet.add(obj);
    const { centerX, centerY } = this.gameObject.getBounds();
    obj.gameObject.setPosition(centerX, centerY);
  }

  removeFigure(obj: IGameFigure) {
    this.figureSet.delete(obj);
  }

  get figures(): IGameFigure[] {
    return Array.from(this.figureSet);
  }

  set figures(figures: IGameFigure[]) {
    this.figureSet = new Set<IGameFigure>(figures);
  }
}
