import { Align, cssColorToInt, GameObject } from "../../../../../common";
import { ICombos, IGameFigure, IMonsterCombo, ITreasureCombo } from "../../../interfaces";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  monsterCombo?: IMonsterCombo;
  treasureCombo?: ITreasureCombo;
}

/** Скрытая до поры до времени карта  **/
export class DungeonFigure implements IGameFigure {
  private originalSize = 128;
  gameObject: GameObject;
  isMovableWhenSelected = false;
  combos: ICombos;

  constructor(private props: IProps) {
    const { monsterCombo, treasureCombo } = props;
    this.combos = {};
    if (monsterCombo) {
      this.combos.monsterCombo = monsterCombo;
    } else {
      this.combos.treasureCombo = treasureCombo;
    }
    this.gameObject = this.createObject();
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
      cssColorToInt("#2e282f")
    );

    const text = new Phaser.GameObjects.Text(scene, 0, 0, "?", {
      fontSize: "72px",
    });
    new Align(object).center(text);

    container.add([object, text]);
    return container;
  }

  public restoreScale(gameObject: GameObject = this.gameObject) {
    const { cellSize } = this.props;
    const { width, height } = gameObject.getBounds();
    const maxSize = Math.max(width, height);
    const scale = (cellSize / maxSize) * 0.75;
    gameObject.setScale(scale);
  }
}
