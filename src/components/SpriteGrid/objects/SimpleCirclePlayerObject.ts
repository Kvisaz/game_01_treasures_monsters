import { IFigure } from "../interfaces";
import { cssColorToInt, GameObject } from "../../../common";

interface IProps {
  scene: Phaser.Scene;
  size: number;
}

export class SimpleCirclePlayerObject extends Phaser.GameObjects.Ellipse implements IFigure {
  public readonly gameObject: GameObject;
  public isMovableWhenSelected = true;

  constructor({ scene, size }: IProps) {
    super(scene, 0, 0, size, size, cssColorToInt("#d30000"));
    this.setStrokeStyle(4, cssColorToInt("#1e1b1b"));
    this.gameObject = this;
  }
}
