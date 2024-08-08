import { cssColorToInt, GameObject } from "../../../../../common";
import { FigureType, ICombos, IGameFigure, IMonsterCard, IPlayerCard, ITreasureCard } from "../../../interfaces";

interface IProps {
  scene: Phaser.Scene;
  cellSize: number;
  playerCard: IPlayerCard;
  treasureCards: ITreasureCard[];
}

export class PlayerFigure implements IGameFigure {
  private originalSize = 128;
  gameObject: GameObject;
  isMovableWhenSelected = true;
  readonly type = "player" as FigureType;

  combos: ICombos;

  private get playerCombo() {
    return this.combos.playerCombo!;
  }

  constructor(private props: IProps) {
    this.combos = {
      playerCombo: {
        playerCard: props.playerCard,
        treasureCards: props.treasureCards,
        monstersWin: [],
        diedByMonster: undefined,
      },
    };
    this.gameObject = this.createObject();
    this.restoreScale();
  }

  public addTreasure(treasureCard: ITreasureCard) {
    this.playerCombo.treasureCards.push(treasureCard);
  }

  public addMonsterAfterFight(monsterCard: IMonsterCard, isPlayerWin: boolean) {
    if (isPlayerWin) {
      this.playerCombo.monstersWin.push(monsterCard);
    } else {
      this.playerCombo.diedByMonster = monsterCard;
    }
  }

  private createObject(): GameObject {
    const { scene, cellSize } = this.props;
    const object = new Phaser.GameObjects.Ellipse(
      scene,
      0,
      0,
      this.originalSize,
      this.originalSize,
      cssColorToInt("#d109e0")
    );
    object.setStrokeStyle(2, cssColorToInt("#00480a"));
    return object;
  }

  public restoreScale(gameObject: GameObject = this.gameObject) {
    const { cellSize } = this.props;
    const { width, height } = gameObject.getBounds();
    const maxSize = Math.max(width, height);
    const scale = (cellSize / maxSize) * 0.75;
    gameObject.setScale(scale);
  }
}
