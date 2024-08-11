import { cssColorToInt } from "../../../../common";

interface IProps {
  scene: Phaser.Scene;
  color: string;
  cellSize: number;
}

/** to do если не будет привязки к логике - выноси в общие **/
export class HexCellView extends Phaser.GameObjects.Ellipse {
  constructor({ scene, color, cellSize }: IProps) {
    super(scene, 0, 0, cellSize, cellSize, cssColorToInt(color));
    this.setStrokeStyle(2, cssColorToInt("#5f675f"));
    this.setSmoothness(6);
  }
}
