import { Align, cssColorToInt, GameObject } from "../../../../common";
import { ISpriteGridSelector } from "../../interfaces";

export interface ISpriteGridHexSelectorProps {
  scene: Phaser.Scene;
  cellSize: number;
  selectorColor?: string;
}

const STROKE_WIDTH = 8;
const STROKE_COLOR = "#4ce001";
const SIDES = 6;

export class SpriteGridHexSelector extends Phaser.GameObjects.Ellipse implements ISpriteGridSelector {
  public readonly gameObject: GameObject;

  constructor({ scene, cellSize, selectorColor = STROKE_COLOR }: ISpriteGridHexSelectorProps) {
    super(scene, 0, 0, cellSize, cellSize);
    this.setStrokeStyle(STROKE_WIDTH, cssColorToInt(selectorColor), 1);

    this.setSmoothness(SIDES);
    this.gameObject = this;
    this.hide();
  }

  show(cellGameObject: GameObject) {
    new Align(cellGameObject).center(this);
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }
}
