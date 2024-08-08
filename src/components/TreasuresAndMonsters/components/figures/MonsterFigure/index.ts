import { Align, cssColorToInt, GameObject } from "../../../../../common";
import { ICombos, IGameFigure, IMonsterCombo } from "../../../interfaces";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  monsterCombo: IMonsterCombo;
}

export class MonsterFigure implements IGameFigure {
  private originalSize = 128;

  gameObject: GameObject;
  isMovableWhenSelected = false;

  combos: ICombos;

  constructor(private props: IProps) {
    this.gameObject = this.createObject();
    this.combos = {
      monsterCombo: props.monsterCombo,
    };
    this.restoreScale();
  }

  private createObject(): GameObject {
    const { scene } = this.props;
    const container = new Phaser.GameObjects.Container(scene);
    const object = new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      this.originalSize,
      this.originalSize,
      cssColorToInt("#7c0014")
    );
    object.setStrokeStyle(2, cssColorToInt("#00480a"));

    const text = new Phaser.GameObjects.Text(scene, 0, 0, "M", {
      fontSize: "72px",
    });
    new Align(object).center(text);
    container.add(object);
    container.add(text);
    return container;
  }

  public restoreScale(gameObject = this.gameObject) {
    const { cellSize } = this.props;
    const { width, height } = gameObject.getBounds();
    const maxSize = Math.max(width, height);
    const scale = (cellSize / maxSize) * 0.75;
    gameObject.setScale(scale);
  }
}
