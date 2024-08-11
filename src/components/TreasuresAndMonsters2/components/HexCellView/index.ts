import { cssColorToInt } from "../../../../common";

interface IProps {
  scene: Phaser.Scene;
  color: string;
  strokeColor?: string;
  cellSize: number;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexCellView extends Phaser.GameObjects.Ellipse {
  constructor({ scene, color, cellSize, strokeColor = "#2a2f2a" }: IProps) {
    super(scene, 0, 0, cellSize, cellSize, cssColorToInt(color));
    this.setStrokeStyle(2, cssColorToInt(strokeColor));
    this.setSmoothness(6);
  }
}
