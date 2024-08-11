import { ITreasuresMonstersState, newTreasuresMonstersState } from "./state";
import { IConfig } from "./config";

interface IProps {
  scene: Phaser.Scene;
  config: IConfig;
  gameState: ITreasuresMonstersState;
}

export class TreasuresAndMonsters2 {
  private unSubs: (() => void)[] = [];
  private readonly gameState: ITreasuresMonstersState;

  /** Создание конструктора - инициализация компонента
   *  по состоянию
   **/
  constructor(private props: IProps) {
    this.gameState = props.gameState;
  }

  sub(sub: () => () => void) {
    this.unSubs.push(sub());
  }

  destroy() {
    this.unSubs.forEach(unSub => unSub());
    this.unSubs = [];
  }
}
